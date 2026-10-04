import { ArrowUpRight } from 'lucide-react'
import { officialMapPages, officialMapPdf, mapSource } from '../data/media'
export default function OfficialMap() {
  const base = import.meta.env.BASE_URL
  return (
    <div className="official-map-sheet">
      <p className="eyebrow">THE OFFICIAL WALKING MAP</p>
      <h3>公式の散策マップを、そのまま。</h3>
      <p>
        画像をタップすると大きく開きます。iPhoneでは指で拡大して、番号やお店の写真を確認できます。
      </p>
      {officialMapPages.map((page) => (
        <figure key={page.src}>
          <a
            href={`${base}${page.src}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`公式散策マップ ${page.title}を拡大して開く`}
          >
            <img
              src={`${base}${page.src}`}
              width={page.width}
              height={page.height}
              alt={page.alt}
              loading="lazy"
              decoding="async"
            />
          </a>
          <figcaption>
            {page.title}
            <a
              className="action"
              href={`${base}${page.src}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              画像を拡大して開く <ArrowUpRight size={14} />
            </a>
          </figcaption>
        </figure>
      ))}
      <div className="actions">
        <a
          className="action"
          href={`${base}${officialMapPdf}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          原本PDFを開く（約17MB）
          <ArrowUpRight size={14} />
        </a>
        <a className="action" href={mapSource} target="_blank" rel="noopener noreferrer">
          木綿街道公式の掲載元 <ArrowUpRight size={14} />
        </a>
      </div>
      <p className="small-note">
        出典：木綿街道公式散策マップ。原本の表裏を変更せず掲載しています。原本内には旧電話番号等が含まれるため、営業・予約の最新確認はこのガイドの各店舗ボタンから。
      </p>
    </div>
  )
}
