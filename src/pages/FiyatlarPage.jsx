import Header from '../components/Header'
import Fiyatlar from '../components/Fiyatlar'
import Program from '../components/Program'
import Footer from '../components/Footer'

export default function FiyatlarPage() {
  return (
    <div className="min-h-screen bg-neutral-950 overflow-x-hidden">
      <Header />
      <Fiyatlar />
      <Program />
      <Footer />
    </div>
  )
}
