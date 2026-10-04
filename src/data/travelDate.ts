import type { DayType, Spot } from './types'
import { closureNotices } from './editorial'

export function japanToday(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(now)
}
export function dateValue(value: string) {
  return new Date(`${value}T00:00:00Z`)
}
export function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    value >= '2022-01-01' &&
    value <= '2099-12-31' &&
    !Number.isNaN(dateValue(value).getTime()) &&
    dateValue(value).toISOString().slice(0, 10) === value
  )
}
const shift = (value: string, days: number) => {
  const date = dateValue(value)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}
const years = new Map<number, Set<string>>()
// Source: https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html (2026-10-04).
// Current law from 2022 onward. Future equinox dates are estimates, not official announcements.
function holidays(year: number) {
  const cached = years.get(year)
  if (cached) return cached
  const result = new Set<string>()
  const add = (month: number, day: number) =>
    result.add(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
  for (const [month, day] of [
    [1, 1],
    [2, 11],
    [2, 23],
    [4, 29],
    [5, 3],
    [5, 4],
    [5, 5],
    [8, 11],
    [11, 3],
    [11, 23],
  ])
    add(month, day)
  for (const [month, nth] of [
    [1, 2],
    [7, 3],
    [9, 3],
    [10, 2],
  ]) {
    const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
    add(month, 1 + ((8 - first) % 7) + (nth - 1) * 7)
  }
  add(
    3,
    year === 2026
      ? 20
      : year === 2027
        ? 21
        : Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4)),
  )
  add(
    9,
    year === 2026 || year === 2027
      ? 23
      : Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4)),
  )
  const national = [...result].sort()
  for (const date of national) {
    if (result.has(shift(date, 2))) result.add(shift(date, 1))
  }
  for (const date of national) {
    if (dateValue(date).getUTCDay() === 0) {
      let substitute = shift(date, 1)
      while (result.has(substitute)) substitute = shift(substitute, 1)
      result.add(substitute)
    }
  }
  years.set(year, result)
  return result
}
export function isHoliday(value: string) {
  const year = Number(value.slice(0, 4))
  return year >= 2022 && year <= 2099 && holidays(year).has(value)
}
export function dayForDate(value: string): DayType {
  return [0, 6].includes(dateValue(value).getUTCDay()) || isHoliday(value) ? 'holiday' : 'weekday'
}
export function dateLabel(value: string) {
  const date = dateValue(value)
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日（${'日月火水木金土'[date.getUTCDay()]}${isHoliday(value) ? '・祝' : ''}）`
}
export function noticesForDate(selected: string, today: string) {
  return closureNotices
    .filter((notice) =>
      selected
        ? notice.start <= selected && selected <= notice.end
        : notice.end >= today && (notice.displayFrom ?? shift(notice.start, -30)) <= today,
    )
    .sort((a, b) => a.start.localeCompare(b.start))
}
export function closureWarning(place: Spot, value: string) {
  if (noticesForDate(value, value).some((notice) => notice.id.startsWith(`${place.id}-`)))
    return 'この日は休館案内があります。最新情報は公式案内を確認。'
  const weekday = dateValue(value).getUTCDay()
  if (place.closedWeekdays?.includes(weekday)) {
    if (place.holidayClosureNextDay && isHoliday(value))
      return '祝日の営業・翌日の休館は公式案内を確認。'
    return `定休日にあたる予定です（${place.closed}）。最新情報は公式案内を確認。`
  }
  if (
    place.holidayClosureNextDay &&
    place.closedWeekdays?.includes(dateValue(shift(value, -1)).getUTCDay()) &&
    isHoliday(shift(value, -1))
  )
    return '祝日翌日の休館にあたる可能性があります。最新情報は公式案内を確認。'
  return ''
}
