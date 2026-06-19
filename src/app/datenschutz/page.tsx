export default function Datenschutz() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold text-[#2b2b2b] uppercase tracking-wide mb-8 border-l-4 border-[#822660] pl-4">
        Datenschutzerklärung
      </h1>
      <div className="bg-white border border-[#dcdcdc] p-8 text-sm text-[#333333] leading-7 space-y-6">
        <p className="text-[#666666]">
          Die Nutzung unserer Website ist in der Regel ohne die Angabe von personenbezogenen Daten möglich.
          Soweit personenbezogene Daten beim Besuch unserer Webseiten erhoben werden, verarbeiten wir diese
          ausschließlich nach Maßgabe der Datenschutz-Grundverordnung (DSGVO) und des Bundesdatenschutzgesetzes (BDSG).
        </p>

        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">1. Verantwortliche Stelle</h2>
          <p>
            <strong>Jopke Dialog Services</strong><br />
            Am Mondschein 23a, 59557 Lippstadt<br />
            Geschäftsführer: Klaus Jopke<br />
            Telefon: <a href="tel:+4929412868980" className="text-[#822660] hover:underline">+49 2941 28 68 98-0</a><br />
            E-Mail: <a href="mailto:info@jopke.de" className="text-[#822660] hover:underline">info@jopke.de</a>
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">2. Datenschutzbeauftragter</h2>
          <p>
            Herr Dipl.-Inform. Olaf Tenti<br />
            GDI Gesellschaft für Datenschutz und Informationssicherheit mbH<br />
            Körnerstraße 45, 58095 Hagen (NRW)<br />
            Telefon: +49 (0)2331/356832-0<br />
            E-Mail: <a href="mailto:datenschutz@gdi-mbh.eu" className="text-[#822660] hover:underline">datenschutz@gdi-mbh.eu</a>
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">3. Kontaktmöglichkeiten</h2>
          <p>
            Auf unserer Webseite besteht die Möglichkeit, uns per E-Mail zu kontaktieren. In diesem Zusammenhang
            werden Ihre Angaben zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen gespeichert.
            Diese Daten werden nicht ohne Ihre Einwilligung an Dritte weitergegeben.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">4. Ihre Rechte</h2>
          <ul className="list-disc list-inside text-[#666666] space-y-1">
            <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-3">
            Zur Geltendmachung Ihrer Rechte wenden Sie sich bitte an:{" "}
            <a href="mailto:info@jopke.de" className="text-[#822660] hover:underline">info@jopke.de</a>
          </p>
        </section>

        <p className="text-xs text-[#888888] border-t border-[#dcdcdc] pt-4">
          Stand: Februar 2025
        </p>
      </div>
    </main>
  );
}
