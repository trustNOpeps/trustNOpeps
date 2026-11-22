import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('.',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
const port=Number(process.env.PORT)||3000;
createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const dest=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!(dest===root||dest.startsWith(root+sep))){res.writeHead(403).end('Forbidden');return}
    const st=await stat(dest);
    if(!st.isFile())throw Error('Not found');
    const body=await readFile(dest);
    res.writeHead(200,{'content-type':types[extname(dest)]||'application/octet-stream','cache-control':'no-store'}).end(body);
  }catch{res.writeHead(404).end('Not found')}
}).listen(port,()=>console.log(`ELSEWHERE running on http://localhost:${port}`));
