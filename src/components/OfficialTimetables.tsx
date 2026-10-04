import { transport } from '../data/transport'

export default function OfficialTimetables() {
  return (
    <div id="timetables" className="official-timetables">
      <h3>行きと帰りの、公式時刻表。</h3>
      <p>
        両駅の公式時刻表をそのまま表示しています。表をタップすると、駅別の公式PDFが直接開きます。
      </p>
      <div className="timetable-grid">
        {[
          {
            id: 'matsue',
            name: '松江しんじ湖温泉駅',
            direction: '行き · 雲州平田方面',
            url: transport.outbound,
          },
          {
            id: 'hirata',
            name: '雲州平田駅',
            direction: '帰り · 松江しんじ湖温泉方面',
            url: transport.return,
          },
        ].map((station) => (
          <article key={station.id}>
            <p className="eyebrow">{station.direction}</p>
            <h4>{station.name}</h4>
            <a
              href={station.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${station.name}の公式時刻表PDFを開く`}
            >
              <img
                src={`${import.meta.env.BASE_URL}timetables/${station.id}.webp`}
                alt={`${station.name}の公式時刻表。平日・休日の発車時刻を掲載`}
                width="1400"
                height={station.id === 'matsue' ? 1980 : 990}
                loading="lazy"
                decoding="async"
              />
            </a>
            <a className="button" href={station.url} target="_blank" rel="noopener noreferrer">
              {station.name}の公式PDF
            </a>
          </article>
        ))}
      </div>
      <p className="small-note">
        出典：一畑電車公式 · {transport.revision}
        。雲州平田駅の表は「松江しんじ湖温泉行」の欄を確認してください。臨時ダイヤ・運休は当日の公式運行情報をご確認ください。
      </p>
      <a className="action" href={transport.timetable} target="_blank" rel="noopener noreferrer">
        改正・全駅の時刻表を確認
      </a>
    </div>
  )
}
