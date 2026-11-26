<?php
/**
 * Contact & Partnership Form Email Handler (SMTP)
 *
 * Loads credentials from (in order of precedence):
 *   1. ../smtp-config.php (outside webroot, recommended) or ./smtp-config.php
 *   2. Environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
 *      SMTP_FROM, SMTP_FROM_NAME, SMTP_TO
 */

$smtpConfig = [
    'host'     => 'mail.cimmple.net',
    'port'     => 25,
    'username' => 'noreply@cimmple.net',
    'password' => '',
    'from'     => 'noreply@cimmple.net',
    'fromName' => 'Cimmple Website',
    'to'       => 'contact@cimmple.com',
];

foreach ([dirname(__DIR__) . '/smtp-config.php', __DIR__ . '/smtp-config.php'] as $configFile) {
    if (is_readable($configFile)) {
        $loaded = require $configFile;
        if (is_array($loaded)) {
            $smtpConfig = array_merge($smtpConfig, $loaded);
            break;
        }
    }
}

$envMap = [
    'host'     => 'SMTP_HOST',
    'port'     => 'SMTP_PORT',
    'username' => 'SMTP_USER',
    'password' => 'SMTP_PASS',
    'from'     => 'SMTP_FROM',
    'fromName' => 'SMTP_FROM_NAME',
    'to'       => 'SMTP_TO',
];
foreach ($envMap as $key => $envVar) {
    $val = getenv($envVar);
    if ($val !== false && $val !== '') {
        $smtpConfig[$key] = $key === 'port' ? (int) $val : $val;
    }
}

header('Content-Type: application/json; charset=UTF-8');

$allowedOrigins = ['https://cimmple.com', 'https://www.cimmple.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Lightweight per-IP rate limit: max 5 requests per 10 minutes
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/cimmple_mail_' . md5($clientIp) . '.json';
$now = time();
$windowSeconds = 600;
$maxRequests = 5;
$timestamps = [];
if (is_readable($rateFile)) {
    $decoded = json_decode((string) @file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $timestamps = array_values(array_filter($decoded, static function ($ts) use ($now, $windowSeconds) {
            return is_int($ts) && ($now - $ts) < $windowSeconds;
        }));
    }
}
if (count($timestamps) >= $maxRequests) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many enquiries sent recently. Please try again later or email ' . $smtpConfig['to'] . '.']);
    exit();
}

$rawBody = file_get_contents('php://input');
$input = json_decode((string) $rawBody, true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request payload']);
    exit();
}

// Honeypot field: silently succeed without sending mail
if (!empty($input['website'])) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
    exit();
}

$required = ['name', 'email'];
foreach ($required as $field) {
    if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit();
    }
}

$truncate = static function ($str, $maxLen) {
    return function_exists('mb_substr') ? mb_substr($str, 0, $maxLen, 'UTF-8') : substr($str, 0, $maxLen);
};

$cleanLine = static function ($value, $maxLen = 200) use ($truncate) {
    $str = preg_replace('/[\r\n]+/', ' ', trim(strip_tags((string) $value)));
    return $truncate($str, $maxLen);
};

$name            = $cleanLine($input['name'], 120);
$email           = filter_var(preg_replace('/[\r\n]+/', '', trim((string) $input['email'])), FILTER_SANITIZE_EMAIL);
$company         = isset($input['company']) && trim((string) $input['company']) !== '' ? $cleanLine($input['company'], 160) : 'Not provided';
$phone           = isset($input['phone']) && trim((string) $input['phone']) !== '' ? $cleanLine($input['phone'], 40) : '';
$service         = isset($input['service']) && trim((string) $input['service']) !== '' ? $cleanLine($input['service'], 120) : '';
$plan            = isset($input['plan']) && trim((string) $input['plan']) !== '' ? $cleanLine($input['plan'], 120) : '';
$partnershipType = isset($input['partnershipType']) && trim((string) $input['partnershipType']) !== '' ? $cleanLine($input['partnershipType'], 120) : '';
$profile         = isset($input['profile']) && trim((string) $input['profile']) !== '' ? $cleanLine($input['profile'], 300) : '';
$enquiryType     = isset($input['enquiryType']) ? strtolower($cleanLine($input['enquiryType'], 40)) : '';
$message         = isset($input['message']) ? $truncate(trim(strip_tags((string) $input['message'])), 2000) : '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

