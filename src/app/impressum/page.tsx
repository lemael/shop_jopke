export default function Impressum() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold text-[#2b2b2b] uppercase tracking-wide mb-8 border-l-4 border-[#822660] pl-4">
        Impressum
      </h1>
      <div className="bg-white border border-[#dcdcdc] p-8 text-sm text-[#333333] leading-7 space-y-4">
        <p>
          <strong>Jopke Dialog Services</strong><br />
          Am Mondschein 23a<br />
          59557 Lippstadt
        </p>
        <p>
          Inhaber und verantwortlich für den Inhalt: <strong>Klaus Jopke</strong>
        </p>
        <p>
          Telefon: <a href="tel:+4929412868980" className="text-[#822660] hover:underline">+49 2941 2868 980</a><br />
          Telefax: +49 2941 2868 989<br />
          E-Mail: <a href="mailto:info@jopke.de" className="text-[#822660] hover:underline">info@jopke.de</a><br />
          Internet: <a href="https://www.jopke.de" className="text-[#822660] hover:underline" target="_blank" rel="noopener noreferrer">www.jopke.de</a>
        </p>
        <p>
          Umsatzsteuer-ID: <strong>DE125721023</strong>
        </p>
        <p className="text-[#666666] text-xs border-t border-[#dcdcdc] pt-4">
          Jopke Dialog Services ist bemüht, für die Richtigkeit und Aktualität aller auf der Website enthaltenen
          Informationen und Daten zu sorgen. Für die Aktualität, Richtigkeit und Vollständigkeit aller oder
          einzelner Informationen und Daten wird jedoch keine Gewähr übernommen.
        </p>
      </div>
    </main>
  );
}
