export default function AGB() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold text-[#2b2b2b] uppercase tracking-wide mb-8 border-l-4 border-[#822660] pl-4">
        Allgemeine Geschäftsbedingungen
      </h1>
      <div className="bg-white border border-[#dcdcdc] p-8 text-sm text-[#333333] leading-7 space-y-6">
        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">1. Geltungsbereich</h2>
          <p className="text-[#666666]">
            Die nachstehenden AGB sind Bestandteil sämtlicher Verträge mit:
          </p>
          <address className="not-italic mt-2">
            <strong>Jopke Dialog Services</strong><br />
            Am Mondschein 23a, 59557 Lippstadt<br />
            Geschäftsführer: Klaus Jopke<br />
            Umsatzsteuer-ID-Nr.: DE125721023<br />
            Telefon: +49 (0) 2941 – 2868 980<br />
            Fax: +49 (0) 2941 – 2868 989<br />
            <a href="mailto:info@jopke.de" className="text-[#822660] hover:underline">info@jopke.de</a>
          </address>
          <p className="mt-3 text-[#666666]">
            Mitglied im DDV – Deutscher Dialogmarketing Verband e.V.
          </p>
          <p className="mt-2 text-[#666666]">
            Nachstehende Verkaufsbedingungen gelten nur gegenüber Unternehmern im Sinne von § 14 BGB.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">2. Vertragsschluss</h2>
          <p className="text-[#666666]">
            Der Vertrag mit dem Auftraggeber kommt erst mit Zugang der Auftragsbestätigung bzw. mit
            Ausführung des Auftrags zustande. Der Auftraggeber ist längstens sieben Tage an seine
            Bestellung gebunden.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">3. Preise und Zahlungsmodalitäten</h2>
          <p className="text-[#666666]">
            Sofern nichts anderes vermerkt ist, verstehen sich die angegebenen Preise zzgl. der jeweils
            gültigen gesetzlichen Umsatzsteuer. Versand- und Portokosten werden separat berechnet und sind
            spätestens drei Tage vor dem vorgesehenen Versandtermin fällig.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">4. Lieferung</h2>
          <p className="text-[#666666]">
            Die vereinbarte Lieferfrist ist eingehalten, wenn am Tage der Übergabe an den Transportführer
            bzw. das Versandunternehmen die Frist noch nicht abgelaufen ist. Sofern sich aus der
            Auftragsbestätigung nichts anderes ergibt, ist Lieferung „ab Werk" vereinbart.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">5. Haftung</h2>
          <p className="text-[#666666]">
            Der Auftragnehmer haftet für vorsätzliche oder grob fahrlässige Verursachung von Schäden.
            Für leichte Fahrlässigkeit haftet der Auftragnehmer nur bei Verletzung des Lebens, des Körpers
            oder der Gesundheit sowie bei einer Verletzung vertragswesentlicher Pflichten.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-[#2b2b2b] mb-2">6. Gerichtsstand und anwendbares Recht</h2>
          <p className="text-[#666666]">
            Es findet ausschließlich das Recht der Bundesrepublik Deutschland Anwendung. Gerichtsstand
            ist der Sitz des Auftragnehmers (Lippstadt), sofern gesetzlich zulässig.
          </p>
        </section>

        <div className="flex items-center gap-4 border-t border-[#dcdcdc] pt-4 text-xs text-[#888888]">
          <span>Stand: 01.06.2018</span>
          <a
            href="https://www.jopke.de/agb/AGB_Jopke_Stand_2018-06-01.pdf"
            className="text-[#822660] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            AGB als PDF herunterladen ↓
          </a>
        </div>
      </div>
    </main>
  );
}