$isPartnership = ($enquiryType === 'partnership' || $partnershipType !== '');

if ($isPartnership) {
    $heading = 'New Partnership Enquiry';
    $subject = $partnershipType !== ''
        ? "New Partnership Enquiry ($partnershipType) - from $name"
        : "New Partnership Enquiry from $name";
} elseif ($plan !== '') {
    $heading = 'New Pricing Plan Request';
    $subject = "New Pricing Plan Request: $plan - from $name";
} else {
    $heading = 'New Conversation Request';
    $subject = "New Conversation Request from $name";
}

$esc = static function ($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
};

$fields = [
    ['Name', $esc($name)],
    ['Email', "<a href='mailto:" . $esc($email) . "'>" . $esc($email) . "</a>"],
    ['Company', $esc($company)],
];

if ($phone !== '') {
    $fields[] = ['Phone', $esc($phone)];
}
if ($partnershipType !== '') {
    $fields[] = ['Partnership Type', $esc($partnershipType)];
}
if ($profile !== '') {
    $isHttpUrl = (bool) preg_match('#^https?://#i', $profile) && filter_var($profile, FILTER_VALIDATE_URL);
    $profileHtml = $isHttpUrl
        ? "<a href='" . $esc($profile) . "'>" . $esc($profile) . "</a>"
        : $esc($profile);
    $fields[] = ['LinkedIn / Website', $profileHtml];
}
if ($service !== '') {
    $fields[] = ['Interested In', $esc($service)];
}
if ($plan !== '') {
    $fields[] = ['Selected Plan', $esc($plan)];
}

$fieldsHtml = '';
foreach ($fields as [$label, $valueHtml]) {
    $fieldsHtml .= "
            <div class='field'>
                <div class='label'>{$esc($label)}:</div>
                <div class='value'>{$valueHtml}</div>
            </div>";
}

$messageSection = '';
if ($message !== '') {
    $messageSection = "
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='message-box'>" . nl2br($esc($message)) . "</div>
            </div>";
}

