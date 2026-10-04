import { ArrowUpRight } from 'lucide-react'

const source =
  'https://www1.pref.shimane.lg.jp/medical/kenko/kikan/izumo_hoken/izumokenkotyouju/uxokinnguko-su.html'

export default function WalkingCourse() {
  const base = import.meta.env.BASE_URL
  const image = `${base}official-map/hirata-walking.jpg`
  return (
    <article id="walking-course" className="walking-course" aria-labelledby="walking-course-title">
      <p className="eyebrow">A LONGER WALK IN HIRATA</p>
      <div className="walking-course-intro">
        <div>
          <h3 id="walking-course-title">町並みの、その先へ。</h3>
          <p>
            もう少し歩きたい日は、愛宕山と平田の街へ。木綿街道の町並みから公園の緑、川沿いの風景まで、景色の変化を楽しむ散歩です。
          </p>
        </div>
        <dl className="walking-course-facts">
          <div>
            <dt>公式コースの距離</dt>
            <dd>約6km</dd>
          </div>
          <div>
            <dt>写真・休憩を含む目安</dt>
            <dd>2〜3時間</dd>
          </div>
        </dl>
      </div>
      <p className="walking-course-name">愛宕山＆平田の街 散策コース</p>
      <figure className="walking-course-map">
        <a
          href={image}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="愛宕山・平田の街の散策マップを拡大して開く"
        >
          <img
            src={image}
            width="1280"
            height="835"
            alt="愛宕山＆平田の街散策コースの地図。約6キロの赤いルートと、愛宕山公園、平田本陣記念館、木綿街道、休憩場所・駐車場・トイレを表示。"
            loading="lazy"
            decoding="async"
          />
        </a>
        <figcaption>
          赤い線が約6kmのコース。画像をタップすると大きく開き、拡大して道を確認できます。
        </figcaption>
      </figure>
      <div className="walking-course-highlights">
        <div>
          <span className="eyebrow">01 / GREEN & VIEWS</span>
          <h4>愛宕山公園</h4>
          <p>木々に囲まれた園内を歩いて、展望台へ。宍道湖と出雲平野を見渡す景色が楽しめます。</p>
        </div>
        <div>
          <span className="eyebrow">02 / HISTORY</span>
          <h4>平田本陣記念館</h4>
          <p>
            かつての本陣の建物に立ち寄る時間も。木綿街道の商家とはまた違う、平田の歴史に触れられます。
          </p>
        </div>
        <div>
          <span className="eyebrow">03 / BY THE WATER</span>
          <h4>川沿いと、木綿街道</h4>
          <p>水辺の風景や野鳥を眺めながら、町並みへ。地図にはトイレや休憩場所も記されています。</p>
        </div>
      </div>
      <p className="walking-course-planning">
        ランチのあと、午後を散歩に使う日に。温泉やお買い物もゆっくり楽しむなら、公園・本陣側だけを歩く短縮案も。既存の旅程に約6kmを追加する場合は、帰りの電車に合わせて時間を調整してください。
      </p>
      <div className="actions">
        <a className="action" href={image} target="_blank" rel="noopener noreferrer">
          マップを拡大 <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <a
          className="action"
          href={`${base}official-map/hirata-walking.pdf`}
          target="_blank"
          rel="noopener noreferrer"
        >
          公式の原本PDF <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <a className="action" href={source} target="_blank" rel="noopener noreferrer">
          島根県のコース案内 <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <a
          className="action"
          href="https://www.izumo-kankou.gr.jp/spot/sightseeing/313"
          target="_blank"
          rel="noopener noreferrer"
        >
          愛宕山公園の案内 <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <a
          className="action"
          href="https://www.izumo-zaidan.jp/honjin/"
          target="_blank"
          rel="noopener noreferrer"
        >
          平田本陣記念館の案内 <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <p className="small-note">
        出典：島根県掲載「愛宕山・平田の街散策コース」（令和元年・2019年作成）。地図画像はご提供の画像をそのまま掲載しています。約6kmは公式コースの距離で、駅からの接続や寄り道は別です。所要時間はこのガイドの目安です。川沿いの一部には歩道がありません。現地の道路状況に合わせて歩いてください。
      </p>
    </article>
  )
}
