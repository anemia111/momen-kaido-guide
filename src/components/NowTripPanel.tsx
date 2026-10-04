import { buildSchedule } from '../data/schedule'
import { spots } from '../data/spots'
import { restaurants } from '../data/restaurants'
import { dateLabel, closureWarning, noticesForDate } from '../data/travelDate'
import { transport } from '../data/transport'
import type { DayType } from '../data/types'

export default function NowTripPanel({
  day,
  date,
  today,
  now,
}: {
  day: DayType
  date: string
  today: string
  now: Date
}) {
  const selected = date || today
  const isToday = selected === today
  const time = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now)
  const upcoming = buildSchedule(day)
    .filter((item) => !isToday || item.time >= time)
    .slice(0, 2)
  return (
    <section id="now-trip" className="section now-trip" aria-labelledby="now-title">
      <p className="eyebrow">YOUR DAY IN HIRATA</p>
      <h2 id="now-title">今日の旅</h2>
      {isToday ? (
        <p className="current-time">
          現在 <strong>{time}</strong>
          <small> 日本時間</small>
        </p>
      ) : (
        <p>この旅程は{dateLabel(selected)}の予定です</p>
      )}
      {noticesForDate(selected, today).map((notice) => (
        <p className="notice" key={notice.id}>
          この日は休館：{notice.text}{' '}
          <a className="action" href={notice.url} target="_blank" rel="noopener noreferrer">
            休館案内 ↗
          </a>
        </p>
      ))}
      <div className="next-stops">
        {upcoming.map((item, index) => {
          const place = [...spots, ...restaurants].find((p) => p.id === item.spotId)
          const warning = place && closureWarning(place, selected)
          return (
            <div key={`${item.time}-${item.title}`}>
              <p className="eyebrow">
                {isToday ? (index === 0 ? '次' : 'その次') : index === 0 ? '最初の予定' : 'その次'}
              </p>
              <time>{item.time}</time>
              <h3>{place?.name ?? item.title}</h3>
              <p>{item.description}</p>
              {warning && <p className="small-note">{warning}</p>}
              {place?.links.appleMaps && (
                <a
                  className="action"
                  href={place.links.appleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {place.name}のApple Maps ↗
                </a>
              )}
              {place &&
                (place.links.today ??
                  place.links.instagram ??
                  place.links.official ??
                  place.links.facebook) && (
                  <a
                    className="action"
                    href={
                      place.links.today ??
                      place.links.instagram ??
                      place.links.official ??
                      place.links.facebook
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    営業情報を確認 ↗
                  </a>
                )}
              {place?.links.phone && (
                <a
                  className="action"
                  href={`tel:${place.links.phone.replaceAll('-', '')}`}
                  aria-label={`${place.name}に電話する`}
                >
                  電話する
                </a>
              )}
            </div>
          )
        })}
        {!upcoming.length && (
          <p>今日の基本旅程は終了しました。帰りの電車は公式時刻表で確認できます。</p>
        )}
        <div className="now-return">
          <p className="eyebrow">帰りの電車</p>
          <time>{transport[day].returnDeparture}</time>
          <h3>雲州平田 → 松江しんじ湖温泉</h3>
          <p>
            {transport[day].returnArrival}着 / {day === 'weekday' ? '平日' : '土日祝'}
            ダイヤの基本旅程
          </p>
          {isToday && time > transport[day].returnDeparture && (
            <p className="small-note">
              予定の出発時刻を過ぎています。次の電車は公式時刻表をご確認ください。
            </p>
          )}
          <a className="action" href="#timetables">
            保存した時刻表を見る
          </a>
        </div>
      </div>
      <p className="small-note">
        予定時刻をもとにした案内です。現在地や運行・営業状況は判定していません。
      </p>
    </section>
  )
}
