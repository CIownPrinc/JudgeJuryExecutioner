import { readFileSync, existsSync } from 'node:fs';
for (const file of ['index.html','src/main.js','src/styles/global.css']) {
  if (!existsSync(file)) throw new Error(`Missing ${file}`);
  if (!readFileSync(file,'utf8').trim()) throw new Error(`Empty ${file}`);
}
console.log('Static asset check passed.');
