import { transport } from './transport'
import type { DayType, ScheduleItem } from './types'

export function buildSchedule(day: DayType): ScheduleItem[] {
  const trains = transport[day]
  return [
    {
      time: trains.departure,
      title: '松江しんじ湖温泉駅を出発',
      description: `一畑電車・普通 ${trains.train}列車。雲州平田まで乗り換えなし。出発10分前には駅へ。`,
      kind: 'train',
      extraLink: { label: '出発駅の時刻表', href: transport.outbound },
    },
    {
      time: trains.arrival,
      title: '雲州平田駅に到着',
      description: '駅から徒歩約10〜15分。町並みを楽しみながら木綿街道へ。',
      spotId: 'station',
      kind: 'walk',
    },
    {
      time: '10:40',
      title: '木綿街道交流館で散策マップを',
      description: '今日の営業や、本石橋邸の見学受付を相談。',
      spotId: 'center',
      kind: 'visit',
    },
    {
      time: '10:55',
      title: '本石橋邸の庭と座敷を見学',
      description: '一般見学の目安は20〜25分。予約ガイドを選ぶ時はランチまでの時間を調整。',
      spotId: 'honishibashi',
      kind: 'visit',
    },
    {
      time: '11:30',
      title: 'trattorìa 814で町家ランチ',
      description: '11:30の入店枠を事前予約。約90分、季節の食材をゆっくり味わいます。',
      spotId: 'trattoria',
      kind: 'visit',
    },
    {
      time: '13:00',
      title: '老舗と町家を、気の向くままに',
      description: '生姜糖、醤油、酒蔵。全部を急いで回らず、気になる店を選んで。',
      spotId: 'kurumaya',
      kind: 'walk',
    },
    {
      time: '13:40',
      title: '紙の手仕事と、小さなお土産',
      description: '吾郷屋のノートや、絵はがき屋さんの一枚を探す時間。',
      spotId: 'agou',
      kind: 'visit',
    },
    {
      time: '14:20',
      title: '宇美神社へ静かにお参り',
      description: '屋根と格子を眺めながら、西側の境内へ。温泉までは約15〜20分を見込んで。',
      spotId: 'umi',
      kind: 'visit',
    },
    {
      time: '14:50',
      title: 'ゆらりで、歩いた足を休める',
      description: '源泉掛け流しと露天風呂。タオルを持参すると身軽です。休館日は町歩きを延長。',
      spotId: 'yurari',
      kind: 'visit',
    },
    {
      time: '16:10',
      title: '温泉を出て、駅へ',
      description: '着替えと徒歩約15〜20分の余裕を持って。16:30頃には駅に着く計画です。',
      spotId: 'station',
      kind: 'walk',
    },
    {
      time: trains.returnDeparture,
      title: '雲州平田駅から松江へ',
      description: `松江しんじ湖温泉行き・普通 ${trains.returnTrain}列車。乗り換えなし。乗る前に運行情報を確認。`,
      kind: 'train',
      extraLink: { label: '帰りの電車を確認', href: transport.return },
    },
    {
      time: trains.returnArrival,
      title: '松江しんじ湖温泉駅に到着',
      description: '宍道湖の町へ戻って、静かな一日の終わり。',
      kind: 'train',
    },
  ]
}
