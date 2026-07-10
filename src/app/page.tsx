import type { ProduktKarte } from "@/types/produkt";
import { CategorySection } from "@/components/CategorySection";

// ─── Product data ────────────────────────────────────────────────────────────

const selfmailerProducts: ProduktKarte[] = [
  { id: 1, name: "DIN-Lang-Selfmailer LEVI", format: "210 × 100/105 mm", pages: "4–12 Seiten", price: "ab 0,29 €", href: "/shop/levi", image: "/levi-selfmailer.svg" },
  { id: 2, name: "Maxi-Selfmailer INATA", format: "235 × 125 mm", pages: "4–8 Seiten", price: "ab 0,35 €", href: "/shop/inata", image: "/inata-selfmailer.svg" },
  { id: 3, name: "Maxi-Selfmailer mit Klappe ALBA", format: "235 × 125 mm", pages: "6–8 Seiten", price: "ab 0,39 €", href: "/shop/klappe_alba", image: "/alba-selfmailer.svg" },
  { id: 4, name: "DIN-A6-Selfmailer MIKRO", format: "148 × 105 mm", pages: "4–8 Seiten", price: "ab 0,22 €", href: "/shop/mikro", image: "/mikro-selfmailer.svg" },
  { id: 5, name: "DIN-A5-Selfmailer MEGALO", format: "210 × 148 mm", pages: "4–8 Seiten", price: "ab 0,38 €", href: "/shop/megalo", image: "/megalo-selfmailer.svg" },
  { id: 6, name: "DIN-Lang-Poster-Selfmailer ANDIGO", format: "210 × 100 mm", pages: "12 Seiten", price: "ab 0,45 €", href: "/shop/andigo", image: "/andigo-selfmailer.svg" },
  { id: 7, name: "DIN-A5-Poster-Selfmailer AFISA", format: "210 × 148 mm", pages: "8 Seiten Kreuzfalz", price: "ab 0,49 €", href: "/shop/afisa", image: "/afisa-selfmailer.svg" },
  { id: 8, name: "DIN-Lang-Minikatalog ALVARO", format: "210 × 105 mm", pages: "16–20 Seiten Rückendrahtheftung", price: "ab 0,55 €", href: "/shop/alvaro", image: "/alvaro-katalog.svg" },
  { id: 9, name: "Bestseller LEVI", format: "210 × 100 mm", pages: "6 Seiten Wickelfalz", price: "ab 0,29 €", image: "/bestseller-levi.svg" },
];

const kuvertiertesMailingProducts: ProduktKarte[] = [
  { id: 1, name: "DIN-Lang-Mailing", format: "229 × 114 mm", pages: "kuvertiert", price: "ab 0,39 €", href: "/shop/lang_mailing", image: "/dinlang-mailing.svg" },
  { id: 2, name: "DIN-C4-Mailing", format: "324 × 229 mm", pages: "kuvertiert", price: "ab 0,65 €", href: "/shop/c4_mailing", image: "/dinc4-mailing.svg" },
];

