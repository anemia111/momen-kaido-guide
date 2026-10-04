export type SpotLinks = {
  official?: string
  instagram?: string
  x?: string
  facebook?: string
  reservation?: string
  appleMaps?: string
  googleMaps?: string
  phone?: string
  today?: string
}

export type Spot = {
  id: string
  name: string
  category: '案内' | '建築' | '老舗' | '手仕事' | '神社' | '温泉' | '駅' | '食事'
  tagline: string
  description: string
  address: string
  coordinates: [number, number]
  coordinateSource: string
  hours: string
  closed: string
  closedWeekdays?: number[]
  holidayClosureNextDay?: boolean
  price?: string
  note?: string
  reservationLabel?: string
  links: SpotLinks
  sources: string[]
}

export type Restaurant = Spot & {
  genre: string
  walk: string
  booking: string
  budget: string
}

export type DayType = 'weekday' | 'holiday'
export type ScheduleItem = {
  time: string
  title: string
  description: string
  spotId?: string
  kind?: 'train' | 'walk' | 'visit'
  extraLink?: { label: string; href: string }
}
