"use client";

import { useEffect, useState } from "react";

interface HilfeTab {
  id: string;
  label: string;
  titel: string;
  intro: string;
  punkte: string[];
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
        <ul className="space-y-3">
          {active.punkte.map((punkt) => (
            <li key={punkt} className="flex gap-3 text-sm text-[#333333] leading-6">
              <span className="text-[#822660] font-bold shrink-0">›</span>
              <span>{punkt}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
