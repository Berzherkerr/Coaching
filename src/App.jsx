import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FiyatlarPage from './pages/FiyatlarPage'
import AdminPanel from './pages/AdminPanel'

function App() {
  const [reviewsVisible, setReviewsVisible] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (typeof d.reviewsVisible === 'boolean') setReviewsVisible(d.reviewsVisible) })
      .catch(() => {})

    // Ziyaret say
    fetch('/api/track', { method: 'POST' }).catch(() => {})

    // Aktif kullanıcı ping (her 60s)
    let sid = sessionStorage.getItem('_sid')
    if (!sid) { sid = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); sessionStorage.setItem('_sid', sid) }
    const ping = () => fetch('/api/ping', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sid }) }).catch(() => {})
    ping()
    const t = setInterval(ping, 60000)
    return () => clearInterval(t)
  }, [])

  if (window.location.pathname === '/admin') return <AdminPanel />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage cardsVisible={reviewsVisible} />} />
        <Route path="/fiyatlar" element={<FiyatlarPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
