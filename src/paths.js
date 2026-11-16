// Vite embeds the same base path in both client and server builds.
export const basePath=import.meta.env.BASE_URL;
export function withBase(path){
 if(typeof path!=='string'||!path.startsWith('/')||path.startsWith('//'))return path;
 return basePath==='/'?path:basePath.slice(0,-1)+path;
}
export function routeFromLocation(pathname){
 const normalized=pathname.endsWith('/')?pathname:pathname+'/';
 if(basePath==='/')return normalized;
 if(!normalized.startsWith(basePath))return '/404/';
 return '/'+normalized.slice(basePath.length);
}
