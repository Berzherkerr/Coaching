// src/components/Fiyatlar.jsx
import MotionReveal from "./MotionReveal";

const ortakOzellikler = [
  "Kişiye Özgü Vücut Analizi",
  "Kişinin Hedefinin Belirlenmesi",
  "Hedefe Uygun Beslenme Programı",
  "Hedefe Uygun Antreman Programı",
  "Öğün ve Antreman Takibi",
];

const paketler = [
  {
    title: "Uzaktan Eğitim",
    ozel: [
      "Online başlangıç danışmanlığı",
      "Haftalık kontrol ve değerlendirme",
    ],
    fiyat: "3000",
    etiket: null,
    // Koyu tema: mavi
    renk:
      "bg-neutral-900 border border-blue-500/30 ring-1 ring-blue-500/10 hover:border-blue-500/60 hover:ring-blue-500/30",
    etiketRenk: "bg-blue-600",
  },
  {
    title: "Online Özel Ders",
    ozel: [
      "Görüntülü görüşme ile birebir seanslar",
      "Haftalık kontrol ve değerlendirme",
    ],
    fiyat: "5000",
    etiket: "EN ÇOK TERCİH EDİLEN",
    // Koyu tema: mor
    renk:
      "bg-neutral-900 border border-purple-500/30 ring-1 ring-purple-500/10 hover:border-purple-500/60 hover:ring-purple-500/30",
    etiketRenk: "bg-purple-600",
  },
  {
    title: "Birebir Özel Ders",
    ozel: [
      "Spor salonunda beraber antreman",
      "Vücut ölçüm ve analiz seansları",
    ],
    fiyat: "7000",
    etiket: "EN İYİ SONUÇ",
    // Koyu tema: turuncu/amber
    renk:
      "bg-neutral-900 border border-amber-500/30 ring-1 ring-amber-500/10 hover:border-amber-500/60 hover:ring-amber-500/30",
    etiketRenk: "bg-amber-600",
  },
];

function Fiyatlar() {
  return (
    <section id="fiyatlar" className="bg-neutral-950 pt-3 pb-20 px-4 sm:px-8 lg:px-20">
      <MotionReveal>
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Fiyatlandırma ve Paketler
          </h2>
          <p className="mt-4 text-lg text-neutral-300">
            Hedefine uygun çözümü seç ve hemen başlayalım.
          </p>
        </div>
      </MotionReveal>

      {/* Mobil: 1 kolon | Tablet ve üstü: 3 kolon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {paketler.map((paket, index) => (
          <MotionReveal key={paket.title} delay={index * 80}>
            <div
              className={`${paket.renk} relative rounded-xl p-6 shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col justify-between`}
            >
              {/* Etiket */}
              {paket.etiket && (
                <div
                  className={`absolute -top-3 right-3 ${paket.etiketRenk} text-white text-xs font-bold px-2 py-1 rounded shadow-md tracking-wider`}
                >
                  {paket.etiket}
                </div>
              )}

              <div>
                {/* Başlık */}
                <h3 className="text-xl font-semibold text-neutral-100 text-center mb-4">
                  {paket.title}
                </h3>

                {/* Derse özel içerik */}
                <ul className="text-neutral-200 text-sm space-y-2 mb-6 list-disc list-inside">
                  {paket.ozel.map((ozellik, idx) => (
                    <li key={idx}>{ozellik}</li>
                  ))}
                </ul>
              </div>

              {/* Ortak Özellikler */}
              <div className="border-t border-neutral-800 pt-4 mt-auto">
                <ul className="text-neutral-300 text-sm space-y-1 list-disc list-inside">
                  {ortakOzellikler.map((ozellik, idx) => (
                    <li key={idx}>{ozellik}</li>
                  ))}
                </ul>
              </div>

              {/* Fiyat */}
              <div className="mt-6 text-center flex justify-center items-baseline gap-2">
                <p className="text-3xl font-extrabold text-white">₺{paket.fiyat}</p>
                <p className="text-base text-neutral-300 font-medium tracking-wide">/ Aylık</p>
              </div>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

export default Fiyatlar;
