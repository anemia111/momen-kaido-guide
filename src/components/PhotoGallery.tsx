import { useRef, useState } from 'react'
import { Maximize2, X } from 'lucide-react'
import { privatePhotos, type PrivatePhoto } from '../data/privateMedia'

export default function PhotoGallery({
  id,
  photos,
  name,
}: {
  id?: string
  photos?: PrivatePhoto[]
  name: string
}) {
  const images = photos ?? privatePhotos[id ?? ''] ?? []
  const [selected, setSelected] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const image = images[selected] ?? images[0]
  if (!image)
    return (
      <div className="photo-unavailable">
        <span>STORIES OF HIRATA</span>
        <p>{name}</p>
        <small>写真は店舗案内でご確認ください</small>
      </div>
    )
  const src = `${import.meta.env.BASE_URL}${image.src}`
  return (
    <div className="photo-gallery">
      <button
        className="gallery-image"
        onClick={() => dialog.current?.showModal()}
        aria-label={`${name}の${image.label}を拡大`}
      >
        <img
          src={src}
          alt={`${name} · ${image.label}`}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
        />
        <span className="gallery-expand">
          <Maximize2 size={15} /> 写真を拡大
        </span>
        <span className="gallery-counter">
          {String(selected + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      </button>
      {images.length > 1 && (
        <div className="photo-tabs" role="group" aria-label={`${name}の写真を選ぶ`}>
          {images.map((p, i) => (
            <button key={p.src} aria-pressed={i === selected} onClick={() => setSelected(i)}>
              {p.label}
            </button>
          ))}
        </div>
      )}
      <p className="photo-caption">
        {image.label}
        <a href={image.source} target="_blank" rel="noopener noreferrer">
          写真の出典 ↗
        </a>
      </p>
      <dialog ref={dialog} className="photo-dialog" aria-label={`${name}の写真`}>
        <button
          className="dialog-close"
          onClick={() => dialog.current?.close()}
          aria-label="写真を閉じる"
        >
          <X size={22} />
        </button>
        <img src={src} alt={`${name} · ${image.label}`} />
        <p>
          {name} / {image.label}
        </p>
        <a className="action" href={image.source} target="_blank" rel="noopener noreferrer">
          公式の掲載ページを見る ↗
        </a>
      </dialog>
    </div>
  )
}
