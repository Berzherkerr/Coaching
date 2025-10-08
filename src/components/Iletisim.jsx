// src/components/Iletisim.jsx
import { Mail, MapPin, Phone, Instagram } from "lucide-react";

// Tek parça WhatsApp ikonu (currentColor)
function WhatsAppIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.43 0 .06 5.37.06 11.99c0 2.11.55 4.16 1.6 5.97L0 24l6.2-1.63a12.02 12.02 0 0 0 5.86 1.49h.01c6.62 0 12-5.37 12-11.99 0-3.2-1.25-6.2-3.55-8.39zM12.07 21.3h-.01c-1.96 0-3.88-.53-5.55-1.53l-.4-.24-3.68.97.98-3.58-.26-.37a9.86 9.86 0 0 1-1.54-5.26c0-5.46 4.46-9.9 9.95-9.9 2.66 0 5.15 1.03 7.03 2.9a9.79 9.79 0 0 1 2.93 7.01c0 5.46-4.46 9.99-9.95 9.99zm5.59-7.43c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.46-.88-.76-1.47-1.7-1.64-1.98-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.25-.6-.5-.5-.68-.5-.18 0-.38-.02-.58-.02-.2 0-.53.08-.8.38-.27.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.24 3.1.15.2 2.12 3.37 5.14 4.73.72.31 1.29.5 1.73.64.72.23 1.37.2 1.88.12.57-.08 1.78-.72 2.03-1.42.25-.7.25-1.3.18-1.42-.07-.12-.25-.2-.55-.35z"/>
    </svg>
  );
}

function Iletisim() {
  const phoneE164 = "+905334409803";
  const instagramUrl = "https://www.instagram.com/inanccoaching/";
  const emailTo = "inancoaching@gmail.com";

  return (
    <section id="contact" className="bg-neutral-950 py-20 px-4 sm:px-6 lg:px-8">
      {/* md+: 3 kolon; aynı yükseklik */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
        {/* SOL: İletişim Bilgileri — yazılar büyütüldü ve aralıklar oranlandı */}
        <div className="h-full md:h-[240px] flex flex-col justify-center text-center">
          <h2 className="text-2xl font-bold text-white mb-5">İletişim Bilgilerim</h2>
          <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-5">
            7/24 iletişime geçmekten çekinmeyin. Sorularınıza yardımcı olmaktan memnuniyet duyarım.
          </p>
          <ul className="space-y-4 text-neutral-200 text-base">
            <li className="flex items-start justify-center">
              <MapPin className="w-5 h-5 mt-0.5 text-neutral-300 mr-3" />
              <span>Altıeylül, BALIKESİR</span>
            </li>
            <li className="flex items-start justify-center">
              <Phone className="w-5 h-5 mt-0.5 text-neutral-300 mr-3" />
              <a href={`tel:${phoneE164}`} className="hover:text-orange-400 transition">
                +90 533 440 98 03
              </a>
            </li>
            <li className="flex items-start justify-center">
              <Mail className="w-5 h-5 mt-0.5 text-neutral-300 mr-3" />
              <a href={`mailto:${emailTo}`} className="hover:text-orange-400 transition">
                inanccoaching@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* ORTA: İkon Kartları — Masaüstünde %50 küçültülmüş kare kutular; mobil aynı çizgide ama daha geniş boşluklu */}
        <div className="h-full md:h-[240px]">
          {/* Mobil — kenarlara yaslı, aralık artırıldı */}
          <div className="md:hidden grid grid-cols-4 gap-6 mx-[1rem]">
            {[
              { href: `https://wa.me/${phoneE164}`, icon: <WhatsAppIcon className="h-7 w-7 text-green-400" />, label: "WhatsApp" },
              { href: instagramUrl, icon: <Instagram className="h-7 w-7 text-orange-400" />, label: "Instagram" },
              { href: `mailto:${emailTo}`, icon: <Mail className="h-7 w-7 text-blue-400" />, label: "Mail" },
              { href: `tel:${phoneE164}`, icon: <Phone className="h-7 w-7 text-yellow-300" />, label: "Telefon" },
            ].map((it, i) => (
              <a
                key={i}
                href={it.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-14 rounded-xl border border-neutral-800 bg-neutral-900 p-3
                           hover:border-orange-600/60 hover:shadow-lg transition"
                aria-label={it.label}
                title={it.label}
              >
                {it.icon}
              </a>
            ))}
          </div>

          {/* Masaüstü — kare ve küçük (öncekine göre en az %50 küçültüldü) */}
          <div className="hidden md:grid grid-cols-4 gap-2 h-full place-items-center">
            {[
              { href: `https://wa.me/${phoneE164}`, icon: <WhatsAppIcon className="h-8 w-8 text-green-400" />, label: "WhatsApp" },
              { href: instagramUrl, icon: <Instagram className="h-8 w-8 text-orange-400" />, label: "Instagram" },
              { href: `mailto:${emailTo}`, icon: <Mail className="h-8 w-8 text-blue-400" />, label: "Mail" },
              { href: `tel:${phoneE164}`, icon: <Phone className="h-8 w-8 text-yellow-300" />, label: "Telefon" },
            ].map((it, i) => (
              <a
                key={i}
                href={it.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-neutral-800 bg-neutral-900
                           hover:border-orange-600/60 hover:ring-1 hover:ring-orange-600/30 hover:shadow-lg transition
                           w-20 h-20 aspect-square flex items-center justify-center p-3"
                aria-label={it.label}
                title={it.label}
              >
                {it.icon}
              </a>
            ))}
          </div>
        </div>

        {/* SAĞ: Harita — masaüstünde %25 küçültüldü (320→240), dark themed */}
        <div className="h-[256px] md:h-[240px] rounded-md overflow-hidden shadow-md bg-neutral-900 border border-neutral-800">
          <iframe
            title="Konum"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d543.1339278799962!2d27.882835267360313!3d39.64004822604878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b701fa525cd461%3A0xa8bfb319985f0dfe!2zxLBuYW7DpyBDb2FjaGluZw!5e0!3m2!1sen!2sde!4v1754712858841!5m2!1sen!2sde"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0 w-full h-full
                       filter invert-[.92] hue-rotate-180 saturate-[.8] contrast-[1.05] brightness-95"
          />
        </div>
      </div>
    </section>
  );
}

export default Iletisim;