$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #171525; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #4F46E5; }
        .value { margin-top: 5px; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #4F46E5; margin-top: 10px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2 style='margin:0;'>{$esc($heading)}</h2>
        </div>
        <div class='content'>{$fieldsHtml}{$messageSection}
        </div>
    </div>
</body>
</html>
";

$plainLines = [
    $heading,
    str_repeat('=', 50),
    '',
    "Name: $name",
    "Email: $email",
    "Company: $company",
];
if ($phone !== '') {
    $plainLines[] = "Phone: $phone";
}
if ($partnershipType !== '') {
    $plainLines[] = "Partnership Type: $partnershipType";
}
if ($profile !== '') {
    $plainLines[] = "LinkedIn / Website: $profile";
}
if ($service !== '') {
    $plainLines[] = "Interested In: $service";
}
if ($plan !== '') {
    $plainLines[] = "Selected Plan: $plan";
}
if ($message !== '') {
    $plainLines[] = '';
    $plainLines[] = "Message:\n$message";
}
$plainText = implode("\n", $plainLines) . "\n";

/**
 * Simple SMTP Mail Class (with opportunistic STARTTLS)
 */
class SimpleSMTP {
    private $socket;
    private $host;
    private $port;
    private $username;
    private $password;
    private $timeout = 30;
    private $lastError = '';

    public function __construct($host, $port, $username, $password) {
        $this->host = $host;
        $this->port = $port;
        $this->username = $username;
        $this->password = $password;
    }

    public function getLastError() {
        return $this->lastError;
    }

    public function send($from, $fromName, $to, $subject, $htmlBody, $plainBody, $replyTo = null) {
        try {
            $this->socket = @fsockopen($this->host, $this->port, $errno, $errstr, $this->timeout);

            if (!$this->socket) {
                throw new Exception("Could not connect to SMTP server: $errstr ($errno)");
            }

            stream_set_timeout($this->socket, $this->timeout);
            $this->getResponse();

            $ehloResponse = $this->sendCommand('EHLO ' . gethostname());

            if (strpos($ehloResponse, 'STARTTLS') !== false && function_exists('stream_socket_enable_crypto')) {
                $this->sendCommand('STARTTLS');
                $crypto = @stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                if ($crypto) {
                    $this->sendCommand('EHLO ' . gethostname());
                }
            }

            $this->sendCommand('AUTH LOGIN');
            $this->sendCommand(base64_encode($this->username));
            $this->sendCommand(base64_encode($this->password));

            $this->sendCommand("MAIL FROM:<$from>");
            $this->sendCommand("RCPT TO:<$to>");
            $this->sendCommand('DATA');

            $boundary = md5(uniqid((string) time(), true));

            $headers  = "From: $fromName <$from>\r\n";
            $headers .= "To: $to\r\n";
            if ($replyTo) {
                $headers .= "Reply-To: $replyTo\r\n";
            }
            $headers .= "Subject: $subject\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
            $headers .= "\r\n";

            $body  = "--$boundary\r\n";
            $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
            $body .= $plainBody . "\r\n\r\n";

            $body .= "--$boundary\r\n";
            $body .= "Content-Type: text/html; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
            $body .= $htmlBody . "\r\n\r\n";

            $body .= "--$boundary--\r\n";

            // Dot-stuff lines starting with a period per RFC 5321
            $payload = preg_replace('/^\./m', '..', $headers . $body);
            fwrite($this->socket, $payload . "\r\n.\r\n");
            $this->getResponse();

            $this->sendCommand('QUIT');

            fclose($this->socket);
            return true;
        } catch (Exception $e) {
            $this->lastError = $e->getMessage();
            if ($this->socket) {
                fclose($this->socket);
            }
            throw $e;
        }
    }

    private function sendCommand($command) {
        fwrite($this->socket, $command . "\r\n");
        return $this->getResponse();
    }

    private function getResponse() {
        $response = '';
        while ($line = fgets($this->socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }

        $code = (int) substr($response, 0, 3);
        if ($code >= 400 || $code === 0) {
            throw new Exception("SMTP Error ($code): $response");
        }

        return $response;
    }
}

try {
    if (empty($smtpConfig['password']) || $smtpConfig['password'] === 'YOUR_EMAIL_PASSWORD') {
        throw new Exception('SMTP password is not configured. Add smtp-config.php or set SMTP_PASS.');
    }

    $smtp = new SimpleSMTP(
        $smtpConfig['host'],
        (int) $smtpConfig['port'],
        $smtpConfig['username'],
        $smtpConfig['password']
    );

    $smtp->send(
        $smtpConfig['from'],
        $smtpConfig['fromName'],
        $smtpConfig['to'],
        $subject,
        $emailBody,
        $plainText,
        $email
    );

    $timestamps[] = $now;
    @file_put_contents($rateFile, json_encode($timestamps), LOCK_EX);

    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} catch (Exception $e) {
    http_response_code(500);
    $errorMessage = $e->getMessage();

    if (strpos($errorMessage, 'password') !== false) {
        $userMessage = 'Email configuration error. Please email ' . $smtpConfig['to'] . ' directly.';
    } else {
        $userMessage = 'Failed to send email. Please try again later or email ' . $smtpConfig['to'] . ' directly.';
    }

    echo json_encode([
        'success' => false,
        'message' => $userMessage,
    ]);

    error_log('Contact Form SMTP Error: ' . $errorMessage);
}
