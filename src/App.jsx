import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Hakkimda from './components/Hakkimda'
import Hizmetler from './components/Hizmetler'
import Iletisim from './components/Iletisim'
import Footer from './components/Footer'
import Fiyatlar from './components/Fiyatlar'
import GoogleReviews from './components/GoogleReviews'
import Program from './components/Program'
import AdminPanel from './pages/AdminPanel'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(window.location.pathname === '/admin')
  }, [])

  if (isAdmin) return <AdminPanel />

  return (
    <div className="min-h-screen bg-neutral-950 overflow-x-hidden overflow-y-hidden scroll-extrasmooth">
      <Header className="snap-start" />
      <Hero className="snap-start" />
      <Hakkimda className="snap-start"  />
      <GoogleReviews className="snap-start" placeId="ChIJYdRcUvoBtxQR_g1fmBmzv6g" averageRating={5.0} totalReviews={114} />
      <Hizmetler className="snap-start" />
      <Program className="snap-start" />
      <Fiyatlar className="snap-start" />
      <Iletisim className="snap-start" />
      <Footer className="snap-start" />
    </div>
  )
}

export default App