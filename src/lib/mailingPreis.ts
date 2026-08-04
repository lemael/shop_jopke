/**
 * Preisberechnung für Kuvertiertes Mailing (DIN-Lang-Mailing).
 *
 * Alle Basiswerte stammen aus echten Preisübersicht-Abfragen im Konfigurator auf
 * jopke.de (günstigste Farbigkeit/Grammatur je Hüllentyp), abgerufen am 2026-07-30.
 * Für DIN-C4-Mailing liefert der Konfigurator auf jopke.de selbst keine
 * Preisübersicht (Serverfehler 500 bei jeder getesteten Kombination) — für diesen
 * Fall gibt berechnePreis() `null` zurück, die UI zeigt dann "Preis auf Anfrage"
 * statt erfundener Zahlen.
 */

const AUFLAGE_STAFFEL = [500, 1000, 2000, 3000, 5000, 10000, 20000, 50000, 100000];

type Basiskurve = Record<number, number>;

/**
 * Druckpreis-Basiskurven (netto, €) je Hüllentyp und Leit-Ausstattung, verifiziert
 * über alle Standard-Auflagenstaffeln (günstigste Farbigkeit/Grammatur, "bis zu 3
 * Flyer"-Kombinationen mit 1 Flyer getestet — Minimalpreis der Kombination, da der
 * Konfigurator keine Flyer-Anzahl abfragt). Broschüre-Kurven enden bei 20.000 Stück,
 * da Broschüre-Kombinationen auf jopke.de nur bis dahin bestellbar sind.
 */
const DRUCK_KURVEN: Record<string, Basiskurve> = {
  fensterhuelle_anschreiben: {
    500: 284.72, 1000: 352.29, 2000: 487.43, 3000: 622.57, 5000: 892.85,
    10000: 1512.62, 20000: 2709.85, 50000: 6353.65, 100000: 12021.84,
  },
  panorama_flyer: {
    500: 420.86, 1000: 541.96, 2000: 784.17, 3000: 1026.38, 5000: 1510.80,
    10000: 2586.82, 20000: 4655.73, 50000: 10980.33, 100000: 20704.44,
  },
  panorama_broschuere: {
    500: 602.10, 1000: 773.08, 2000: 1115.05, 3000: 1457.02, 5000: 2140.96,
    10000: 3541.54, 20000: 6841.17,
  },
  ohnefenster_flyer: {
    500: 263.36, 1000: 319.68, 2000: 432.33, 3000: 544.98, 5000: 770.28,
    10000: 1280.42, 20000: 2246.69, 50000: 5301.29, 100000: 9987.80,
  },
  ohnefenster_broschuere: {
    500: 470.37, 1000: 583.74, 2000: 810.49, 3000: 1037.24, 5000: 1490.74,
    10000: 2388.34, 20000: 4704.73,
  },
};

interface AusstattungConfig {
  basis: keyof typeof DRUCK_KURVEN;
  /** Faktor relativ zur Basiskurve, verifiziert bei 1.000 Stück (1 = ist die Basiskurve selbst). */
  faktor: number;
  hatBroschuere: boolean;
}

/** Schlüssel: `${Hüllentyp}|${Ausstattung}` (siehe kategorien[2]/[3] in produktkatalog.ts). */
const AUSSTATTUNG_CONFIG: Record<string, AusstattungConfig> = {
  "Fensterhülle|Anschreiben": { basis: "fensterhuelle_anschreiben", faktor: 1, hatBroschuere: false },
  "Fensterhülle|Anschreiben + Antwortkarte": { basis: "fensterhuelle_anschreiben", faktor: 397.23 / 352.29, hatBroschuere: false },
  "Fensterhülle|Anschreiben + bis zu 3 Flyer": { basis: "fensterhuelle_anschreiben", faktor: 416.55 / 352.29, hatBroschuere: false },
  "Fensterhülle|Anschreiben, bis zu 3 Flyer + Antwortkarte": { basis: "fensterhuelle_anschreiben", faktor: 461.49 / 352.29, hatBroschuere: false },
  "Fensterhülle|Anschreiben + Broschüre": { basis: "fensterhuelle_anschreiben", faktor: 663.13 / 352.29, hatBroschuere: true },
  "Fensterhülle|Anschreiben, Broschüre + Antwortkarte": { basis: "fensterhuelle_anschreiben", faktor: 709.19 / 352.29, hatBroschuere: true },

  "Panorama-Fensterhülle|Anschreiben + bis zu 3 Flyer": { basis: "panorama_flyer", faktor: 1, hatBroschuere: false },
  "Panorama-Fensterhülle|Anschreiben, bis zu 3 Flyer + Antwortkarte": { basis: "panorama_flyer", faktor: 592.48 / 541.96, hatBroschuere: false },
  "Panorama-Fensterhülle|Anschreiben + Broschüre": { basis: "panorama_broschuere", faktor: 1, hatBroschuere: true },
  "Panorama-Fensterhülle|Anschreiben, Broschüre + Antwortkarte": { basis: "panorama_broschuere", faktor: 823.60 / 773.08, hatBroschuere: true },

  "Hülle ohne Fenster|bis zu 3 Flyer": { basis: "ohnefenster_flyer", faktor: 1, hatBroschuere: false },
  "Hülle ohne Fenster|bis zu 3 Flyer + Antwortkarte": { basis: "ohnefenster_flyer", faktor: 364.62 / 319.68, hatBroschuere: false },
  "Hülle ohne Fenster|Broschüre": { basis: "ohnefenster_broschuere", faktor: 1, hatBroschuere: true },
  "Hülle ohne Fenster|Broschüre + Antwortkarte": { basis: "ohnefenster_broschuere", faktor: 629.79 / 583.74, hatBroschuere: true },
};

