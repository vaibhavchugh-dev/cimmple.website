import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {loadEnv} from 'vite';
import {normalizeBasePath} from '../build-config.mjs';
import {company} from '../src/company.js';
import {render,pages} from '../.ssr/entry-server.js';
const env={...loadEnv('production',process.cwd(),''),...process.env};
const site=new URL(env.SITE_URL||'https://cimmple.com');
if(site.protocol!=='https:'||site.username||site.password||site.pathname!=='/'||site.search||site.hash)throw Error('SITE_URL must be an HTTPS origin without a path, credentials, query, or fragment');
const origin=site.origin;
const basePath=normalizeBasePath(env.SITE_BASE_PATH||'/');
const siteRoot=origin+basePath;
const absolute=path=>origin+basePath.slice(0,-1)+path;
const indexable=env.SEO_INDEXABLE==='true';
const template=await readFile('dist/index.html','utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const json=s=>JSON.stringify(s).replaceAll('<','\\u003c');
for(const p of pages){
 const canonical=absolute(p.path);
 const title=p.path==='/'?'Cimmple | Software, Data & Digital Engineering':p.name+' | Cimmple';
 const noindex=!indexable||p.noindex||p.kind==='resource'||p.path==='/privacy/';
 const crumbs=[{name:'Home',url:siteRoot}];
 const bits=p.path.split('/').filter(Boolean);
 for(let i=1;i<=bits.length;i++){const path='/'+bits.slice(0,i).join('/')+'/';const parent=pages.find(x=>x.path===path);if(parent&&path!=='/')crumbs.push({name:parent.name,url:absolute(path)})}
 const schema={'@context':'https://schema.org','@graph':[
<<<<<<< HEAD
 {'@type':'Organization','@id':siteRoot+'#organization',name:company.brand,legalName:company.legalName,url:siteRoot,logo:absolute('/brand/cimmple-logo.png'),email:company.email,address:{'@type':'PostalAddress',streetAddress:company.streetAddress,addressLocality:company.addressLocality,addressRegion:company.addressRegion,postalCode:company.postalCode,addressCountry:company.addressCountry},areaServed:['US','CA','IN'],contactPoint:{'@type':'ContactPoint',contactType:'sales',email:company.email,availableLanguage:['English']}},
=======
 {'@type':'Organization','@id':siteRoot+'#organization',name:'Cimmple',legalName:'Cimmplex Innovations LLP',email:'contact@cimmple.com',address:{'@type':'PostalAddress',addressLocality:'Faridabad',addressRegion:'Haryana',addressCountry:'IN'},contactPoint:{'@type':'ContactPoint',contactType:'business enquiries',email:'contact@cimmple.com'},url:siteRoot,logo:absolute('/brand/cimmple-logo.png')},
>>>>>>> 1e38c17265dd2737bb56afe2b213f81ecc960a48
 {'@type':'WebSite','@id':siteRoot+'#website',name:'Cimmple',url:siteRoot,publisher:{'@id':siteRoot+'#organization'}},
 {'@type':'WebPage','@id':canonical+'#webpage',name:p.name,description:p.description,url:canonical,isPartOf:{'@id':siteRoot+'#website'}},
 ...(p.kind==='article'?[{'@type':'Article',headline:p.name,description:p.description,mainEntityOfPage:{'@id':canonical+'#webpage'},author:{'@id':siteRoot+'#organization'},publisher:{'@id':siteRoot+'#organization'},image:absolute('/og-image.png')}]:[]),
 ...(p.kind==='service'?[{'@type':'Service',name:p.name,description:p.description,url:canonical,provider:{'@id':siteRoot+'#organization'}}]:[]),
 ...(p.path==='/'?[]:[{'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:c.url}))}])
 ]};
 const head=`<title>${esc(title)}</title><meta name="description" content="${esc(p.description)}"/><meta name="robots" content="${noindex?'noindex,follow':'index,follow'}"/><link rel="canonical" href="${canonical}"/><meta name="theme-color" content="#090716"/><meta property="og:site_name" content="Cimmple"/><meta property="og:type" content="${p.kind==='article'?'article':'website'}"/><meta property="og:title" content="${esc(title)}"/><meta property="og:description" content="${esc(p.description)}"/><meta property="og:url" content="${canonical}"/><meta property="og:image" content="${absolute('/og-image.png')}"/><meta property="og:image:width" content="525"/><meta property="og:image:height" content="476"/><meta property="og:image:alt" content="Cimmple logo"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(title)}"/><meta name="twitter:description" content="${esc(p.description)}"/><meta name="twitter:image" content="${absolute('/og-image.png')}"/><script type="application/ld+json">${json(schema)}</script>`;
 const directory='dist'+(p.path==='/'?'':p.path);
 await mkdir(directory,{recursive:true});
 await writeFile(directory+'/index.html',template.replace('<!--head-->',head).replace('<!--app-->',render(p.path)));
}
await writeFile('dist/404.html',await readFile('dist/404/index.html'));
const published=pages.filter(p=>!p.noindex&&p.kind!=='resource'&&p.path!=='/privacy/');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${published.map(p=>'<url><loc>'+absolute(p.path)+'</loc></url>').join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${absolute('/sitemap.xml')}\n`);
await writeFile('dist/deployment.json',JSON.stringify({basePath,origin,indexable},null,2));
await rm('.ssr',{recursive:true,force:true});
console.log(`Pre-rendered ${pages.length} pages. Indexing: ${indexable?'production enabled':'disabled (preview)'}`);
