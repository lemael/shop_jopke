"use client";

import { useEffect, useState, type ReactNode } from "react";

interface HilfeTab {
  id: string;
  label: string;
  titel: string;
  intro: string;
  punkte?: string[];
  content?: ReactNode;
}

const TABS: HilfeTab[] = [
  {
    id: "auflage",
    label: "Auflage",
    titel: "Auflage",
    intro:
      "Die Auflage ist die Anzahl der Stück, die Sie von Ihrem Mailing produzieren lassen möchten. Sie ist der erste Schritt im Konfigurator und wirkt sich direkt auf den Stückpreis sowie die Gesamt-Portokosten aus.",
    punkte: [
      "Wählen Sie eine der vorgeschlagenen Mengen-Kacheln oder tragen Sie im Feld „Eigene Menge“ eine individuelle Stückzahl ein.",
      "Jedes Produkt hat eine Mindest- und eine Maximalmenge (häufig ab 500 Stück) – außerhalb dieses Bereichs ist die Auflage nicht gültig.",
      "Größere Auflagen senken in der Regel den Preis pro Stück.",
      "Bei sehr hohen Mengen außerhalb der Standardstaffel erstellen wir Ihnen ein individuelles Angebot.",
    ],
  },
  {
    id: "endformat",
    label: "Endformat",
    titel: "Endformat",
    intro:
      "Das Endformat ist die fertige Größe des Druckstücks, z. B. nach dem Falzen oder Schneiden. Bei manchen Inhaltsteilen (etwa der Antwortkarte) stehen mehrere Endformate zur Auswahl.",
    punkte: [
      "Das Endformat wird unabhängig von Grammatur und Oberfläche gewählt.",
      "Ein passendes Endformat ist Voraussetzung für die maßgenaue Verarbeitung (z. B. Kuvertierung).",
    ],
  },
  {
    id: "umfang",
    label: "Umfang",
    titel: "Umfang",
    intro:
      "Der Umfang beschreibt, aus wie vielen Seiten Ihr Mailing besteht (z. B. 4, 6, 8, 10 oder 12 Seiten). Er bestimmt zugleich das offene Format (die Größe vor dem Falzen) und das Endformat (die Größe nach dem Falzen).",
    punkte: [
      "Mehr Seiten bedeuten mehr Platz für Inhalte, aber auch ein größeres offenes Format vor dem Falzen.",
      "Zu jedem Umfang gehört eine passende Druckvorlage (PDF) mit den korrekten Maßen.",
      "Der gewählte Umfang schränkt die im nächsten Schritt verfügbaren Grammaturen ein.",
    ],
  },
  {
    id: "grammatur",
    label: "Grammatur",
    titel: "Grammatur",
    intro:
      "Die Grammatur gibt das Papiergewicht in Gramm pro Quadratmeter (g/m²) an, z. B. 135, 170 oder 250 g/m². Sie bestimmt Haptik, Stabilität und Wertigkeit des Mailings.",
    punkte: [
      "Niedrigere Grammaturen (z. B. 135 g/m²) wirken leichter und flexibler.",
      "Höhere Grammaturen (z. B. 250 g/m²) fühlen sich stabiler und hochwertiger an, erhöhen aber ggf. das Gewicht und damit die Portoklasse.",
      "Alle angebotenen Grammaturen werden in der gleichen Papierart (z. B. Bilderdruck, matt) angeboten, sofern nicht anders angegeben.",
      "Die verfügbaren Grammaturen hängen vom zuvor gewählten Umfang ab.",
    ],
  },
  {
    id: "oberflaeche",
    label: "Oberfläche",
    titel: "Oberfläche",
    intro:
      "Die Oberfläche beschreibt die Veredelung des bedruckten Papiers – matt oder glänzend. Sie beeinflusst Optik und Haptik, aber auch Lesbarkeit und Lichtreflexion.",
    punkte: [
      "„Matt“ wirkt zurückhaltender und reduziert Blendung beim Lesen.",
      "„Glänzend“ lässt Farben kräftiger wirken und sorgt für einen edleren Eindruck.",
      "Die Oberfläche wird unabhängig von Grammatur und Umfang gewählt.",
    ],
  },
  {
    id: "farbigkeit",
    label: "Farbigkeit",
    titel: "Farbigkeit",
    intro:
      "Die Farbigkeit gibt an, mit wie vielen Farben Vorder- und Rückseite bedruckt werden, z. B. 4/4-farbig Euroskala (vollfarbig beidseitig) oder 1/0-farbig Schwarz (einseitig schwarz-weiß).",
    punkte: [
      "Die erste Ziffer steht für die Anzahl der Farben auf der Vorderseite, die zweite für die Rückseite.",
      "„Euroskala“ bedeutet Vollfarbdruck (CMYK), „Schwarz“ bedeutet reiner Schwarzdruck.",
      "Bei einer Fensterhülle kann auch „unbedruckt“ gewählt werden – die Hülle bleibt dann werkseitig weiß.",
      "Eine höhere Farbigkeit wirkt hochwertiger, kann sich aber auf den Druckpreis auswirken.",
    ],
  },
  {
    id: "perforation",
    label: "Perforation",
    titel: "Perforation",
    intro:
      "Die Perforation ist eine Reihe kleiner Einstanzungen im Papier, an denen sich ein Teil des Mailings sauber abtrennen lässt – etwa eine Antwortkarte oder ein Abschnitt.",
    punkte: [
      "„Ohne“ bedeutet: Das Mailing wird ohne Perforation gedruckt.",
      "Ist eine Perforation verfügbar, wird sie meist „parallel zur letzten Seite“ angebracht, damit sich diese Seite sauber heraustrennen lässt.",
      "Nicht jede Kombination aus Umfang und Grammatur bietet mehrere Perforationsoptionen – ist nur eine Option möglich, wird dieser Schritt automatisch übersprungen.",
    ],
  },
  {
    id: "verarbeitung",
    label: "Verarbeitung",
    titel: "Verarbeitung",
    intro:
      "Die Verarbeitung beschreibt, wie das gedruckte Blatt zum fertigen Mailing wird: welche Falzart verwendet wird und wie das Mailing verschlossen ist.",
    punkte: [
      "Falzarten wie Mittelfalz oder Wickelfalz bestimmen, wie das offene Format zum kompakten Endformat gefaltet wird.",
      "Der Verschluss erfolgt z. B. über ablösbaren Leim oder ein transparentes, perforiertes Etikett.",
      "Manche Verarbeitungsarten sind mit einem Aufpreis verbunden – dies wird in der Übersicht ausgewiesen.",
    ],
  },
  {
    id: "papier",
    label: "Papier",
    titel: "Papier",
    intro:
      "Beim Kartenmailing wählen Sie zunächst die Papierart bzw. den Karton, aus dem Ihre Karte gefertigt wird. Die Auswahl bestimmt Haptik, Stabilität und Optik der fertigen Karte.",
    punkte: [
      "Zur Auswahl stehen unterschiedliche Kartonsorten mit jeweils eigener Grammatur und Oberfläche (z. B. glänzend oder matt).",
      "Das gewählte Papier schränkt die im nächsten Schritt verfügbaren Veredelungen ein.",
      "Hochwertigere Kartonsorten wirken sich auf den Endpreis aus.",
    ],
  },
  {
    id: "veredelung",
    label: "Veredelung",
    titel: "Veredelung",
    intro:
      "Die Veredelung ist eine zusätzliche Oberflächenbehandlung der Karte, die Optik und Haptik weiter aufwertet – oder Sie verzichten ganz darauf.",
    punkte: [
      "„Ohne“ bedeutet: Die Karte wird ohne zusätzliche Veredelung gedruckt.",
      "Welche Veredelungen verfügbar sind, hängt vom zuvor gewählten Papier ab.",
      "Veredelungen können mit einem Aufpreis verbunden sein – dies wird in der Übersicht ausgewiesen.",
    ],
  },
  {
    id: "huellentyp",
    label: "Hüllentyp",
    titel: "Hüllentyp",
    intro:
      "Beim kuvertierten Mailing wählen Sie zunächst den Hüllentyp – also die Art des Umschlags, in dem Ihr Mailing verschickt wird.",
    punkte: [
      "Zur Auswahl stehen z. B. Fensterhülle, Panorama-Fensterhülle oder Hülle ohne Fenster.",
      "Bei einer Fensterhülle ist ein Adress- bzw. Panoramafenster bereits eingeplant; bei einer Hülle ohne Fenster wird die Hülle stattdessen personalisiert bedruckt.",
      "Der gewählte Hüllentyp bestimmt, welche Ausstattungs-Kombinationen im nächsten Schritt verfügbar sind.",
    ],
  },
  {
    id: "ausstattung",
    label: "Ausstattung",
    titel: "Ausstattung",
    intro:
      "Die Ausstattung legt fest, welche Inhaltsteile in Ihrem kuvertierten Mailing enthalten sind – etwa Anschreiben, Flyer, Broschüre oder Antwortkarte.",
    punkte: [
      "Je nach Hüllentyp stehen unterschiedliche Kombinationen zur Auswahl, z. B. „Anschreiben + bis zu 3 Flyer“ oder „Broschüre + Antwortkarte“.",
      "Ein personalisiertes Anschreiben ist bei den meisten Ausstattungen bereits enthalten.",
      "Mehr Inhaltsteile bedeuten in der Regel ein höheres Gewicht und damit möglicherweise eine andere Versandklasse.",
    ],
  },
  {
    id: "uebersicht",
    label: "Übersicht",
    titel: "Übersicht & Anfrage",
    intro:
      "Die Übersicht ist der letzte Schritt des Konfigurators. Hier sehen Sie alle getroffenen Auswahlen sowie eine vollständige Preisaufstellung.",
    punkte: [
      "Eine Tabelle fasst Auflage, Format, Grammatur, Perforation, Verarbeitung und weitere Produktdetails zusammen.",
      "Sie können zwischen Standard- und Express-Bearbeitung wählen; Express ist mit einem Aufpreis verbunden.",
      "Die Preisaufstellung zeigt Druck, Porto sowie Netto-, MwSt.- und Bruttobetrag.",
      "Über den Button „Jetzt anfragen“ senden wir Ihnen innerhalb eines Werktages ein verbindliches Angebot.",
    ],
  },
  {
    id: "dialogpost",
    label: "Dialogpost",
    titel: "Was ist Dialogpost?",
    intro:
      "Dialogpost ist ein kostengünstiges Werbeformat der Deutschen Post, das sich besonders für adressierte Werbesendungen eignet.",
    content: (
      <div className="space-y-6 text-sm text-[#333333] leading-7">
        <p>
          Mit DIALOGPOST verschicken Sie adressierte, schriftliche Informationen sowie Werbesendungen und Kataloge zu einem besonders günstigen Preis an Ihre Kunden.
          Mit der Beilage von kostenlosen Proben, Produktmustern, Werbeartikeln oder Prospekten anderer Absender können Sie Ihre DIALOGPOST noch attraktiver gestalten.
        </p>

        <div>
          <h3 className="font-semibold text-base mb-2">Voraussetzungen</h3>
          <p>Die Sendungen müssen werblichen Charakter haben und die formalen Anforderungen der Deutschen Post erfüllen.</p>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Das können Sie mit DIALOGPOST versenden:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Sendungen mit ausschließlich werblichen Inhalten</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Das können Sie nicht mit DIALOGPOST versenden:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Verkaufswaren</li>
            <li>Zahlungsaufforderungen (z. B. Rechnungen, Mahnungen)</li>
            <li>Sendungen mit nicht-werblichen Inhalten</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Alle Sendungen haben</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>den gleichen einzigen Absender</li>
            <li>die gleiche innere und äußere Anschrift</li>
            <li>das gleiche Hüllenformat*</li>
            <li>die gleiche Frankierung innerhalb einer Einlieferung</li>
            <li>das gleiche Basisformat</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Anforderungen an werbliche Inhalte</h3>
          <p>
            Werbliche Sendungen im Sinne der DIALOGPOST sind insbesondere schriftliche Mitteilungen, die der Kunden-/Mitgliederbindung und/oder -gewinnung dienen.
            Weiterhin ist der Zweck dieser Mitteilungen, Kunden oder Mitglieder zum Kauf oder zur Nutzung von Produkten und Dienstleistungen zu motivieren.
            Ebenso können kostenlose Angebote unterbreitet oder spezielle Informationen gegeben werden, die einer positiven Darstellung von z. B. Unternehmen, Marken, Produkten oder auch Personen dienen (auch ohne Kaufangebote).
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Beispiele für werbliche Inhalte</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Angebote, die Kunden zum Kauf oder zur Nutzung von Produkten und Dienstleistungen motivieren sollen und denen Gratisproben, -muster und -werbeartikel beigelegt werden können</li>
            <li>Imagewerbung, Parteienwerbung</li>
            <li>Einladungen zur Teilnahme an Veranstaltungen (z. B. Tag der offenen Tür, Stadtfeste, Ausstellungen, Verkaufspräsentationen)</li>
            <li>Einladungen zur Teilnahme an Gewinnspielen</li>
            <li>Mitteilungen im Rahmen von Bonusprogrammen in Verbindung mit Angeboten</li>
            <li>Kundenmagazine</li>
            <li>Spendenaufrufe</li>
            <li>Glückwünsche</li>
            <li>werbliche Kundenkarten ohne Bezahlfunktion (keine Ersatzkarten)</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Mindestmengen</h3>
          <div className="overflow-x-auto border rounded border-[#e5e7eb]">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="px-3 py-2">Menge</th>
                  <th className="px-3 py-2">Region</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">5.000 Sendungen DIALOGPOST</td>
                  <td className="px-3 py-2">bundesweit</td>
                </tr>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">200 Sendungen DIALOGPOST</td>
                  <td className="px-3 py-2">Für dieselbe Leitregion<br /><span className="text-xs text-[#666666]">(Übereinstimmung der ersten beiden Stellen der Postleitzahl)</span></td>
                </tr>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">500 Sendungen DIALOGPOST EASY</td>
                  <td className="px-3 py-2">bundesweit (mit Zuschlag Kleinmenge)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Internationale Sendungen</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Mindestens 50 Sendungen in beliebig viele Länder pro Auftrag, eine Aufzahlung zur Mindestmenge ist möglich.</li>
            <li>Alle Sendungen sind inhalts-, format- und gewichtsgleich (gilt auch für die Beilagen).</li>
            <li>Es gelten die Höchst- und Mindestmaße wie für MAXIBRIEF INTERNATIONAL.</li>
            <li>Bücher und Broschüren dürfen ein Einzelgewicht bis 5.000 g haben.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Laufzeiten</h3>
          <p>
            <strong>DIALOGPOST NATIONAL</strong><br />
            Die Sendungen werden von der Deutschen Post in der Regel innerhalb von vier Werktagen nach dem Einlieferungstag von dienstags bis samstags zugestellt. Dabei handelt es sich um ein Qualitätsziel und nicht um eine Laufzeitzusage.
          </p>
          <p>
            <strong>DIALOGPOST INTERNATIONAL</strong><br />
            Europaweit beträgt die Laufzeit im Tarif „PRIORITY“ 3-5 Werktage.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Maße und Gewichte</h3>
          <div className="overflow-x-auto border rounded border-[#e5e7eb]">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="px-3 py-2">Basisformat</th>
                  <th className="px-3 py-2">Länge</th>
                  <th className="px-3 py-2">Breite</th>
                  <th className="px-3 py-2">Dicke</th>
                  <th className="px-3 py-2">Gewicht</th>
                  <th className="px-3 py-2">Form</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">Standard*</td>
                  <td className="px-3 py-2">150 - 235 mm</td>
                  <td className="px-3 py-2">90 - 125 mm</td>
                  <td className="px-3 py-2">bis 5 mm</td>
                  <td className="px-3 py-2">bis 50 g</td>
                  <td className="px-3 py-2">rechteckig (verbindlich)</td>
                </tr>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">Groß</td>
                  <td className="px-3 py-2">140 – 353 mm</td>
                  <td className="px-3 py-2">90 – 250 mm</td>
                  <td className="px-3 py-2">bis 30 mm</td>
                  <td className="px-3 py-2">bis 1.000 g</td>
                  <td className="px-3 py-2">rechteckig (quadratisch möglich**)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#666666] mt-3">
            * Bei DIALOGPOST im Basisformat Standard (inkl. der DIALOGPOST Karte) muss die Länge mindestens das 1,4-fache der Breite betragen. DIALOGPOST Sendungen sind auch mit einer Länge von 148 mm (A6-Format) zulässig. Dies trifft nicht für kreative Sonderformate zu.<br />
            ** Quadratische Sendungen sind möglich, wenn die Seitenmaße mindestens 140 mm betragen.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-2">Basisentgelte DIALOGPOST National</h3>
          <div className="overflow-x-auto border rounded border-[#e5e7eb]">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2 text-right">Preis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">Karte</td>
                  <td className="px-3 py-2 text-right">0,36 € / Sendung</td>
                </tr>
                
              </tbody>
            </table>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="px-3 py-2">Standard***</th>
                  <th className="px-3 py-2 text-right">Preis</th>
                </tr>
              </thead>
              <tbody>
               
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2"> 0 g bis 20 g</td>
                  <td className="px-3 py-2 text-right">0,38 € / Sendung</td>
                </tr>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">21 g bis 50 g</td>
                  <td className="px-3 py-2 text-right">0,42 € / Sendung</td>
                </tr>
              </tbody>
            </table>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="px-3 py-2">Groß***</th>
                  <th className="px-3 py-2 text-right">Preis</th>
                </tr>
              </thead>
              <tbody>
               
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2"> 0 g bis 50 g</td>
                  <td className="px-3 py-2 text-right">0,54 € / Sendung</td>
                </tr>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">51 g bis 100 g</td>
                  <td className="px-3 py-2 text-right">0,67 € / Sendung</td>
                </tr>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">101 g bis 250 g</td>
                  <td className="px-3 py-2 text-right">0,82 € / Sendung</td>
                </tr>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">251 g bis 500 g</td>
                  <td className="px-3 py-2 text-right">0,94 € / Sendung</td>
                </tr>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">501 g bis 1.000 g</td>
                  <td className="px-3 py-2 text-right">1,11 € / Sendung</td>
                </tr>
              </tbody>
            </table>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="px-3 py-2">Zuschläge</th>
                  <th className="px-3 py-2 text-right">Preis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">Produktionszuschlag</td>
                  <td className="px-3 py-2 text-right">+ 0,05 € / Sendung</td>
                </tr>
                 <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">EASY (Kleinmengen ab 500 bis 4.999 Sendungen)</td>
                  <td className="px-3 py-2 text-right">+ 0,18 € / Sendung</td>
                </tr>
                <tr className="border-t border-[#e5e7eb]">
                  <td className="px-3 py-2">Zuschlag in Starkverkehrsmonaten September - Dezember über alle Formate (Karte, Standard, Groß)</td>
                  <td className="px-3 py-2 text-right">+ 0,01 € / Sendung</td>
                </tr>
              </tbody>
            </table>
          </div>
         
        </div>

        <div>
          <p className="text-xs text-[#666666] mt-3">
            * Alle Entgelte verstehen sich zuzüglich der gesetzlichen Umsatzsteuer.<br />
            ** Der Preis der DIALOGPOST Karte richtet sich nach der jeweils gewählten Kartengröße und dem jeweils zulässigen Papierflächengewicht. Das max. Papierflächengewicht von 500 g/m² ist zwingend einzuhalten.<br />
            *** Bruchteile beim Gewicht sind auf ganze Gramm aufzurunden.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "portooptimierung",
    label: "Portooptimierung",
    titel: "Was bedeutet Portooptimierung?",
    intro:
      "Um das günstigste Porto und einen Rabatt auf Portokosten zu erhalten, ist neben gewissen Mindestmengen eine Vorsortierung und Gruppierung der Sendungen auf Leitzonen, Leitregionen und Leitbereiche der Post erforderlich. Wir sortieren, gruppieren und analysieren Ihren Adressbestand und ermitteln für Sie die maximale Portoersparnis.",
    content: (
      <div className="space-y-6 text-sm text-[#333333] leading-7">
        <p>
          Wir sind zertifizierter Partner der Deutschen Post und nutzen alle von der Deutschen Post gegebenen Möglichkeiten zur Reduzierung Ihrer Versandkosten.
        </p>

        <div>
          <h3 className="font-semibold text-base mb-2">Die Portooptimierung erfolgt in 3 Schritten</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-[#333333]">
            <li>
              Die Empfängeradressen werden in einem EDV-gestützten Verfahren qualifiziert und aufbereitet. Dabei wird u. a. geprüft, ob die vorliegenden Adressen postkonform sind, fehlerhafte Adressen werden eliminiert oder korrigiert.
              Sie sparen dabei doppelt: zum einen durch den gewährten Rabatt, zum anderen sparen Sie sich das Porto für unzustellbare Sendungen. Danach werden die Adressen in die richtige Reihenfolge gebracht, um die weitere Verarbeitung im Lettershop zu gewährleisten.
            </li>
            <li>
              Neben der Sortierung ist auch die korrekte Markierung auf dem Produkt oder im Adressfeld notwendig. Dies wird schon bei der Produktion und später in der Konfektionierung genau berücksichtigt.
            </li>
            <li>
              In der anschließenden Portooptimierung werden die Briefe physisch zu sog. Gebinden zusammengefasst, also die korrekte Bündelung und die Ablage in Behältern oder auf Paletten.
            </li>
          </ol>
        </div>

        <p>
          Hintergrund all dieser Optimierungen ist die vollautomatische Verarbeitung der Briefsendungen durch die Deutsche Post.
          Je besser die Briefe hinsichtlich der Automationsfähigkeit sind, umso höher sind die gewährten Rabatte.
          Weil die Post damit auch die Briefe deutlich effizienter transportieren und zustellen kann.
        </p>
      </div>
    ),
  },
  {
    id: "porto",
    label: "Porto",
    titel: "Porto",
    intro:
      "Das Porto sind die Versandkosten, die zusätzlich zu den Druckkosten anfallen. Da die tatsächlichen Kosten von den finalen Adressdaten abhängen, zeigt der Konfigurator zunächst einen Maximalwert.",
    punkte: [
      "Der im Konfigurator angezeigte Portobetrag entspricht den maximalen Portokosten ohne Portooptimierung.",
      "Nach Auftragsvergabe optimieren wir den Versand anhand Ihrer gelieferten Adressdaten (z. B. Sortierung, Postleitzahlgruppen), wodurch sich die tatsächlichen Kosten meist reduzieren.",
      "Innerhalb von 48 Stunden nach Auftragsvergabe erhalten Sie eine konkrete Portoabrechnung.",
      "Das Porto wird separat von den Druck- und Verarbeitungskosten ausgewiesen und abgerechnet.",
    ],
  },
];

function tabFromHash(): string | null {
  const hash = window.location.hash.replace("#", "");
  return TABS.some((t) => t.id === hash) ? hash : null;
}

export default function Hilfe() {
  const [activeId, setActiveId] = useState<string>(TABS[0].id);
  const active = TABS.find((t) => t.id === activeId) ?? TABS[0];

  useEffect(() => {
    const applyHash = () => {
      const tab = tabFromHash();
      if (tab) setActiveId(tab);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold text-[#2b2b2b] uppercase tracking-wide mb-4 border-l-4 border-[#822660] pl-4">
        Hilfe zum Konfigurator
      </h1>
      <p className="text-sm text-[#666666] mb-8 max-w-2xl">
        Bei der Konfiguration Ihres Mailings durchlaufen Sie mehrere Schritte. Hier erklären wir, was hinter jedem
        Schritt steckt und worauf Sie achten sollten.
      </p>

      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Hilfe-Themen">
        {TABS.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveId(tab.id);
                window.history.replaceState(null, "", `#${tab.id}`);
              }}
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#822660] text-white"
                  : "bg-white border border-[#dcdcdc] text-[#2b2b2b] hover:border-[#822660]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="bg-white border border-[#dcdcdc] p-8">
        <h2 className="text-lg font-bold text-[#2b2b2b] mb-4">{active.titel}</h2>
        <p className="text-sm text-[#333333] leading-7 mb-6">{active.intro}</p>
        {active.content ? (
          <div>{active.content}</div>
        ) : (
          <ul className="space-y-3">
            {active.punkte?.map((punkt) => (
              <li key={punkt} className="flex gap-3 text-sm text-[#333333] leading-6">
                <span className="text-[#822660] font-bold shrink-0">›</span>
                <span>{punkt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
