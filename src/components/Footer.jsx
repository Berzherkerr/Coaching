import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa6";

function Footer() {
  const [vergiLevhasi, setVergiLevhasi] = useState("/vergi-levhasi.png");

  useEffect(() => {
    fetch("/api/iletisim")
      .then((r) => r.json())
      .then((d) => { if (d.vergiLevhasi !== undefined) setVergiLevhasi(d.vergiLevhasi); })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#111] text-white pt-[3.47rem] pb-[2.31rem] px-6">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center md:items-start gap-6 px-4 sm:px-6 lg:px-0">
        {/* Üst kısım */}
        <div className="w-full flex flex-col md:flex-row md:items-stretch md:justify-between">
          {/* Sol blok: 1. cümle */}
          <div className="w-full md:w-[45%] flex items-center justify-center md:justify-start">
            <p className="text-sm md:text-base text-gray-400 leading-relaxed text-center md:text-left max-w-[30rem]">
              Balıkesir'de Fitness, Body Building, kilo verme, kas kazanma, boy
              gelişimi ve postür düzeltme alanlarında birebir koçluk veriyorum.
            </p>
          </div>

          {/* Sağ blok: 2. cümle */}
          <div className="w-full md:w-[45%] flex items-center justify-center md:justify-end mt-4 md:mt-0">
            <p className="text-sm md:text-base text-gray-400 leading-relaxed text-center md:text-right max-w-[30rem]">
              Türkiye genelinde online koçluk hizmetiyle, evden spor yapmak
              isteyenlere, özel antrenman ve beslenme programları sağlıyorum.
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto mt-8 border-t border-gray-700 lg:px-0 px-4 sm:px-6" />

      {/* Alt kısım */}
      <div className="max-w-6xl mx-auto w-full mt-4 px-4 sm:px-6 lg:px-0 flex flex-col md:flex-row md:items-center md:justify-between text-xs md:text-sm text-gray-400">
        {/* Sol metin */}
        <div className="w-full md:w-[45%] flex justify-center md:justify-start">
          <p className="text-center md:text-left">
            Sadece bedenini değil, hayatını değiştir.
          </p>
        </div>

        {/* Sağ metin */}
        <div className="w-full md:w-[45%] flex justify-center md:justify-end mt-2 md:mt-0">
          <p className="italic text-center md:text-right">
            &copy; 2026 İnanç Coaching
            {vergiLevhasi && (
              <>
                &nbsp;·&nbsp;
                <a
                  href={vergiLevhasi}
                  target="_blank"
                  rel="noreferrer"
                  className="not-italic hover:text-white transition-colors underline underline-offset-2"
                >
                  Vergi Levhası
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
