import Header from '../components/Header'
import Hero from '../components/Hero'
import Hakkimda from '../components/Hakkimda'
import Hizmetler from '../components/Hizmetler'
import GoogleReviews from '../components/GoogleReviews'
import Blog from '../components/Blog'
import Iletisim from '../components/Iletisim'
import Footer from '../components/Footer'

export default function HomePage({ cardsVisible = true }) {
  return (
    <div className="min-h-screen bg-neutral-950 overflow-x-hidden">
      <Header />
      <Hero />
      <Hakkimda />
      <GoogleReviews
        placeId="ChIJYdRcUvoBtxQR_g1fmBmzv6g"
        averageRating={5.0}
        totalReviews={114}
        cardsVisible={cardsVisible}
      />
      <Hizmetler />
      <Blog />
      <Iletisim />
      <Footer />
    </div>
  )
}
