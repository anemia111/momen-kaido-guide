import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const browser = await chromium.launch()
const page = await browser.newPage()
const icon = await readFile('public/favicon.svg', 'utf8')
for (const [name, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<style>body{margin:0}svg{width:100vw;height:100vh}</style>${icon}`)
  await page.screenshot({ path: `public/${name}` })
}
await page.setViewportSize({ width: 1200, height: 630 })
const townscape = await readFile('public/townscape.svg', 'utf8')
await page.setContent(
  `<html lang="ja"><style>body{margin:0;background:#f8f6ef;color:#292e2a;width:1200px;height:630px;display:flex;align-items:center;font-family:'Yu Mincho',serif}.copy{margin-left:75px;width:480px;flex-shrink:0}h1{font-size:62px;line-height:1.55;font-weight:500;letter-spacing:6px;margin:20px 0}p{font-family:'Yu Gothic',sans-serif;font-size:18px;line-height:2}.eyebrow{font:12px sans-serif;letter-spacing:3px;color:#62685f}.art{width:650px;margin-left:-20px}.art svg{width:100%;height:auto}</style><div class="copy"><div class="eyebrow">MATSUE → UNSHŪ-HIRATA / ONE DAY TRIP</div><h1>木綿街道、<br>静かな一日。</h1><p>松江から一畑電車で約40分。<br>町家と老舗を歩く、日帰り旅。</p></div><div class="art">${townscape}</div></html>`,
)
await page.screenshot({ path: 'public/ogp.png' })
await browser.close()
