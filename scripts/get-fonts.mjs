import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { get } from 'https';
import { join } from 'path';

const outDir = join(process.cwd(), 'public', 'fonts');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const files = [
  { url: 'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf', name: 'NotoSans-Regular.ttf' },
  { url: 'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf', name: 'NotoSans-Bold.ttf' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

for (const f of files) {
  const dest = join(outDir, f.name);
  if (existsSync(dest)) continue;
  console.log('Downloading', f.name);
  // eslint-disable-next-line no-await-in-loop
  await download(f.url, dest);
}
console.log('Fonts ready at /public/fonts');
