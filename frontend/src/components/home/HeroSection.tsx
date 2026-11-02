export function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white min-h-screen flex flex-col">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover object-center">
        <source src="/beispiel 1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24 gap-5">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl leading-tight">
          Mailings online kalkulieren <span className="text-[#822660]">und bestellen</span>
        </h1>
        <p className="text-base text-[#dddddd] max-w-xl">
          Selfmailer, kuvertierte Mailings und Kartenmailings – konfigurieren Sie Ihr
          Wunschprodukt in wenigen Schritten. Drucken, Verarbeiten, Versenden: alles aus einer Hand.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a href="#produkte" className="px-6 py-3 bg-[#822660] hover:bg-[#6b1f50] text-white font-semibold transition-colors">
            Direkt zum Konfigurator
          </a>
          <a href="/kontakt" className="px-6 py-3 border border-[#aaaaaa] text-white font-semibold hover:bg-white/10 transition-colors">
            Angebot anfragen
          </a>
        </div>
      </div>
    </section>
  );
}