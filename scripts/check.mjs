import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {pages} from '../src/content.js';
const {basePath,origin,indexable}=JSON.parse(await readFile('dist/deployment.json','utf8'));
const publicPath=p=>basePath.slice(0,-1)+p;
const diskPath=p=>'dist/'+p.slice(basePath.length);
const titles=new Set(),descriptions=new Set();let count=0;
for(const p of pages){
 const html=await readFile('dist'+(p.path==='/'?'':p.path)+'/index.html','utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,p.path+' needs one H1');
 const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title),'Duplicate title '+title);titles.add(title);
 const desc=html.match(/name="description" content="([^"]*)"/)[1];assert(!descriptions.has(desc),'Duplicate description '+p.path);descriptions.add(desc);
 assert.equal(html.match(/rel="canonical" href="([^"]*)"/)[1],origin+publicPath(p.path));
 const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert(data['@graph'].some(x=>x['@type']==='WebPage'));
 for(const item of data['@graph']){if(item.url)assert(item.url.startsWith(origin+basePath));if(item.logo)assert(item.logo.startsWith(origin+basePath));}
 assert(html.includes('og:image'));assert(html.includes('summary_large_image'));
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 for(const match of html.matchAll(/(?:href|src)="(\/[^"?]*|#[^"]*)"/g)){
  const [url,fragment]=match[1].split('#');if(!url){assert(ids.has(fragment),'Broken fragment '+fragment+' on '+p.path);continue}
  assert(url.startsWith(basePath),'Root-relative path outside deployment: '+url+' on '+p.path);
  if(/\.[a-z0-9]+$/i.test(url)){await access(diskPath(url));continue}
  const route='/'+url.slice(basePath.length);assert(pages.some(p=>p.path===route),'Broken link '+url+' on '+p.path);
 }
 assert(!/hospitality/i.test(html));
 const noindex=!indexable||p.kind==='resource'||p.noindex||p.path==='/privacy/';assert(html.includes('content="'+(noindex?'noindex,follow':'index,follow')+'"'));
 if(['service','industry','solution'].includes(p.kind)){for(const id of(p.kind==='solution'?['overview','capabilities','workflow','integrations','impact','faqs']:['overview','approach','capabilities','advantage','impact','insights','faqs']))assert(ids.has(id),'Missing section '+p.path+' '+id);}
 count++;
}
const home=await readFile('dist/index.html','utf8');const cssFiles=[...home.matchAll(/href="([^"]+\.css)"/g)].map(x=>x[1]);assert(cssFiles.length);
for(const file of cssFiles){const css=await readFile(diskPath(file),'utf8');for(const m of css.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/g)){const value=m[1];if(value.startsWith('/')){assert(value.startsWith(basePath),'CSS asset outside base: '+value);await access(diskPath(value));}else if(!value.startsWith('data:')&&!value.startsWith('http')){const u=new URL(value,'https://example.test'+file);await access(diskPath(u.pathname));}}}
const map=await readFile('dist/sitemap.xml','utf8');for(const p of pages.filter(p=>!p.noindex&&p.kind!=='resource'&&p.path!=='/privacy/'))assert(map.includes(origin+publicPath(p.path)+'</loc>'));
console.log(`PASS: ${count} pages at ${basePath}; CSS, images, fonts, scripts, navigation, canonical URLs, JSON-LD, indexing, sitemap and page sections.`);
