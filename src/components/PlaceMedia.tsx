import { ArrowUpRight, Camera, Utensils } from 'lucide-react'
import { placeMedia } from '../data/media'
import PhotoGallery from './PhotoGallery'
import { privatePhotos } from '../data/privateMedia'
export default function PlaceMedia({ id, name }: { id: string; name: string }) {
  const media = placeMedia[id]
  if (!media) return null
  return (
    <div className="place-media">
      {media.photos?.map((photo) => (
        <figure className="place-photo" key={photo.src}>
          <img
            src={`${import.meta.env.BASE_URL}${photo.src}`}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            {photo.caption}
            <span>
              写真：{photo.author} /{' '}
              <a className="action" href={photo.source} target="_blank" rel="noopener noreferrer">
                出典 <ArrowUpRight size={12} />
              </a>
              <a
                className="action"
                href={photo.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {photo.license} <ArrowUpRight size={12} />
              </a>
            </span>
          </figcaption>
        </figure>
      ))}
      {media.gallery && (
        <a
          className="action photo-action"
          href={media.gallery.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name}の${media.gallery.label}`}
        >
          <Camera size={15} />
          {media.gallery.label}
          <ArrowUpRight size={14} />
        </a>
      )}
      {media.menu && (
        <div className="menu-preview">
          <h4>
            <Utensils size={15} />
            お品書きメモ
          </h4>
          <table>
            <caption className="sr-only">{name}のメニューと料金</caption>
            <thead>
              <tr>
                <th scope="col">メニュー</th>
                <th scope="col">料金</th>
              </tr>
            </thead>
            <tbody>
              {media.menu.items.map((item) => (
                <tr key={item.name}>
                  <th scope="row">{item.name}</th>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small-note">{media.menu.note}</p>
          {id === 'fufu' && (
            <div className="menu-gallery">
              <PhotoGallery
                name="平田店の公式メニュー（2025年7月掲載）"
                photos={privatePhotos.fufuMenu}
              />
            </div>
          )}
          <a
            className="action"
            href={media.menu.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name}の公式メニューを確認する`}
          >
            公式メニューを確認する <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </div>
  )
}
