import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

// Generate an atomic precache from the actual output, including hashed lazy chunks.
// Only our app assets are included; external links and map tiles never enter this cache.
export default function offlinePlugin(): Plugin {
  let output: string
  let base: string
  return {
    name: 'travel-offline',
    apply: 'build',
    configResolved(config) {
      output = resolve(config.root, config.build.outDir)
      base = config.base
    },
    async closeBundle() {
      const files = (await readdir(output, { recursive: true }))
        .map((file) => file.replaceAll('\\', '/'))
        .filter(
          (file) => /\.(html|js|css|webp|jpg|png|svg|webmanifest)$/.test(file) && file !== 'sw.js',
        )
        .sort()
      const hash = createHash('sha256')
      for (const file of files) hash.update(await readFile(resolve(output, file)))
      const cache = `momen-offline-${hash.digest('hex').slice(0, 16)}`
      const urls = files.map((file) => `${base}${file}`)
      await writeFile(
        resolve(output, 'sw.js'),
        `
const CACHE = ${JSON.stringify(cache)};
const URLS = ${JSON.stringify(urls)};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('momen-offline-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(${JSON.stringify(base)})) return;
  if (URLS.includes(url.pathname)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(url.pathname)).then(saved => saved || fetch(event.request)));
  } else if (event.request.mode === 'navigate' && url.pathname === ${JSON.stringify(base)}) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(${JSON.stringify(`${base}index.html`)})).then(saved => saved || fetch(event.request)));
  }
});
`,
      )
    },
  }
}