/**
 * Porto (max., ohne Optimierung) in €/Stück, je Auflagenstaffel. Für Kombinationen
 * ohne Broschüre bei allen drei Hüllentypen identisch verifiziert (0,56 €/Stück bis
 * 3.000 Stück, 0,38 €/Stück ab 5.000 Stück — Fensterhülle+Anschreiben durchgehend
 * verifiziert). Broschüre-Kombinationen wiegen mehr → höhere Versandklasse (0,60
 * bzw. 0,42 €/Stück, für Hülle-ohne-Fenster+Broschüre durchgehend verifiziert; für
 * Fensterhülle/Panorama+Broschüre nur bei 1.000 Stück verifiziert, restliche Staffeln
 * anhand der identischen Hülle-ohne-Fenster-Kurve angenommen).
 */
const PORTO_RATE_STAFFEL: Record<number, number> = {
  500: 0.56, 1000: 0.56, 2000: 0.56, 3000: 0.56,
  5000: 0.38, 10000: 0.38, 20000: 0.38, 50000: 0.38, 100000: 0.38,
};
const PORTO_RATE_BROSCHUERE_STAFFEL: Record<number, number> = {
  500: 0.60, 1000: 0.60, 2000: 0.60, 3000: 0.60,
  5000: 0.42, 10000: 0.42, 20000: 0.42,
};

/** Express-Aufpreis als Prozentsatz auf den Druckpreis, je Auflagenstaffel. Verifiziert (Fensterhülle+Anschreiben). */
const EXPRESS_PROZENT_STAFFEL: Record<number, number> = {
  500: 0.25, 1000: 0.25, 2000: 0.25, 3000: 0.25, 5000: 0.25,
  10000: 0.17, 20000: 0.15, 50000: 0.15, 100000: 0.14,
};

function interpoliere(tabelle: Basiskurve, auflage: number): number {
  const staffeln = Object.keys(tabelle).map(Number).sort((a, b) => a - b);
  if (auflage <= staffeln[0]) return tabelle[staffeln[0]];
  if (auflage >= staffeln[staffeln.length - 1]) return tabelle[staffeln[staffeln.length - 1]];
  for (let i = 0; i < staffeln.length - 1; i++) {
    const [a, b] = [staffeln[i], staffeln[i + 1]];
    if (auflage >= a && auflage <= b) {
      const anteil = (auflage - a) / (b - a);
      return tabelle[a] + anteil * (tabelle[b] - tabelle[a]);
    }
  }
  return tabelle[staffeln[staffeln.length - 1]];
}

/** Stufenfunktion: verwendet den Wert der naechstgelegenen (nicht groesseren) Staffel. */
function stufenwert(tabelle: Record<number, number>, auflage: number): number {
  let ergebnis = tabelle[AUFLAGE_STAFFEL[0]];
  for (const stufe of AUFLAGE_STAFFEL) {
    if (auflage >= stufe) ergebnis = tabelle[stufe];
  }
  return ergebnis;
}

function runden(wert: number): number {
  return Math.round(wert * 100) / 100;
}

export interface Preisdetails {
  druck: number;
  porto: number;
  expressAufpreis: number;
  gesamtNettoStandard: number;
  gesamtNettoExpress: number;
  mwstStandard: number;
  gesamtBruttoStandard: number;
}

/**
 * Berechnet die Preisübersicht für eine Kuvertiertes-Mailing-Konfiguration.
 * Gibt `null` zurück, wenn keine verifizierten jopke.de-Preisdaten vorliegen
 * (aktuell nur DIN-Lang-Mailing abgedeckt, für alle drei Hüllentypen).
 */
export function berechnePreis(params: {
  slug: string;
  huellentyp: string | null;
  ausstattung: string | null;
  auflage: number | null;
}): Preisdetails | null {
  const { slug, huellentyp, ausstattung, auflage } = params;
  if (slug !== "lang_mailing" || !huellentyp || !ausstattung || !auflage) return null;
  const config = AUSSTATTUNG_CONFIG[`${huellentyp}|${ausstattung}`];
  if (!config) return null;

  const druck = runden(interpoliere(DRUCK_KURVEN[config.basis], auflage) * config.faktor);
  const portoRate = stufenwert(config.hatBroschuere ? PORTO_RATE_BROSCHUERE_STAFFEL : PORTO_RATE_STAFFEL, auflage);
  const porto = runden(auflage * portoRate);
  const expressProzent = stufenwert(EXPRESS_PROZENT_STAFFEL, auflage);
  const expressAufpreis = runden(druck * expressProzent);

  const gesamtNettoStandard = runden(druck + porto);
  const gesamtNettoExpress = runden(gesamtNettoStandard + expressAufpreis);
  const mwstStandard = runden(gesamtNettoStandard * 0.19);
  const gesamtBruttoStandard = runden(gesamtNettoStandard + mwstStandard);

  return { druck, porto, expressAufpreis, gesamtNettoStandard, gesamtNettoExpress, mwstStandard, gesamtBruttoStandard };
}

export function formatEuro(wert: number): string {
  return `${wert.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}
