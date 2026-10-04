import { lazy, Suspense, useState } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Copy,
  Camera as Instagram,
  MapPin,
  Phone,
  Share2,
  TrainFront,
  Utensils,
} from 'lucide-react'
import { spots } from './data/spots'
import { restaurants } from './data/restaurants'
import { buildSchedule } from './data/schedule'
import { transport } from './data/transport'
import { checkedAtLabel, guideLinks, siteUrl } from './data/links'
import { architecture, closureNotices, introParagraphs, dayPlanning } from './data/editorial'
import { costs, totals } from './data/costs'
import type { DayType, Spot } from './data/types'
import './App.css'
import './media.css'
import './luxury.css'
import PhotoGallery from './components/PhotoGallery'
import { privatePhotos } from './data/privateMedia'
import OfficialMap from './components/OfficialMap'
import PlaceMedia from './components/PlaceMedia'
import OfficialTimetables from './components/OfficialTimetables'

const GuideMap = lazy(() => import('./components/GuideMap'))
const allPlaces = [...spots, ...restaurants]
const lunch = restaurants[0]
const bath = spots.find((s) => s.id === 'yurari')!

function External({
  href,
  children,
  label,
  className = '',
}: {
  href: string
  children: React.ReactNode
  label?: string
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`action ${className}`}
    >
      {children}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  )
}

