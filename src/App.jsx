import Header from './components/Header'
import Hero from './components/Hero'
import Hakkimda from './components/Hakkimda'
import Hizmetler from './components/Hizmetler'
import Iletisim from './components/Iletisim'
import Footer from './components/Footer'
import Fiyatlar from './components/Fiyatlar'
import GoogleReviews from './components/GoogleReviews'



function App() {
  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
      <Header className="snap-start" />
      <Hero className="snap-start" />
      <Hakkimda className="snap-start"  />
      <GoogleReviews className="snap-start" placeId="ChIJYdRcUvoBtxQR_g1fmBmzv6g" apiBase="http://localhost:5185"/>
      <Hizmetler className="snap-start" />
      <Fiyatlar className="snap-start" />
      <Iletisim className="snap-start" />
      <Footer className="snap-start" />
    </div>
  )
}

export default App