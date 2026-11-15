import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pages} from '../src/content.js';
const titles=new Set(),descriptions=new Set();let count=0;
for(const p of pages){const html=await readFile('dist'+(p.path==='/'?'':p.path)+'/index.html','utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,p.path+' needs one H1');const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title),'Duplicate title '+title);titles.add(title);const desc=html.match(/name="description" content="([^"]*)"/)[1];assert(!descriptions.has(desc),'Duplicate description '+p.path);descriptions.add(desc);assert(html.includes('rel="canonical"'));assert(html.includes('application/ld+json'));for(const match of html.matchAll(/href="(\/[^"#?]*)"/g)){const url=match[1];if(extAsset(url))continue;assert(pages.some(p=>p.path===url),'Broken internal link '+url+' on '+p.path)}assert(!/hospitality/i.test(html));count++}
function extAsset(s){return /\.[a-z0-9]+$/i.test(s)}
const map=await readFile('dist/sitemap.xml','utf8');for(const p of pages.filter(p=>!p.noindex&&p.kind!=='resource'&&p.path!=='/privacy/'))assert(map.includes(p.path+'</loc>'));
console.log(`PASS: ${count} pages; unique titles/descriptions, H1s, canonical URLs, structured data, internal links, sitemap, Hospitality exclusion.`);
