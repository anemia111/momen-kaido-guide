import { chromium } from '@playwright/test'
import { writeFile, mkdir } from 'node:fs/promises'

await mkdir('docs/screenshots', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto(process.env.AUDIT_URL ?? 'http://127.0.0.1:4174/momen-kaido-guide/')
await page.screenshot({ path: 'docs/screenshots/iphone-390.png' })
await page.setViewportSize({ width: 1440, height: 1000 })
await page.screenshot({ path: 'docs/screenshots/desktop-1440.png' })
await page.getByRole('button', { name: '町歩きMAPを開く' }).click()
await page.waitForSelector('.leaflet-marker-icon')
const links = await page
  .locator('a[href^="http"]')
  .evaluateAll((nodes) => [...new Set(nodes.map((n) => n.getAttribute('href')))])
await browser.close()
const results = []
let next = 0
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (next < links.length) {
      const url = links[next++]
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(20000),
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MomenKaidoLinkCheck/1.0)' },
        })
        results.push({ url, status: response.status, finalUrl: response.url })
        await response.body?.cancel()
      } catch (error) {
        results.push({ url, status: '要確認', error: String(error.cause?.code ?? error.message) })
      }
    }
  }),
)
results.sort((a, b) => a.url.localeCompare(b.url))
await writeFile(
  'docs/link-audit.json',
  JSON.stringify({ checkedAt: new Date().toISOString(), links: results }, null, 2) + '\n',
)
const rows = results.map(
  (r) =>
    `| [リンク](${r.url}) | ${r.status} | ${r.error ?? (r.finalUrl === r.url ? '' : '転送あり')} |`,
)
await writeFile(
  'docs/external-links.md',
  `# 外部リンク一覧と接続検査\n\n${new Date().toISOString()} 検査。掲載リンクは地図・SNS・出典を含め重複を除いて検査しています。HTTP成功は営業中や情報内容の正しさを保証しません。SNSの本人性は公式サイトからのリンクで別途確認しています。403、429、接続エラーは自動検査制限の可能性があり、情報源の照合・ブラウザーで追加確認します。\n\n| URL | HTTP結果 | 備考 |\n| --- | --- | --- |\n${rows.join('\n')}\n`,
)
console.log(
  JSON.stringify(
    { total: results.length, attention: results.filter((r) => r.status !== 200) },
    null,
    2,
  ),
)
