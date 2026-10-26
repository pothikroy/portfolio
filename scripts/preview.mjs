import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server = http.createServer(async (request, response) => {
  try {
    if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/') { response.writeHead(302, {Location:'/portfolio/'}); response.end(); return; }
    let requested = pathname.startsWith('/portfolio/') ? pathname.slice('/portfolio/'.length) : pathname.slice(1);
    if (!requested || requested.endsWith('/')) requested += 'index.html';
    const absolute = path.resolve(root, requested);
    if (!absolute.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
    try {
      const info = await stat(absolute);
      if (!info.isFile()) throw new Error('Not a file');
      const bytes = await readFile(absolute);
      response.writeHead(200, {'Content-Type':types[path.extname(absolute)] || 'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-store'});
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch {
      const bytes = await readFile(path.join(root,'404.html'));
      response.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
      response.end(request.method === 'HEAD' ? undefined : bytes);
    }
  } catch { response.writeHead(400); response.end('Bad request'); }
});
server.listen(port,'127.0.0.1',() => console.log(`Local: http://127.0.0.1:${port}/portfolio/`));
process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