function Actions({ spot, compact = false }: { spot: Spot; compact?: boolean }) {
  const links = spot.links
  const today = links.today ?? links.instagram ?? links.official ?? links.facebook
  return (
    <div className="actions">
      {links.appleMaps && (
        <External href={links.appleMaps} label={`${spot.name}をApple Mapsで開く`}>
          <MapPin size={15} aria-hidden="true" />
          {compact ? 'MAP' : 'Apple Maps'}
        </External>
      )}
      {!compact && links.googleMaps && (
        <External href={links.googleMaps} label={`${spot.name}をGoogle Mapsで開く`}>
          Google Maps
        </External>
      )}
      {links.instagram && (
        <External href={links.instagram} label={`${spot.name}の公式Instagram`}>
          <Instagram size={15} aria-hidden="true" />
          Instagram
        </External>
      )}
      {!compact && links.official && (
        <External href={links.official} label={`${spot.name}の店舗・施設案内`}>
          店舗・施設案内
        </External>
      )}
      {links.reservation && (
        <External href={links.reservation} label={`${spot.name}の予約案内`}>
          {spot.reservationLabel ?? '予約する'}
        </External>
      )}
      {links.phone && (
        <a
          className="action"
          href={`tel:${links.phone.replaceAll('-', '')}`}
          aria-label={`${spot.name}に電話する ${links.phone}`}
        >
          <Phone size={14} aria-hidden="true" />
          電話する
        </a>
      )}
      {!compact && today && (
        <External href={today} label={`${spot.name}の今日の営業を確認`} className="today">
          今日の営業を確認
        </External>
      )}
      {!compact && links.facebook && (
        <External href={links.facebook} label={`${spot.name}の公式Facebook`}>
          Facebook
        </External>
      )}
      {!compact && links.x && (
        <External href={links.x} label={`${spot.name}の公式X`}>
          X
        </External>
      )}
    </div>
  )
}
function PlaceDetails({ place, withoutMedia = false }: { place: Spot; withoutMedia?: boolean }) {
  return (
    <>
      <p className="place-description">{place.description}</p>
      {!withoutMedia && <PlaceMedia id={place.id} name={place.name} />}
      <dl className="details">
        <div>
          <dt>住所</dt>
          <dd>{place.address}</dd>
        </div>
        <div>
          <dt>営業時間</dt>
          <dd>{place.hours}</dd>
        </div>
        <div>
          <dt>お休み</dt>
          <dd>{place.closed}</dd>
        </div>
        {place.price && (
          <div>
            <dt>料金</dt>
            <dd>{place.price}</dd>
          </div>
        )}
      </dl>
      {place.note && <p className="small-note">{place.note}</p>}
      <Actions spot={place} />
      <details className="sources">
        <summary>情報源・確認日</summary>
        <p>{checkedAtLabel}確認</p>
        {place.sources.map((url, i) => (
          <External key={url} href={url} label={`${place.name}の情報源 ${i + 1}`}>
            情報源 {i + 1}
          </External>
        ))}
        <External href={place.coordinateSource}>位置情報の出典</External>
      </details>
    </>
  )
}
function SectionHeading({
  number,
  eyebrow,
  children,
}: {
  number: string
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{children}</h2>
      </div>
    </div>
  )
}
function App() {
  const [day, setDay] = useState<DayType>(() =>
    [0, 6].includes(new Date().getDay()) ? 'holiday' : 'weekday',
  )
  const [mapReady, setMapReady] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const [filter, setFilter] = useState('すべて')
  const [search, setSearch] = useState('')
  const [copyFallback, setCopyFallback] = useState(false)
  const train = transport[day]
  const localDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date())
  const notices = closureNotices.filter((n) => n.end >= localDate)
  const query = search.trim().normalize('NFKC').toLocaleLowerCase('ja')
  const nameMatch = spots.some((s) =>
    s.name.normalize('NFKC').toLocaleLowerCase('ja').includes(query),
  )
  const visibleSpots = spots.filter((s) => {
    const haystack = nameMatch ? s.name : `${s.name} ${s.tagline} ${s.description}`
    return (
      (filter === 'すべて' || s.category === filter) &&
      haystack.normalize('NFKC').toLocaleLowerCase('ja').includes(query)
    )
  })
  async function shareTrip() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '木綿街道、静かな一日。',
          text: '松江から、町家と老舗を歩く日帰り旅。',
          url: siteUrl,
        })
        setShareMessage('共有しました。')
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(siteUrl)
        setShareMessage('旅のURLをコピーしました。')
      } else setCopyFallback(true)
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setCopyFallback(true)
        setShareMessage('下のURLを選択してコピーできます。')
      }
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <header className="masthead">
        <a href="#" className="wordmark" aria-label="木綿街道 日帰り旅ガイドの先頭へ">
          <span className="seal" aria-hidden="true">
            木綿
          </span>
          <span>出雲平田の旅手帖</span>
        </a>
        <nav className="masthead-nav" aria-label="ページの案内">
          <a href="#food">DINING</a>
          <a href="#spots">DISCOVER</a>
          <a href="#schedule">PLAN YOUR DAY</a>
        </nav>
        <span className="masthead-right">A DAY IN HIRATA</span>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              MATSUE → UNSHŪ-HIRATA <span>ONE DAY TRIP</span>
            </p>
            <h1 id="hero-title">
              木綿街道、
              <br />
              静かな一日。
            </h1>
            <p className="hero-description">
              松江から一畑電車で約40分。
              <br />
              町家と老舗が残る出雲平田を、
              <br />
              急がず歩く日帰り旅。
            </p>
            <div className="hero-ctas">
              <a className="button primary" href="#schedule">
                今日の旅程 <ArrowDown size={16} />
              </a>
              <a className="button" href="#map">
                MAP <MapPin size={16} />
              </a>
              <a href="#timetables" className="button">
                両駅の公式時刻表
              </a>
            </div>
            <p className="hero-footnote">町家ランチ / 手仕事 / 温泉</p>
          </div>
          <div className="hero-art">
            <img
              src={`${import.meta.env.BASE_URL}brochure-photos/center-exterior.jpg`}
              width="800"
              height="450"
              alt="瓦屋根となまこ壁、緑に包まれた木綿街道交流館"
              fetchPriority="high"
            />
          </div>
          <span className="hero-location">IZUMO / SHIMANE / JAPAN</span>
          <a href="#intro" className="hero-scroll">
            SCROLL TO DISCOVER <ArrowDown size={18} />
          </a>
        </section>
        <nav className="quick-links" aria-label="旅先ですぐ使うリンク">
          <span className="eyebrow">QUICK LINKS</span>
          <External href={transport.outbound}>
            <TrainFront size={16} />
            松江しんじ湖温泉駅の時刻表
          </External>
          <External href={transport.return}>雲州平田駅の時刻表</External>
          <External href={transport.status}>運行情報</External>
          <External href={lunch.links.instagram!}>
            <Instagram size={16} />
            ランチ最新情報
          </External>
          <a className="action" href="#map">
            <MapPin size={16} />
            MAP
          </a>
          <External href={bath.links.today!}>温泉営業情報</External>
        </nav>
        <section id="intro" className="intro section" aria-labelledby="intro-title">
          <p className="eyebrow">A TOWN WOVEN WITH HISTORY</p>
          <h2 id="intro-title">
            水の道がつないだ、
            <br />
            暮らしと商い。
          </h2>
          <div>
            {introParagraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <External href={guideLinks.history}>木綿街道の歴史を読む</External>
          </div>
        </section>
        <section className="visual-story" aria-label="木綿街道の風景">
          <div className="story-photo">
            <PhotoGallery name="本石橋邸" photos={[privatePhotos.atmosphere[0]]} />
          </div>
          <div className="story-copy">
            <p className="eyebrow">THE ART OF A SLOW DAY</p>
            <h2>
              急がないことも、
              <br />
              旅の贅沢。
            </h2>
            <p>
              庭を眺める。格子に目をとめる。
              <br />
              ひとつのお店で、作り手の話を聞く。
              <br />
              予定のあいだに、余白を残して。
            </p>
            <a className="button" href="#spots">
              街道のお店を巡る <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <section className="section departure" id="check">
          <SectionHeading number="01" eyebrow="BEFORE YOU GO">
            出発前に、
            <br className="mobile-only" />
            ここだけ確認。
          </SectionHeading>
          <p className="section-lead">
            電車の運行、ランチの席、お店の営業。出かける前の小さな準備を。
          </p>
          <div className="check-grid">
            <div>
              <TrainFront size={22} />
              <h3>一畑電車</h3>
              <External href={transport.outbound}>松江しんじ湖温泉駅の時刻表</External>
              <External href={transport.return}>雲州平田駅の時刻表</External>
              <External href={transport.status}>運行情報</External>
            </div>
            <div>
              <Utensils size={22} />
              <h3>trattorìa 814</h3>
              <External href={lunch.links.instagram!}>Instagram</External>
              <a
                className="action"
                href={`tel:${lunch.links.phone!.replaceAll('-', '')}`}
                aria-label="trattorìa 814に電話する"
              >
                電話で予約・確認 <Phone size={14} />
              </a>
            </div>
            <div>
              <BookOpen size={22} />
              <h3>木綿街道</h3>
              <External href={guideLinks.momen}>公式サイト</External>
              <External href={guideLinks.officialMap}>公式散策マップ</External>
            </div>
            <div>
              <span className="onsen-symbol" aria-hidden="true">
                ♨
              </span>
              <h3>温泉 ゆらり</h3>
              <External href={bath.links.today!}>営業情報</External>
              <a
                className="action"
                href={`tel:${bath.links.phone!.replaceAll('-', '')}`}
                aria-label="ゆらりに電話する"
              >
                電話で確認 <Phone size={14} />
              </a>
            </div>
          </div>
          <div className="planning-note">
            <CalendarDays size={20} />
            <p>
              <strong>{dayPlanning.title}</strong>
              <br />
              {dayPlanning.text}
            </p>
          </div>
          {notices.map((n) => (
            <p className="notice" key={n.id}>
              {n.text} <External href={n.url}>休館案内</External>
            </p>
          ))}
        </section>
        <section id="access" className="section access">
          <SectionHeading number="02" eyebrow="TAKE THE LOCAL TRAIN">
            松江から、ばたでんで。
          </SectionHeading>
          <div className="access-layout">
            <div className="rail-route">
              <div>
                <span className="route-dot" />
                <strong>松江しんじ湖温泉駅</strong>
                <small>JR松江駅とは別の駅です</small>
              </div>
              <p>一畑電車 · 約40分 · 乗り換えなし</p>
              <div>
                <span className="route-dot" />
                <strong>雲州平田駅</strong>
                <small>徒歩約10〜15分</small>
              </div>
              <div>
                <span className="route-dot end" />
                <strong>木綿街道</strong>
              </div>
            </div>
            <div>
              <p className="fare">
                片道 <strong>{transport.fareOneWay.toLocaleString('ja-JP')}</strong>円{' '}
                <span>往復 {transport.fareReturn.toLocaleString('ja-JP')}円 / 大人普通運賃</span>
              </p>
              <div className="actions">
                <External href={transport.outbound}>行き：松江しんじ湖温泉駅の公式時刻表</External>
                <External href={transport.return}>帰り：雲州平田駅の公式時刻表</External>
                <External href={transport.status}>運行情報を見る</External>
                <External href={transport.fare}>運賃を見る</External>
                <External href={transport.official}>一畑電車公式サイト</External>
              </div>
              <p className="small-note">
                運行情報は一畑電車の公式トップページに掲載されています。ダイヤ改正・臨時ダイヤは出発前に確認してください。
              </p>
            </div>
          </div>
          <OfficialTimetables />
        </section>
        <section id="schedule" className="section schedule">
          <SectionHeading number="03" eyebrow="YOUR DAY, AT YOUR PACE">
            今日の旅程。
          </SectionHeading>
          <p className="section-lead">
            町家で食べて、老舗をのぞいて、温泉へ。
            <br />
            全部を回らなくても、よい一日。
          </p>
          <div className="day-switch" role="group" aria-label="旅程の曜日">
            <button aria-pressed={day === 'weekday'} onClick={() => setDay('weekday')}>
              平日
            </button>
            <button aria-pressed={day === 'holiday'} onClick={() => setDay('holiday')}>
              土日祝
            </button>
          </div>
          <p className="small-note">
            祝日は自動判定していません。旅する日の区分を選んでください。{transport.revision}
          </p>
          <div className="journey-summary" aria-live="polite">
            <span>
              行き{' '}
              <strong>
                {train.departure} → {train.arrival}
              </strong>
            </span>
            <span>
              帰り{' '}
              <strong>
                {train.returnDeparture} → {train.returnArrival}
              </strong>
            </span>
          </div>
          <ol className="timeline">
            {buildSchedule(day).map((item, i) => {
              const place = allPlaces.find((p) => p.id === item.spotId)
              return (
                <li key={i} className={item.kind === 'train' ? 'train-stop' : ''}>
                  <time>{item.time}</time>
                  <span className="timeline-dot" aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {place && <Actions spot={place} compact />}
                    {item.extraLink && (
                      <External href={item.extraLink.href}>{item.extraLink.label}</External>
                    )}
                    {item.spotId === 'trattoria' && (
                      <a href="#food" className="action">
                        満席なら、ほかの食事候補へ <ArrowDown size={14} />
                      </a>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
          <div className="return-ticket">
            <TrainFront size={24} />
            <div>
              <p className="eyebrow">TIME TO GO HOME</p>
              <h3>帰りも、ここから。</h3>
              <p>16:30頃には雲州平田駅へ。{train.returnDeparture}発、松江しんじ湖温泉行き。</p>
            </div>
            <External href={transport.return} className="button primary">
              帰りの電車を確認
            </External>
          </div>
          <p className="small-note">
            徒歩・滞在時間は目安です。予約の返答を受けてから訪問し、休業時はほかの食事候補や町歩きへ切り替えてください。
          </p>
        </section>
        <section id="food" className="section food">
          <SectionHeading number="04" eyebrow="A TABLE IN THE OLD TOWN">
            町家で、昼ごはん。
          </SectionHeading>
          <article className="featured-food">
            <PhotoGallery id="trattoria" name={lunch.name} />
            <div className="food-copy">
              <p className="eyebrow">OUR FIRST CHOICE · 要予約</p>
              <h3>{lunch.name}</h3>
              <p className="tagline">{lunch.tagline}</p>
              <dl className="details">
                <div>
                  <dt>予算</dt>
                  <dd>{lunch.budget}</dd>
                </div>
                <div>
                  <dt>予約</dt>
                  <dd>{lunch.booking}</dd>
                </div>
              </dl>
              <PlaceDetails place={lunch} />
            </div>
          </article>
          <h3 className="alternatives-heading">満席の日も、ほかの食事候補。</h3>
          <p>各店の営業と席を確認してから移動を。歩く時間は目安です。</p>
          <div className="restaurant-grid">
            {restaurants.slice(1).map((r) => (
              <article key={r.id} className="restaurant">
                <PhotoGallery id={r.id} name={r.name} />
                <div className="restaurant-copy">
                  <p className="eyebrow">{r.genre}</p>
                  <h4>{r.name}</h4>
                  <p className="walk">
                    <MapPin size={14} />
                    {r.walk}
                  </p>
                  <dl className="details">
                    <div>
                      <dt>予算</dt>
                      <dd>{r.budget}</dd>
                    </div>
                    <div>
                      <dt>予約</dt>
                      <dd>{r.booking}</dd>
                    </div>
                  </dl>
                  <PlaceDetails place={r} />
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="spots" className="section spots-section">
          <SectionHeading number="05" eyebrow="SHOPS, STORIES & SMALL DISCOVERIES">
            老舗と、手仕事と。
          </SectionHeading>
          <p className="section-lead">
            気になる場所をひとつずつ。三つの醤油店も、紙のお店も、それぞれの個性を。
          </p>
          <div className="collection-tools">
            <label className="shop-search">
              <span>お店を探す</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="店名・気になることから探す"
              />
            </label>
            <p className="collection-count" aria-live="polite">
              {visibleSpots.length} PLACES
            </p>
          </div>
          <div className="filters" role="group" aria-label="スポットの種類">
            {['すべて', '老舗', '手仕事', '建築', '案内', '神社', '温泉', '駅'].map((f) => (
              <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          {visibleSpots.length === 0 && (
            <p className="empty-search">
              見つかりませんでした。店名を短くするか、種類を「すべて」にして探してください。
            </p>
          )}
          <div className="spot-list">
            {visibleSpots.map((spot, i) => (
              <article key={spot.id} className="spot" id={`spot-${spot.id}`}>
                {spot.id === 'station' ? (
                  <PlaceMedia id={spot.id} name={spot.name} />
                ) : (
                  <PhotoGallery id={spot.id} name={spot.name} />
                )}
                <div className="spot-copy">
                  <div className="spot-title">
                    <span className="spot-index">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="eyebrow">{spot.category}</p>
                      <h3>{spot.name}</h3>
                      <p className="tagline">{spot.tagline}</p>
                    </div>
                  </div>
                  <div>
                    <p className="place-description">{spot.description}</p>
                    <p className="shop-hours">{spot.hours}</p>
                    <Actions spot={spot} compact />
                    <details className="place-more">
                      <summary>営業時間・住所・詳しい案内</summary>
                      <PlaceDetails place={spot} withoutMedia={spot.id !== 'kurumaya'} />
                    </details>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="architecture section">
          <SectionHeading number="06" eyebrow="LOOK A LITTLE CLOSER">
            歩くなら、
            <br />
            屋根と格子も見る。
          </SectionHeading>
          <div className="architecture-grid">
            {architecture.map((a, i) => (
              <article key={a.number}>
                <PhotoGallery name={a.term} photos={[privatePhotos.architecture[i]]} />
                <span className="eyebrow">
                  {a.number} / {a.term}
                </span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </article>
            ))}
          </div>
          <External href={guideLinks.architecture}>建築の案内を読む</External>
        </section>
        <section id="map" className="section map-section">
          <SectionHeading number="07" eyebrow="FIND YOUR NEXT STOP">
            町歩きの、地図。
          </SectionHeading>
          <p className="section-lead">
            ピンを選んで、次の場所へ。Apple Mapsで歩く道を確認できます。
          </p>
          <OfficialMap />
          <h3 className="interactive-map-heading">地図アプリへつながる、町歩きMAP。</h3>
          <div className="map-frame">
            {mapReady ? (
              <Suspense fallback={<div className="map-loading">地図を読み込んでいます…</div>}>
                <GuideMap />
              </Suspense>
            ) : (
              <div className="map-placeholder">
                <MapPin size={36} strokeWidth={1} />
                <h3>木綿街道と、駅と、温泉。</h3>
                <p>地図を開くとOpenStreetMapに接続します。</p>
                <button className="button primary" onClick={() => setMapReady(true)}>
                  町歩きMAPを開く <ArrowUpRight size={16} />
                </button>
              </div>
            )}
          </div>
          <p className="small-note">
            地図の位置は入口を保証するものではありません。道順は地図アプリで確認を。読み込めない場合も各施設のMAPボタンと公式散策マップが使えます。
          </p>
          <div className="actions">
            <External href={guideLinks.officialMap}>公式散策マップ（PDF）</External>
            <External href={guideLinks.officialCoordinates}>公式の施設配置図</External>
          </div>
        </section>
        <section className="section budget">
          <SectionHeading number="08" eyebrow="A LITTLE PLANNING">
            一日の、お財布メモ。
          </SectionHeading>
          <div className="budget-layout">
            <dl>
              {costs.map((c) => (
                <div key={c.label}>
                  <dt>
                    {c.label}
                    <small>{c.note}</small>
                  </dt>
                  <dd>{c.value}</dd>
                </div>
              ))}
            </dl>
            <div className="budget-total">
              <p>
                町歩き＋ランチ <strong>{totals.simple}</strong>
              </p>
              <p>
                本石橋邸・温泉・土産込み <strong>{totals.full}</strong>
              </p>
              <small>{totals.note}</small>
            </div>
          </div>
        </section>
        <section className="share-section section">
          <span className="seal" aria-hidden="true">
            旅
          </span>
          <h2>
            次の休日に、
            <br />
            静かな町へ。
          </h2>
          <button className="button primary" onClick={() => void shareTrip()}>
            <Share2 size={17} />
            この旅を共有
          </button>
          <p className="share-message" role="status">
            {shareMessage && (
              <>
                <Check size={16} />
                {shareMessage}
              </>
            )}
          </p>
          {copyFallback && (
            <label className="copy-label">
              <Copy size={16} />
              共有用URL
              <input readOnly value={siteUrl} onFocus={(e) => e.currentTarget.select()} />
            </label>
          )}
          <p className="small-note">
            iPhoneのSafariでは共有メニューから
            <br />
            「ホーム画面に追加」すると旅先ですぐ開けます。
          </p>
        </section>
      </main>
      <footer>
        <div className="footer-brand">
          <span className="seal">木綿</span>
          <strong>木綿街道、静かな一日。</strong>
        </div>
        <p>情報確認日：{checkedAtLabel}</p>
        <p>
          営業時間・料金・時刻表等は変更される場合があります。
          <br />
          訪問当日は各施設の公式サイト・SNSをご確認ください。
        </p>
        <p className="small-note">
          このサイトは個人制作の旅ガイドです。各施設・鉄道の公式サイトではありません。
          <br />
          写真・公式マップ・メニューの出典は各掲載箇所に記載。外部サイトは新しいタブで開きます。
        </p>
        <div className="actions">
          <External href={guideLinks.momen}>木綿街道公式</External>
          <a className="action" href="#check">
            出発前チェックへ <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
      <nav className="bottom-nav" aria-label="旅行中の固定ナビ">
        <a href="#schedule">
          <CalendarDays size={20} />
          旅程
        </a>
        <a href="#map">
          <MapPin size={20} />
          MAP
        </a>
        <a href="#timetables">
          <TrainFront size={20} />
          時刻表
        </a>
        <a href="#spots">
          <BookOpen size={20} />
          スポット
        </a>
      </nav>
    </>
  )
}
export default App
