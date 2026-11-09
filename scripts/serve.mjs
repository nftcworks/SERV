import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname } from 'node:path';
import { networkInterfaces } from 'node:os';
import { spawn } from 'node:child_process';

const origin = 'http://127.0.0.1';
const port = Number(process.env.SERV_PORT || 4173);
const phone = process.argv.includes('--phone');
const open = process.argv.includes('--open');
const root = new URL('../', import.meta.url);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

const server = createServer(async (request, response) => {
  const path = new URL(request.url, origin).pathname;
  const name = path === '/' ? 'index.html' : path.slice(1);
  if (!['index.html', 'styles.css', 'app.js', 'assets/nav-glass.js', 'assets/liquidglass-1.0.3.js'].includes(name) && !/^assets\/[\w.-]+\.(svg|webp)$/.test(name)) {
    response.writeHead(404).end('Page not found');
    return;
  }
  try {
    const file = new URL(name, root);
    const info = await stat(file);
    response.writeHead(200, { 'Content-Type': types[extname(name)], 'Content-Length': info.size, 'Cache-Control': 'no-cache' });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end('Page not found');
  }
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Close the other local server or set SERV_PORT to another port.` : error.message);
  process.exitCode = 1;
});

server.listen(port, phone ? '0.0.0.0' : '127.0.0.1', () => {
  const local = `${origin}:${server.address().port}`;
  console.log(`Local: ${local}`);
  if (phone) {
    const addresses = new Set(Object.values(networkInterfaces()).flat().filter((entry) => entry?.family === 'IPv4' && !entry.internal).map((entry) => entry.address));
    for (const address of addresses) console.log(`Same Wi-Fi: http://${address}:${server.address().port}`);
  }
  console.log('Keep this window open while using SERV. Press Ctrl+C to stop.');
  if (open && process.platform === 'win32') {
    const browser = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', local], { detached: true, stdio: 'ignore', windowsHide: true });
    browser.on('error', () => console.log(`Open ${local} in your browser.`));
    browser.unref();
  }
});
