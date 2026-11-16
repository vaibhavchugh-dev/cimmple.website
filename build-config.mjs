export function normalizeBasePath(value='/') {
 if(typeof value!=='string'||!value.startsWith('/')||value.startsWith('//')||/[?#\\%\s]/.test(value)||value.split('/').some(x=>x==='.'||x==='..')||value.includes('//'))throw Error('SITE_BASE_PATH must be an absolute path such as / or /newdesign/');
 return value==='/'?'/':value.replace(/\/+$/,'')+'/';
}
