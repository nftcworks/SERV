import { cp, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await mkdir(output, { recursive: true });
for (const entry of ['index.html', 'styles.css', 'app.js', 'assets']) {
  await cp(new URL(entry, root), new URL(entry, output), { recursive: true });
}
console.log('SERV is ready in dist/.');
