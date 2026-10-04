import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { spots } from '../src/data/spots'
import { restaurants } from '../src/data/restaurants'
import { transport } from '../src/data/transport'

test('旅行の動線・曜日・地図・タップ領域', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('静かな一日。')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.locator('.bottom-nav').getByRole('link', { name: '時刻表', exact: true }).click()
  await expect(page.locator('#timetables')).toBeInViewport()
  await expect(page.locator('#timetables img')).toHaveCount(2)
  await expect(
    page
      .locator('#timetables')
      .getByRole('link', { name: '松江しんじ湖温泉駅の公式PDF', exact: true }),
  ).toHaveAttribute('href', transport.outbound)
  await expect(
    page.locator('#timetables').getByRole('link', { name: '雲州平田駅の公式PDF', exact: true }),
  ).toHaveAttribute('href', transport.return)
  await page.getByRole('button', { name: '平日', exact: true }).click()
  await expect(page.locator('.journey-summary')).toContainText('09:42 → 10:22')
  await expect(page.locator('.journey-summary')).toContainText('16:47 → 17:26')
  await page.getByRole('button', { name: '土日祝', exact: true }).click()
  await expect(page.locator('.journey-summary')).toContainText('09:45 → 10:24')
  await expect(page.locator('.journey-summary')).toContainText('16:47 → 17:24')
  await expect(
    page.locator('.return-ticket').getByRole('link', { name: '帰りの電車を確認', exact: true }),
  ).toHaveAttribute('href', transport.return)
  await page.getByRole('link', { name: '満席なら、ほかの食事候補へ' }).click()
  await expect(page.locator('#food .restaurant')).toHaveCount(3)
  await expect(page.locator('#food .menu-preview')).toHaveCount(4)
  await expect(page.locator('.official-map-sheet img')).toHaveCount(2)
  await expect(page.locator('.place-photo')).toHaveCount(2)
  await expect(
    page.locator('#food').getByRole('link', { name: 'trattorìa 814の公式Instagram' }),
  ).toHaveAttribute('href', restaurants[0].links.instagram!)
  await expect(
    page.locator('#food').getByRole('link', { name: /trattorìa 814に電話する/ }),
  ).toHaveAttribute('href', 'tel:09048997465')
  await page.getByRole('button', { name: '手仕事', exact: true }).click()
  await expect(page.locator('.spot-list')).toContainText('吾郷屋')
  await expect(page.locator('.spot-list')).toContainText('絵はがき屋さん')
  await page.getByRole('button', { name: 'すべて', exact: true }).click()
  await expect(page.locator('.spot-list .spot')).toHaveCount(spots.length)
  const undersized = await page.locator('a,button,summary').evaluateAll((nodes) =>
    nodes
      .filter((n) => {
        const r = n.getBoundingClientRect()
        return (
          r.width > 0 &&
          r.height > 0 &&
          !n.closest('details:not([open])') &&
          (r.height < 43.5 || r.width < 43.5)
        )
      })
      .map((n) => n.textContent),
  )
  expect(undersized).toEqual([])
  await page.getByRole('tab', { name: 'スポットMAP', exact: true }).click()
  await page.getByRole('button', { name: '町歩きMAPを開く' }).click()
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(spots.length + restaurants.length)
  const markerDot = await page.locator('.guide-marker span').first().boundingBox()
  expect(markerDot?.width).toBeGreaterThanOrEqual(18)
  await page.getByLabel('施設を名前で選ぶ').selectOption('umi')
  await expect(page.locator('.leaflet-popup')).toContainText('宇美神社')
  await expect(
    page.locator('.leaflet-popup').getByRole('link', { name: 'Apple Maps' }),
  ).toHaveAttribute('href', /maps.apple.com/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
  const mapResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(
    mapResults.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
  ).toEqual([])
})

