import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { spots } from '../data/spots'
import { restaurants } from '../data/restaurants'
import 'leaflet/dist/leaflet.css'

const places = [...spots, ...restaurants]
const icon = divIcon({
  className: 'guide-marker',
  html: '<span aria-hidden="true"></span>',
  iconSize: [44, 44],
  iconAnchor: [22, 34],
  popupAnchor: [0, -28],
})
export default function GuideMap() {
  const [tileError, setTileError] = useState(false)
  return (
    <>
      <MapContainer
        center={[35.4368, 132.8219]}
        zoom={16}
        scrollWheelZoom={false}
        className="guide-map"
        aria-label="木綿街道周辺の観光施設の地図"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          eventHandlers={{ tileerror: () => setTileError(true) }}
        />
        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.coordinates}
            icon={icon}
            title={place.name}
            alt={place.name}
          >
            <Popup>
              <h3>{place.name}</h3>
              <p>{place.tagline}</p>
              <div className="popup-links">
                <a href={place.links.appleMaps} target="_blank" rel="noopener noreferrer">
                  Apple Maps ↗
                </a>
                <a href={place.links.googleMaps} target="_blank" rel="noopener noreferrer">
                  Google Maps ↗
                </a>
              </div>
              {place.id === 'fufu' && <p>住所検索による参考位置。道順は地図アプリで確認を。</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {tileError && (
        <p className="map-error" role="status">
          地図の背景を読み込めませんでした。ピンの地図アプリリンク、または公式散策マップをご利用ください。
        </p>
      )}
    </>
  )
}