const kartenMailingProducts: ProduktKarte[] = [
  { id: 1, name: "Postkarte DIN-Lang", format: "210 × 98 mm", pages: "1-seitig", price: "ab 0,19 €", href: "/shop/post_din_lan_98", image: "/postkarte-dinlang.svg" },
  { id: 2, name: "Postkarte DIN-Lang", format: "210 × 105 mm", pages: "1-seitig", price: "ab 0,19 €", href: "/shop/post_din_lan_105", image: "/postkarte-dinlang.svg" },
  { id: 3, name: "Postkarte Maxi", format: "235 × 125 mm", pages: "1-seitig", price: "ab 0,24 €", href: "/shop/post_maxi", image: "/postkarte-maxi.svg" },
  { id: 4, name: "Postkarte DIN A6", format: "148 × 105 mm", pages: "1-seitig", price: "ab 0,15 €", href: "/shop/post_din_a6", image: "/postkarte-dina6.svg" },
  { id: 5, name: "Postkarte DIN A5", format: "210 × 148 mm", pages: "1-seitig", price: "ab 0,28 €", href: "/shop/post_din_a5", image: "/postkarte-dina5.svg" },
  { id: 6, name: "Postkarte DIN A4", format: "297 × 210 mm", pages: "1-seitig", price: "ab 0,45 €", href: "/shop/post_din_a4", image: "/postkarte-dina4.svg" },
  { id: 7, name: "Bestseller Karte Maxi", format: "235 × 125 mm", pages: "4/4-farbig, UV-Lack VS", price: "ab 0,24 €", image: "/postkarte-maxi.svg" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4] font-sans">
      {/* ── Top info bar ── */}
      <div className="bg-[#2b2b2b] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-center gap-6 sm:justify-between">
          <span>✓ Expressversand möglich</span>
          <span>✓ Zertifizierte Druckqualität</span>
          <span>✓ Persönlicher Kundenservice</span>
          <span>✓ Faire Preise ohne versteckte Kosten</span>
        </div>
      </div>

      {/* ── Navbar ── */}
      <header className="bg-[#1e1e1e] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center shrink-0">
              <img src="/jopke-logo.svg" alt="Jopke Dialog Services" className="h-8 w-auto" />
            </a>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#cccccc]">
              <a href="#selfmailer" className="hover:text-white transition-colors">Selfmailer</a>
              <a href="#kuvertiertes-mailing" className="hover:text-white transition-colors">Kuvertiertes Mailing</a>
              <a href="#kartenmailing" className="hover:text-white transition-colors">Kartenmailing</a>
              <a href="/preise" className="hover:text-white transition-colors">Preise</a>
              <a href="/kontakt" className="hover:text-white transition-colors">Kontakt</a>
            </nav>

            {/* CTA */}
            <a
              href="/kontakt"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#822660] hover:bg-[#6b1f50] text-white text-sm font-semibold transition-colors shrink-0"
            >
              Angebot anfragen
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden text-white min-h-screen flex flex-col">
        {/* Background video – natural aspect ratio, full width */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/beispiel 1.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Content – vertically centred */}
        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24 gap-5">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl leading-tight">
            Mailings online kalkulieren{" "}
            <span className="text-[#822660]">und bestellen</span>
          </h1>
          <p className="text-base text-[#dddddd] max-w-xl">
            Selfmailer, kuvertierte Mailings und Kartenmailings – konfigurieren Sie Ihr
            Wunschprodukt in wenigen Schritten. Drucken, Verarbeiten, Versenden: alles aus einer Hand.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a
              href="#produkte"
              className="px-6 py-3 bg-[#822660] hover:bg-[#6b1f50] text-white font-semibold transition-colors"
            >
              Direkt zum Konfigurator
            </a>
            <a
              href="/kontakt"
              className="px-6 py-3 border border-[#aaaaaa] text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Angebot anfragen
            </a>
          </div>
        </div>
      </section>

      {/* ── Product sections ── */}
      <main id="produkte" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="selfmailer" className="scroll-mt-20">
          <CategorySection
            title="Selfmailer"
            subtitle="Ohne Umschlag – direkt adressiert und versandfertig"
            products={selfmailerProducts}
            columns={3}
          />
        </div>

        <div id="kuvertiertes-mailing" className="scroll-mt-20">
          <CategorySection
            title="Kuvertiertes Mailing"
            subtitle="Klassische Briefe und Mailings mit Umschlag"
            products={kuvertiertesMailingProducts}
            columns={2}
          />
        </div>

        <div id="kartenmailing" className="scroll-mt-20">
          <CategorySection
            title="Kartenmailing"
            subtitle="Postkarten – einfach, günstig, wirkungsvoll"
            products={kartenMailingProducts}
            columns={3}
          />
        </div>
      </main>

      {/* ── Features strip ── */}
      <section className="bg-white border-t border-[#dcdcdc] mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Schnelle Lieferung", desc: "Expressversand innerhalb von 24–48 h" },
            { title: "Zertifizierte Qualität", desc: "Mitglied im DDV, zertifizierter Performance-Partner" },
            { title: "Garantierte Preise", desc: "Transparente Kalkulation, keine versteckten Kosten" },
            { title: "Persönlicher Service", desc: "Beratung von Mo.–Fr. 08:00–17:00 Uhr" },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-start gap-2 border-l-2 border-[#822660] pl-4">
              <h3 className="font-semibold text-[#2b2b2b]">{f.title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1e1e1e] text-[#999999] text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span className="text-white font-bold text-base">MailingOnline</span>
            <address className="mt-3 text-xs not-italic leading-6">
              Jopke Dialog Services<br />
              Am Mondschein 23a<br />
              59557 Lippstadt<br />
              <a href="tel:+4929412868980" className="hover:text-white">+49 2941 2868 980</a><br />
              <a href="mailto:info@jopke.de" className="hover:text-white">info@jopke.de</a>
            </address>
            <p className="mt-3 text-xs">
              Mo.–Fr. 08:00–17:00 Uhr<br />
              Nur für gewerbliche Kunden.<br />
              Alle Preise zzgl. MwSt.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <span className="text-white font-semibold uppercase tracking-wide">Produkte</span>
            <a href="#selfmailer" className="hover:text-white">Selfmailer</a>
            <a href="#kuvertiertes-mailing" className="hover:text-white">Kuvertiertes Mailing</a>
            <a href="#kartenmailing" className="hover:text-white">Kartenmailing</a>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <span className="text-white font-semibold uppercase tracking-wide">Unternehmen</span>
            <a href="/kontakt" className="hover:text-white">Kontakt</a>
            <a href="/impressum" className="hover:text-white">Impressum</a>
            <a href="/datenschutz" className="hover:text-white">Datenschutz</a>
            <a href="/agb" className="hover:text-white">AGB</a>
          </div>
        </div>
        <div className="border-t border-[#333333] text-center py-4 text-xs">
          © {new Date().getFullYear()} MailingOnline · powered by Jopke Dialog Services
        </div>
      </footer>
    </div>
  );
}