test('アクセシビリティ・外部リンク・ホーム画面用ファイル', async ({ page, request }) => {
  await page.goto('')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(
    results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
  ).toEqual([])
  const unsafe = await page
    .locator('a[href^="http"]')
    .evaluateAll((nodes) =>
      nodes
        .filter(
          (n) =>
            n.getAttribute('target') !== '_blank' || !n.getAttribute('rel')?.includes('noopener'),
        )
        .map((n) => n.getAttribute('href')),
    )
  expect(unsafe).toEqual([])
  const brokenAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((nodes) =>
      nodes
        .map((n) => n.getAttribute('href')!)
        .filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
    )
  expect(brokenAnchors).toEqual([])
  for (const asset of [
    'manifest.webmanifest',
    'apple-touch-icon.png',
    'icon-192.png',
    'icon-512.png',
    'ogp.png',
    'favicon.svg',
    'townscape.svg',
    'timetables/matsue.webp',
    'timetables/hirata.webp',
    'official-map/page-1.webp',
    'official-map/page-2.webp',
    'photos/station-exterior.webp',
    'photos/kurumaya-shogato.webp',
  ])
    expect((await request.get(asset)).status()).toBe(200)
  expect((await request.head('official-map/momen-kaido-official.pdf')).status()).toBe(200)
})

test('共有・コピーと権限拒否時の代替', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          ;(window as unknown as { copied: string }).copied = text
        },
      },
    })
  })
  await page.goto('')
  await page.getByRole('button', { name: 'この旅を共有' }).click()
  await expect(page.getByRole('status')).toContainText('コピーしました')
  expect(await page.evaluate(() => (window as unknown as { copied: string }).copied)).toBe(
    'https://anemia111.github.io/momen-kaido-guide/',
  )
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('denied')
        },
      },
    }),
  )
  await page.getByRole('button', { name: 'この旅を共有' }).click()
  await expect(page.getByRole('textbox', { name: /共有用URL/ })).toHaveValue(
    'https://anemia111.github.io/momen-kaido-guide/',
  )
})

test('Web Share APIの共有とキャンセル', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => {
        ;(window as unknown as { shared: ShareData }).shared = data
      },
    }),
  )
  await page.goto('')
  await page.getByRole('button', { name: 'この旅を共有' }).click()
  await expect(page.getByRole('status')).toContainText('共有しました')
  expect(await page.evaluate(() => (window as unknown as { shared: ShareData }).shared.url)).toBe(
    'https://anemia111.github.io/momen-kaido-guide/',
  )
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'share', {
      value: async () => {
        throw new DOMException('cancelled', 'AbortError')
      },
    }),
  )
  await page.getByRole('button', { name: 'この旅を共有' }).click()
  await expect(page.getByRole('textbox', { name: /共有用URL/ })).toHaveCount(0)
})

test('写真の切替・拡大と店舗検索', async ({ page }) => {
  await page.goto('')
  await page.getByRole('button', { name: '814の店内', exact: true }).click()
  await expect(page.locator('.featured-food .gallery-image img')).toHaveAttribute(
    'src',
    /trattoria-inside/,
  )
  await page.getByRole('button', { name: 'trattorìa 814の814の店内を拡大', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'trattorìa 814の写真', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '写真を閉じる' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('searchbox', { name: 'お店を探す' }).fill('持田醤油')
  await expect(page.locator('.spot-list .spot')).toHaveCount(1)
  await expect(page.locator('.spot-list')).toContainText('醤油ソフトクリーム')
  await page.getByRole('searchbox', { name: 'お店を探す' }).fill('')
  await expect(page.locator('.spot-list .spot')).toHaveCount(12)
  await page.locator('#spot-kurumaya .place-more > summary').click()
  await expect(page.locator('#spot-kurumaya .place-more')).toContainText('営業時間')
  const broken = await page
    .locator('img')
    .evaluateAll((images) =>
      images.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    )
  expect(broken).toEqual([])
})
