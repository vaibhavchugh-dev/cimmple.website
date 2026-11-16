import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const profile=process.argv[2];
if(!['root','newdesign'].includes(profile))throw Error('Expected root or newdesign build profile');
const env={...process.env,SITE_BASE_PATH:profile==='newdesign'?'/newdesign/':'/',SEO_INDEXABLE:profile==='root'?'true':'false'};
const commands=[['node_modules/vite/bin/vite.js','build'],['node_modules/vite/bin/vite.js','build','--ssr','src/entry-server.jsx','--outDir','.ssr'],['scripts/prerender.mjs'],['scripts/check.mjs']];
for(const args of commands){const r=spawnSync(process.execPath,[resolve(args[0]),...args.slice(1)],{stdio:'inherit',env});if(r.status!==0)process.exit(r.status||1)}
