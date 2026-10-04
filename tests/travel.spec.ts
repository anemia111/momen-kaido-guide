import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {
  dayForDate,
  isHoliday,
  noticesForDate,
  japanToday,
  closureWarning,
} from '../src/data/travelDate'
import { spots } from '../src/data/spots'

test('祝日・振替休日・国民の休日と日付範囲', () => {
  for (const date of ['2026-10-12', '2026-05-06', '2026-09-22', '2027-03-22', '2028-01-10'])
    expect(isHoliday(date)).toBe(true)
  expect(dayForDate('2026-10-08')).toBe('weekday')
  expect(dayForDate('2026-10-10')).toBe('holiday')
  expect(japanToday(new Date('2026-10-05T15:00:00Z'))).toBe('2026-10-06')
  expect(noticesForDate('2026-10-06', '2026-10-04')).toHaveLength(1)
  expect(noticesForDate('2026-10-08', '2026-10-04')).toHaveLength(0)
  expect(noticesForDate('', '2026-10-08')).toHaveLength(0)
  expect(noticesForDate('', '2026-08-01')).toHaveLength(0)
  expect(
    closureWarning(
      spots.find((p) => p.id === 'center')!,
      '2026-11-03',
    ),
  ).toContain('祝日')
  expect(
    closureWarning(
      spots.find((p) => p.id === 'center')!,
      '2026-11-04',
    ),
  ).toContain('祝日翌日')
})

test('旅行日でダイヤと休館案内を切替、日付を保存', async ({ page }) => {
  await page.goto('')
  const date = page.getByLabel('旅する日', { exact: true })
  for (const [value, label, departure] of [
    ['2026-10-08', '木', '09:42'],
    ['2026-10-10', '土', '09:45'],
    ['2026-10-11', '日', '09:45'],
    ['2026-10-12', '月・祝', '09:45'],
    ['2026-09-22', '火・祝', '09:45'],
    ['2027-03-22', '月・祝', '09:45'],
  ]) {
    await date.fill(value)
    await expect(page.locator('.travel-date-label')).toContainText(`（${label}）`)
    await expect(page.locator('.journey-summary')).toContainText(departure)
    await expect(page.getByRole('button', { name: '平日', exact: true })).toBeDisabled()
  }
  await date.fill('2026-10-06')
  await expect(page.locator('.notice')).toContainText('この日は休館')
  await expect(page.locator('.timeline')).toContainText('定休日にあたる予定')
  await page.reload()
  await expect(date).toHaveValue('2026-10-06')
  await date.fill('2026-10-08')
  await expect(page.locator('.notice')).toHaveCount(0)
  await page.getByRole('button', { name: '日付をクリア' }).click()
  await expect(page.getByRole('button', { name: '平日', exact: true })).toBeEnabled()
})

test('現地の次の予定は日本時間、別日の予定とモードを区別', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-04T04:18:00Z') })
  await page.goto('')
  await page.getByRole('button', { name: '現地で使う', exact: true }).click()
  await expect(page.locator('#now-trip')).toContainText('13:18')
  await expect(page.locator('.next-stops')).toContainText('13:40')
  await expect(page.locator('.next-stops')).toContainText('吾郷屋')
  await expect(page.locator('.next-stops')).toContainText('14:20')
  await expect(page.locator('.now-return')).toContainText('16:47')
  await expect(page.locator('.bottom-nav')).toContainText('次の予定')
  const positions = await page
    .locator('#now-trip, #map, #intro')
    .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top))
  expect(positions[0]).toBeLessThan(positions[2])
  expect(positions[1]).toBeLessThan(positions[2]) // Map precedes the long introduction.
  await page.getByLabel('旅する日', { exact: true }).fill('2026-10-12')
  await expect(page.locator('#now-trip')).toContainText('この旅程は2026年10月12日')
  await expect(page.locator('.current-time')).toHaveCount(0)
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: '旅を計画', exact: true }).click()
  await expect(page.locator('#now-trip')).toHaveCount(0)
  await expect(page.locator('.hero')).toBeVisible()
})

test('飲食店も検索できる、地図タブのキーボードと高さ', async ({ page }) => {
  await page.goto('')
  for (const [query, name] of [
    ['814', 'trattorìa 814'],
    ['喜多縁', 'そば処・喜多縁'],
    ['ラーメン', '風風ラーメン 平田店'],
  ]) {
    await page.getByRole('searchbox').fill(query)
    await expect(page.locator('.restaurant-results')).toContainText(name)
    await page.locator('.restaurant-result').first().click()
    await expect(
      page.locator(
        query === '814' ? '#food-trattoria' : query === '喜多縁' ? '#food-kitaen' : '#food-fufu',
      ),
    ).toBeInViewport()
  }
  await page.getByRole('searchbox').fill('醤油')
  await expect(page.locator('.spot-list')).toContainText('岡茂一郎商店')
  await page.getByRole('tab', { name: '街道MAP', exact: true }).scrollIntoViewIfNeeded()
  const y = await page.evaluate(() => scrollY)
  await page.getByRole('tab', { name: '6km散歩', exact: true }).click()
  await expect(page.getByRole('tabpanel')).toContainText('愛宕山')
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(3)
  await page.getByRole('tab', { name: '6km散歩', exact: true }).press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'スポットMAP', exact: true })).toBeFocused()
  await expect(page.getByRole('tab', { name: 'スポットMAP', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.getByRole('tabpanel')).toContainText('OpenStreetMap')
  await page.getByRole('tab', { name: 'スポットMAP', exact: true }).press('Home')
  await expect(page.getByRole('tab', { name: '街道MAP', exact: true })).toBeFocused()
})

test('オフライン保存・通知とChromiumの再読込で旅程・地図・時刻表を確認', async ({
  page,
  context,
  browserName,
}) => {
  await page.goto('')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {
          once: true,
        }),
      )
  })
  await page.getByLabel('旅する日', { exact: true }).fill('2026-10-12')
  // Windows Playwright WebKit cannot reload a top-level page under setOffline.
  // It verifies offline notice and CacheStorage here; Chromium verifies offline navigation/fetch.
  await context.setOffline(true)
  if (browserName !== 'webkit') await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('.offline-notice')).toContainText('現在オフラインです')
  await expect(page.locator('.journey-summary')).toContainText('09:45')
  if (browserName !== 'webkit') {
    const response = await page.goto(new URL('official-map/page-1.webp', page.url()).href)
    expect(response?.headers()['content-type']).toContain('image/')
    await page.goBack({ waitUntil: 'domcontentloaded' })
  }
  await page.getByRole('tab', { name: '6km散歩', exact: true }).click()
  for (const src of [
    'timetables/hirata.webp',
    'timetables/matsue.webp',
    'official-map/page-1.webp',
    'official-map/page-2.webp',
    'official-map/hirata-walking.jpg',
  ]) {
    expect(
      await page.evaluate(
        async ({ path, webkit }) => {
          const response = webkit
            ? await caches.match(new URL(path, location.href).href)
            : await fetch(path)
          return !!response && response.ok && (await response.blob()).size > 0
        },
        { path: src, webkit: browserName === 'webkit' },
      ),
    ).toBe(true)
  }
  const cached = await page.evaluate(async () =>
    (
      await Promise.all(
        (await caches.keys()).map(async (key) =>
          (await (await caches.open(key)).keys()).map((request) => request.url),
        ),
      )
    ).flat(),
  )
  expect(cached.some((url) => url.includes('tile.openstreetmap'))).toBe(false)
  await context.setOffline(false)
})
