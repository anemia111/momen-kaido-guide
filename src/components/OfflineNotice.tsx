import { useEffect, useState } from 'react'
export default function OfflineNotice() {
  const [offline, setOffline] = useState(!navigator.onLine)
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])
  if (!offline) return null
  return (
    <div className="offline-notice" role="status">
      {offline && '現在オフラインです。一部の外部サイト・地図は利用できません。'}
    </div>
  )
}
