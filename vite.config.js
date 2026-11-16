import {defineConfig,loadEnv} from 'vite';
import {normalizeBasePath} from './build-config.mjs';
export default defineConfig(({mode})=>{
 const env={...loadEnv(mode,process.cwd(),''),...process.env};
 return {base:normalizeBasePath(env.SITE_BASE_PATH||'/')};
});
