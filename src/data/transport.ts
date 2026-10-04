export const transport = {
  official: 'https://railway.ichibata.co.jp/',
  timetable: 'https://railway.ichibata.co.jp/operate/timetable/list/',
  // The operator publishes its live operating notice on its home page.
  status: 'https://railway.ichibata.co.jp/',
  fare: 'https://railway.ichibata.co.jp/fare/futsu/list/松江しんじ湖温泉駅/',
  outbound:
    'https://railway.ichibata.co.jp/wp-content/media/P20250401new_22_matsueshinjikoonsen.pdf',
  return: 'https://railway.ichibata.co.jp/wp-content/media/P20250401new_09_unshuhirata.pdf',
  weekdayPdf: 'https://railway.ichibata.co.jp/wp-content/media/P20250401_timetable_weekday.pdf',
  holidayPdf: 'https://railway.ichibata.co.jp/wp-content/media/P20250401_timetable_holiday.pdf',
  fareOneWay: 750,
  fareReturn: 1500,
  revision: '2025年4月1日改正（2026年10月4日、公式掲載を確認）',
  weekday: {
    departure: '09:42',
    arrival: '10:22',
    returnDeparture: '16:47',
    returnArrival: '17:26',
    train: '306',
    returnTrain: '325',
  },
  holiday: {
    departure: '09:45',
    arrival: '10:24',
    returnDeparture: '16:47',
    returnArrival: '17:24',
    train: '700',
    returnTrain: '715',
  },
}
