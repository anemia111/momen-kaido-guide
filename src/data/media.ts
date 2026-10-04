import { guideLinks, shopLinks } from './links'

export const officialMapPages = [
  {
    src: 'official-map/page-1.webp',
    width: 2400,
    height: 1708,
    title: '表面 · 街道と施設の位置',
    alt: '木綿街道公式散策マップの表面。町並みのイラスト、施設番号、駅と温泉への方向を原本のまま表示。',
  },
  {
    src: 'official-map/page-2.webp',
    width: 2400,
    height: 1698,
    title: '裏面 · 各施設の写真と紹介',
    alt: '木綿街道公式散策マップの裏面。交流館、老舗、飲食店などの写真と施設紹介を原本のまま表示。',
  },
]
export const officialMapPdf = 'official-map/momen-kaido-official.pdf'

type Photo = {
  src: string
  width: number
  height: number
  alt: string
  caption: string
  author: string
  source: string
  license: string
  licenseUrl: string
}
type Media = {
  photos?: Photo[]
  gallery?: { url: string; label: string }
  menu?: { url: string; items: { name: string; price: string }[]; note: string }
}
export const placeMedia: Record<string, Media> = {
  station: {
    photos: [
      {
        src: 'photos/station-exterior.webp',
        width: 1200,
        height: 800,
        alt: '雲州平田駅の駅舎正面',
        caption: '駅の外観（2014年撮影）',
        author: 'Cheng-en Cheng',
        source: 'https://commons.wikimedia.org/wiki/File:Unsh%C5%AB-Hirata_Station_01.jpg',
        license: 'CC BY-SA 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
      },
    ],
  },
  kurumaya: {
    photos: [
      {
        src: 'photos/kurumaya-shogato.webp',
        width: 1200,
        height: 800,
        alt: '來間屋の生姜糖と包装箱',
        caption: '來間屋の生姜糖（2020年撮影）',
        author: '切干大根',
        source: 'https://commons.wikimedia.org/wiki/File:Shogat%C5%8D_made_by_Kurumaya.jpg',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    ],
    gallery: { url: shopLinks.kurumaya.official, label: '外観・生姜糖を公式で見る' },
  },
  center: {
    gallery: {
      url: 'https://www.kankou-shimane.com/gallery/81541',
      label: '交流館の外観写真を見る',
    },
  },
  honishibashi: {
    gallery: {
      url: 'https://www.kankou-shimane.com/gallery/81551',
      label: '本石橋邸の外観写真を見る',
    },
  },
  umi: {
    gallery: { url: 'https://www.kankou-shimane.com/gallery/81557', label: '神社の写真を見る' },
  },
  mochida: {
    gallery: { url: shopLinks.mochida.official, label: 'お店・醤油スイーツを公式で見る' },
  },
  okamo: { gallery: { url: shopLinks.okamo.official, label: '外観・蔵の写真を見る' } },
  sake: { gallery: { url: shopLinks.sake.official, label: '外観・お酒を公式で見る' } },
  agou: { gallery: { url: shopLinks.agou.official, label: 'お店・紙の作品を公式で見る' } },
  postcards: { gallery: { url: shopLinks.postcards.official, label: 'お店の写真を見る' } },
  yurari: { gallery: { url: shopLinks.yurari.official, label: '施設・お風呂を公式で見る' } },
  trattoria: {
    gallery: { url: shopLinks.trattoria.instagram, label: '外観・料理を公式Instagramで見る' },
    menu: {
      url: shopLinks.trattoria.instagram,
      items: [{ name: 'ランチ予算', price: '2,000〜3,000円程度' }],
      note: '計画用の目安です。前菜・パスタやリゾット・パン・デザートなど、季節の内容と実際の料金は予約時に確認。',
    },
  },
  watanohana: {
    gallery: {
      url: 'https://momenkaidou.wixsite.com/watanohana/店舗内メニュー',
      label: '外観・料理写真を公式で見る',
    },
    menu: {
      url: shopLinks.center.official,
      items: [
        { name: '割子そば', price: '1,000円' },
        { name: '蕎麦御膳', price: '1,550円' },
        { name: '季節の御膳', price: '2,950円' },
      ],
      note: '交流館の公式掲載メニューより。季節の御膳は予約制・2名から。変更・売切れはお店で確認。',
    },
  },
  kitaen: {
    gallery: { url: 'https://kitaen.owst.jp/gallery', label: '外観・料理写真を公式で見る' },
    menu: {
      url: 'https://kitaen.owst.jp/foods',
      items: [
        { name: '割子そば', price: '990円' },
        { name: '生湯葉そば', price: '1,250円' },
        { name: '鴨汁せいろ', price: '1,530円' },
      ],
      note: '公式のお品書きより・税込。生湯葉そばは数量限定。訪問時の最新価格を確認。',
    },
  },
  fufu: {
    gallery: { url: shopLinks.fufu.official, label: '店舗写真を公式で見る' },
    menu: {
      url: 'https://fufuramen.com/wp-content/uploads/2025/07/2025◆平田メニュー.pdf',
      items: [{ name: 'とんこつラーメン', price: '890円' }],
      note: '2025年7月掲載の平田店公式メニュー。下のPDFで全品を確認できます。価格改定はお店で確認。',
    },
  },
}
export const mapSource = guideLinks.officialMap
