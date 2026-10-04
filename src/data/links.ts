export const checkedAt = '2026-10-04'
export const checkedAtLabel = '2026年10月04日'
export const siteUrl = 'https://anemia111.github.io/momen-kaido-guide/'
export const guideLinks = {
  momen: 'https://momen-kaidou.jp/',
  momenMap: 'https://momen-kaidou.jp/map/',
  history: 'https://momen-kaidou.jp/introduction/',
  booking: 'https://booking.momen-kaidou.jp/',
  officialMap:
    'https://momen-kaidou.jp/wp-content/uploads/2026/02/0f0d9bb5f0d3abea2c69714da8c2a37c.pdf',
  architecture: 'https://momen-kaidou.jp/map/honisibasitei/',
  ritaMeals: 'https://www.rita-community.jp/izumo-hirata/meals/',
  chamberGuide:
    'https://www.hirata-cci.or.jp/wp/wp-content/themes/hiratacci-wptemp/assets/files/top/kuratabi2023.pdf',
  officialCoordinates: 'https://www.google.com/maps/d/viewer?mid=1jR6TsQM3rq0VmhM7en4x1S3gHm_wkcc',
}

export function mapLinks(name: string, address: string) {
  const query = encodeURIComponent(`${name} ${address}`)
  return {
    appleMaps: `https://maps.apple.com/?q=${query}`,
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${query}`,
  }
}

export const shopLinks = {
  trattoria: {
    official: guideLinks.ritaMeals,
    instagram: 'https://www.instagram.com/trattoria814hachiichiyon/',
    phone: '090-4899-7465',
  },
  center: {
    official: 'https://momen-kaidou.jp/map/momenkaidoukouryuukan/',
    phone: '0853-62-2631',
  },
  honishibashi: {
    official: 'https://momen-kaidou.jp/map/honisibasitei/',
    reservation:
      'https://booking.momen-kaidou.jp/provider/activity_plan?planId=36&sourcePage=plalist',
    phone: '0853-62-2631',
  },
  kurumaya: {
    official: 'https://syougatou-honpo.jp/',
    reservation: 'https://booking.momen-kaidou.jp/provider/activity_plan?planId=38&providerId=10',
    phone: '0853-62-2115',
  },
  kato: { phone: '0853-62-2034', today: guideLinks.momenMap },
  mochida: {
    official: 'https://mochidashouyu.amebaownd.com/',
    reservation: 'https://booking.momen-kaidou.jp/activity?planId=43',
    phone: '0853-62-3137',
  },
  okamo: {
    official: 'https://booking.momen-kaidou.jp/provider/detail?providerId=13',
    reservation: 'https://booking.momen-kaidou.jp/provider/plans?providerId=13',
    phone: '0853-62-2045',
  },
  sake: {
    official: 'https://www.sakemochida.jp/',
    instagram: 'https://www.instagram.com/sakemochida/',
    reservation: 'https://booking.momen-kaidou.jp/provider/activity_plan?planId=54&providerId=11',
    phone: '0853-62-2023',
  },
  agou: {
    official: 'https://www.agouya.com/',
    instagram: 'https://www.instagram.com/naokiagou/',
    facebook: 'https://www.facebook.com/agouya/',
    phone: '090-2000-9433',
  },
  postcards: {
    official: 'https://booking.momen-kaidou.jp/provider/detail?providerId=15',
    phone: '0853-62-2631',
  },
  umi: { official: 'https://momen-kaidou.jp/map/umi-jinja/' },
  yurari: {
    official: 'http://yurari-izumo.jp/',
    today: 'http://yurari-izumo.jp/publics/index/35/',
    phone: '0853-62-1234',
  },
  watanohana: { official: 'https://momenkaidou.wixsite.com/watanohana', phone: '0853-62-2631' },
  kitaen: {
    official: 'https://kitaen.owst.jp/',
    reservation: 'https://www.hotpepper.jp/strJ001158649/yoyaku/hpds/?ROUTE_KBN=20',
    phone: '0853-31-4259',
  },
  fufu: {
    official: 'https://fufuramen.com/shop/風風ラーメン島根店/',
    phone: '0853-62-9191',
  },
}
