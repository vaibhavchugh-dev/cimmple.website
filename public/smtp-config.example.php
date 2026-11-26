<?php
if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'] ?? '')) {
    http_response_code(403);
    exit;
}

/**
 * Copy this file to smtp-config.php (either one directory above webroot, or
 * alongside send-email.php) and set your real SMTP password.
 * Never commit smtp-config.php to version control.
 */
return [
    'host'     => 'mail.cimmple.net',
    'port'     => 25,
    'username' => 'noreply@cimmple.net',
    'password' => 'YOUR_EMAIL_PASSWORD',
    'from'     => 'noreply@cimmple.net',
    'fromName' => 'Cimmple Website',
    'to'       => 'contact@cimmple.com',
];
