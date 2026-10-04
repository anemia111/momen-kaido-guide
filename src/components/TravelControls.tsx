import { dateLabel, validDate } from '../data/travelDate'
import type { DayType } from '../data/types'

export default function TravelControls({
  mode,
  onMode,
  date,
  onDate,
  day,
}: {
  mode: 'plan' | 'local'
  onMode: (value: 'plan' | 'local') => void
  date: string
  onDate: (value: string) => void
  day: DayType
}) {
  return (
    <div className="travel-controls">
      <div className="mode-switch" role="group" aria-label="旅手帖の使い方">
        <button aria-pressed={mode === 'plan'} onClick={() => onMode('plan')}>
          旅を計画
        </button>
        <button aria-pressed={mode === 'local'} onClick={() => onMode('local')}>
          現地で使う
        </button>
      </div>
      {mode === 'local' && <TravelDatePicker date={date} onDate={onDate} day={day} />}
    </div>
  )
}

export function TravelDatePicker({
  date,
  onDate,
  day,
}: {
  date: string
  onDate: (value: string) => void
  day: DayType
}) {
  return (
    <div className="travel-date-controls">
      <div className="travel-date">
        <label htmlFor="travel-date">旅する日</label>
        <input
          id="travel-date"
          type="date"
          min="2022-01-01"
          max="2099-12-31"
          value={date}
          aria-describedby="date-guidance"
          onChange={(e) => {
            if (!e.target.value || validDate(e.target.value)) onDate(e.target.value)
          }}
        />
        {date && (
          <button className="action" onClick={() => onDate('')}>
            日付をクリア
          </button>
        )}
      </div>
      <p className="travel-date-label" aria-live="polite">
        {date ? dateLabel(date) : '日付未指定'} / {day === 'weekday' ? '平日' : '土日祝'}ダイヤ
      </p>
      <p id="date-guidance" className="small-note">
        旅行日を選ぶとダイヤを自動選択します。2028年以降の春分・秋分は推計です。将来の祝日・法改正は自動判定できない場合があります。公式時刻表をご確認ください。
      </p>
    </div>
  )
}
