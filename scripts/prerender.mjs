import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {render,pages} from '../.ssr/entry-server.js';
const origin=new URL(process.env.SITE_URL||'https://cimmple.com').origin;
if(!origin.startsWith('https://'))throw Error('SITE_URL must use HTTPS');
const indexable=process.env.SEO_INDEXABLE==='true';
const template=await readFile('dist/index.html','utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const json=s=>JSON.stringify(s).replaceAll('<','\\u003c');
for(const p of pages){
 const canonical=origin+p.path;const title=p.path==='/'?'Cimmple | Software, Data & Digital Engineering':p.name+' | Cimmple';
 const noindex=!indexable||p.noindex||p.kind==='resource'||p.path==='/privacy/';
 const schema={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':origin+'/#organization',name:'Cimmple',url:origin+'/'},{'@type':'WebSite','@id':origin+'/#website',name:'Cimmple',url:origin+'/'},{'@type':p.kind==='article'?'Article':'WebPage',name:p.name,description:p.description,url:canonical,...(p.kind==='article'?{headline:p.name,author:{'@id':origin+'/#organization'}}:{})},...(p.path==='/'?[]:[{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:p.name,item:canonical}]}])]};
 const head=`<title>${esc(title)}</title><meta name="description" content="${esc(p.description)}"/><meta name="robots" content="${noindex?'noindex,follow':'index,follow'}"/><link rel="canonical" href="${canonical}"/><meta name="theme-color" content="#173e34"/><meta property="og:site_name" content="Cimmple"/><meta property="og:type" content="${p.kind==='article'?'article':'website'}"/><meta property="og:title" content="${esc(title)}"/><meta property="og:description" content="${esc(p.description)}"/><meta property="og:url" content="${canonical}"/><meta name="twitter:card" content="summary"/><meta name="twitter:title" content="${esc(title)}"/><meta name="twitter:description" content="${esc(p.description)}"/><script type="application/ld+json">${json(schema)}</script>`;
 const directory='dist'+(p.path==='/'?'':p.path);await mkdir(directory,{recursive:true});
 await writeFile(directory+'/index.html',template.replace('<!--head-->',head).replace('<!--app-->',render(p.path)));
}
await writeFile('dist/404.html',await readFile('dist/404/index.html'));
const published=pages.filter(p=>!p.noindex&&p.kind!=='resource'&&p.path!=='/privacy/');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${published.map(p=>'<url><loc>'+origin+p.path+'</loc></url>').join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await rm('.ssr',{recursive:true,force:true});console.log(`Pre-rendered ${pages.length} pages. Indexing: ${indexable?'production enabled':'disabled (preview)'}`);
