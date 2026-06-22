import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const requiredFiles = [
  'index.html',
  'src/main.js',
  'src/app.js',
  'src/game/caseGenerator.js',
  'src/game/content.js',
  'src/game/random.js',
  'src/game/scoring.js',
  'src/ui/templates.js',
  'src/styles/global.css',
];

for (const file of requiredFiles) {
  if (!existsSync(file)) throw new Error(`Missing ${file}`);
  if (!readFileSync(file, 'utf8').trim()) throw new Error(`Empty ${file}`);
}

function collectJsFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return collectJsFiles(path);
    return path.endsWith('.js') ? [path] : [];
  });
}

for (const file of collectJsFiles('src')) {
  await import(`../${file}?check=${Date.now()}`);
}

console.log('Static asset and module check passed.');
import { readFileSync, existsSync } from 'node:fs';
for (const file of ['index.html','src/main.js','src/styles/global.css']) {
  if (!existsSync(file)) throw new Error(`Missing ${file}`);
  if (!readFileSync(file,'utf8').trim()) throw new Error(`Empty ${file}`);
}
console.log('Static asset check passed.');
