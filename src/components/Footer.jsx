import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaWhatsapp,
} from 'react-icons/fa6';

function Footer() {
  return (
    <footer className="bg-[#111] text-white pt-12 pb-8 px-6">
      {/* Hizalama düzeltildi */}
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center md:items-start gap-6 px-4 sm:px-6 lg:px-0">
        
        {/* LOGO */}
        <div className="text-3xl font-bold tracking-wide mb-7">
          İnanç Coaching
        </div>

        {/* Bottom Content */}
        <div className="w-full flex flex-col md:flex-row md:justify-between items-center md:items-center gap-6">
          
          {/* Nav Links */}
          <div className="flex gap-6 text-sm font-semibold">
            <a href="#hakkimda">Hakkımda</a>
            <a href="#hizmetler">Hizmetler</a>
            <a href="#fiyatlar">Fiyatlandırma</a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 text-xl">
            <a
              href="https://wa.me/905334409803"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.instagram.com/inanccoaching/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="mailto:inanccoaching@gmail.com"
              aria-label="E-posta"
              title="E-posta"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto mt-8 border-t border-gray-700 lg:px-0 px-4 sm:px-6" />

      {/* Bottom Info */}
      <div className="max-w-6xl mx-auto w-full mt-4 px-4 sm:px-6 lg:px-0 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>Sadece bedenini değil, hayatını değiştir.</p>
        <p className="italic text-center mt-2 md:mt-0">&copy; 2025 İnanç Coaching </p>
      </div>
    </footer>
  );
}

export default Footer;
