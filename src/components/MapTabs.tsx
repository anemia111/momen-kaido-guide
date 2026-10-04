import { lazy, Suspense, useRef, useState } from 'react'
import OfficialMap from './OfficialMap'
import WalkingCourse from './WalkingCourse'
const GuideMap = lazy(() => import('./GuideMap'))
const tabs = ['街道MAP', '6km散歩', 'スポットMAP']
export default function MapTabs() {
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  return (
    <>
      <div className="map-tabs" role="tablist" aria-label="町歩きの地図">
        {tabs.map((label, index) => (
          <button
            key={label}
            ref={(node) => {
              buttons.current[index] = node
            }}
            id={`map-tab-${index}`}
            role="tab"
            aria-selected={active === index}
            aria-controls={`map-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              let next: number
              if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
              else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
              else if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = tabs.length - 1
              else return
              event.preventDefault()
              setActive(next)
              buttons.current[next]?.focus()
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="map-panels">
        {tabs.map((_, index) => (
          <div
            key={index}
            id={`map-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`map-tab-${index}`}
            tabIndex={0}
            hidden={active !== index}
            className="map-panel"
          >
            {index === 0 && <OfficialMap />}
            {index === 1 && <WalkingCourse />}
            {index === 2 && (
              <>
                <h3 className="interactive-map-heading">地図アプリへつながる、町歩きMAP。</h3>
                <div className="map-frame">
                  {ready && active === 2 ? (
                    <Suspense fallback={<div className="map-loading">地図を読み込んでいます…</div>}>
                      <GuideMap />
                    </Suspense>
                  ) : (
                    <div className="map-placeholder">
                      <h3>木綿街道と、駅と、温泉。</h3>
                      <p>地図を開くとOpenStreetMapに接続します。</p>
                      <button className="button primary" onClick={() => setReady(true)}>
                        町歩きMAPを開く
                      </button>
                    </div>
                  )}
                </div>
                <p className="small-note">
                  位置は入口を保証するものではありません。道順は地図アプリで確認を。オフラインでは街道MAP・6km散歩の保存画像をご利用ください。
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
