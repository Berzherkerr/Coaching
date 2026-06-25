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
