/**
 * Preisberechnung für Kuvertiertes Mailing (DIN-Lang-Mailing).
 *
 * Die Staffelwerte für 1-5.000 Stück stammen aus echten Preisübersicht-Abfragen
 * im jopke.de-Konfigurator (500 und 1.000 Stück, daraus Fixpreis + Preis pro
 * 1.000 Stück abgeleitet). Die Staffeln ab 5.001 Stück stammen direkt aus dem
 * Excel-Stammdatensatz. Für DIN-C4-Mailing liegen weiterhin keine verifizierten
 * Konfiguratorwerte vor; in diesem Fall gibt berechnePreis() `null` zurück.
 */

const AUFLAGE_STAFFEL = [500, 1000, 2000, 3000, 5000, 10000, 20000, 50000, 100000];

interface StaffelPreis {
  maxAuflage: number;
  fixpreis: number;
  preisPro1000: number;
  expressProzent?: number;
}

type DeltaKurve = Partial<Record<number, number>>;

interface AusstattungConfig {
  staffeln: StaffelPreis[];
  hatBroschuere: boolean;
}

const DETAIL_STAFFEL_PUNKTE = [500, 1000, 5000, 10000, 50000, 100000] as const;

/** Schlüssel: `${Hüllentyp}|${Ausstattung}` (siehe kategorien[2]/[3] in produktkatalog.ts). */
const AUSSTATTUNG_CONFIG: Record<string, AusstattungConfig> = {
  "Fensterhülle|Anschreiben": {
    hatBroschuere: false,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 216.19, preisPro1000: 136.26, expressProzent: 0.25 },
      { maxAuflage: 10000, fixpreis: 274.824, preisPro1000: 127.776, expressProzent: 0.17 },
      { maxAuflage: 50000, fixpreis: 259.209, preisPro1000: 120.516, expressProzent: 0.15 },
      { maxAuflage: 100000, fixpreis: 243.594, preisPro1000: 113.256, expressProzent: 0.135 },
    ],
  },
  "Fensterhülle|Anschreiben + Antwortkarte": {
    hatBroschuere: false,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 240.03, preisPro1000: 157.36, expressProzent: 0.29 },
      { maxAuflage: 10000, fixpreis: 274.824, preisPro1000: 135.696, expressProzent: 0.21 },
      { maxAuflage: 50000, fixpreis: 259.209, preisPro1000: 127.986, expressProzent: 0.19 },
      { maxAuflage: 100000, fixpreis: 243.594, preisPro1000: 120.276, expressProzent: 0.175 },
    ],
  },
  "Fensterhülle|Anschreiben + bis zu 3 Flyer": {
    hatBroschuere: false,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 248.19, preisPro1000: 168.52, expressProzent: 0.33 },
      { maxAuflage: 10000, fixpreis: 274.824, preisPro1000: 151.536, expressProzent: 0.25 },
      { maxAuflage: 50000, fixpreis: 259.209, preisPro1000: 142.926, expressProzent: 0.23 },
      { maxAuflage: 100000, fixpreis: 243.594, preisPro1000: 134.316 },
    ],
  },
  "Fensterhülle|Anschreiben, bis zu 3 Flyer + Antwortkarte": {
    hatBroschuere: false,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 272.03, preisPro1000: 189.62, expressProzent: 0.37 },
      { maxAuflage: 10000, fixpreis: 274.824, preisPro1000: 159.456, expressProzent: 0.29 },
      { maxAuflage: 50000, fixpreis: 259.209, preisPro1000: 150.396, expressProzent: 0.27 },
      { maxAuflage: 100000, fixpreis: 243.594, preisPro1000: 141.336 },
    ],
  },
  "Fensterhülle|Anschreiben + Broschüre": {
    hatBroschuere: true,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 379.55, preisPro1000: 283.74, expressProzent: 0.29 },
      { maxAuflage: 10000, fixpreis: 274.824, preisPro1000: 141.7944, expressProzent: 0.21 },
      { maxAuflage: 50000, fixpreis: 259.209, preisPro1000: 133.7379, expressProzent: 0.19 },
      { maxAuflage: 100000, fixpreis: 243.594, preisPro1000: 125.6814 },
    ],
  },
  "Fensterhülle|Anschreiben, Broschüre + Antwortkarte": {
    hatBroschuere: true,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 403.39, preisPro1000: 305.96, expressProzent: 0.33 },
      { maxAuflage: 10000, fixpreis: 274.824, preisPro1000: 151.2984, expressProzent: 0.25 },
      { maxAuflage: 50000, fixpreis: 259.209, preisPro1000: 142.7019, expressProzent: 0.23 },
      { maxAuflage: 100000, fixpreis: 243.594, preisPro1000: 134.1054 },
    ],
  },

  "Panorama-Fensterhülle|Anschreiben + bis zu 3 Flyer": {
    hatBroschuere: false,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 298.8, preisPro1000: 243.32, expressProzent: 0.33 },
      { maxAuflage: 10000, fixpreis: 301.224, preisPro1000: 198.8976, expressProzent: 0.25 },
      { maxAuflage: 50000, fixpreis: 284.109, preisPro1000: 187.5966, expressProzent: 0.23 },
      { maxAuflage: 100000, fixpreis: 266.994, preisPro1000: 176.2956 },
    ],
  },
  "Panorama-Fensterhülle|Anschreiben, bis zu 3 Flyer + Antwortkarte": {
    hatBroschuere: false,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 322.64, preisPro1000: 270, expressProzent: 0.37 },
      { maxAuflage: 10000, fixpreis: 301.224, preisPro1000: 214.7376, expressProzent: 0.29 },
      { maxAuflage: 50000, fixpreis: 284.109, preisPro1000: 202.5366, expressProzent: 0.27 },
      { maxAuflage: 100000, fixpreis: 266.994, preisPro1000: 190.3356 },
    ],
  },
  "Panorama-Fensterhülle|Anschreiben + Broschüre": {
    hatBroschuere: true,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 430.16, preisPro1000: 343.08, expressProzent: 0.29 },
      { maxAuflage: 10000, fixpreis: 301.224, preisPro1000: 167.2176, expressProzent: 0.21 },
      { maxAuflage: 50000, fixpreis: 284.109, preisPro1000: 157.7166, expressProzent: 0.19 },
      { maxAuflage: 100000, fixpreis: 266.994, preisPro1000: 148.2156 },
    ],
  },
  "Panorama-Fensterhülle|Anschreiben, Broschüre + Antwortkarte": {
    hatBroschuere: true,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 454, preisPro1000: 369.76, expressProzent: 0.33 },
      { maxAuflage: 10000, fixpreis: 301.224, preisPro1000: 183.0576, expressProzent: 0.25 },
      { maxAuflage: 50000, fixpreis: 284.109, preisPro1000: 172.6566, expressProzent: 0.23 },
      { maxAuflage: 100000, fixpreis: 266.994, preisPro1000: 162.2556 },
    ],
  },

  "Hülle ohne Fenster|bis zu 3 Flyer": {
    hatBroschuere: false,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 207.04, preisPro1000: 112.64, expressProzent: 0.33 },
      { maxAuflage: 10000, fixpreis: 248.424, preisPro1000: 106.9728, expressProzent: 0.25 },
      { maxAuflage: 50000, fixpreis: 234.309, preisPro1000: 100.8948, expressProzent: 0.23 },
      { maxAuflage: 100000, fixpreis: 220.194, preisPro1000: 94.8168 },
    ],
  },
  "Hülle ohne Fenster|bis zu 3 Flyer + Antwortkarte": {
    hatBroschuere: false,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 230.88, preisPro1000: 133.74, expressProzent: 0.37 },
      { maxAuflage: 10000, fixpreis: 248.424, preisPro1000: 114.8928, expressProzent: 0.29 },
      { maxAuflage: 50000, fixpreis: 234.309, preisPro1000: 108.3648, expressProzent: 0.27 },
      { maxAuflage: 100000, fixpreis: 220.194, preisPro1000: 101.8368 },
    ],
  },
  "Hülle ohne Fenster|Broschüre": {
    hatBroschuere: true,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 357, preisPro1000: 226.74, expressProzent: 0.29 },
      { maxAuflage: 10000, fixpreis: 274.824, preisPro1000: 95.6472, expressProzent: 0.21 },
      { maxAuflage: 50000, fixpreis: 259.209, preisPro1000: 90.2127, expressProzent: 0.19 },
      { maxAuflage: 100000, fixpreis: 243.594, preisPro1000: 84.7782 },
    ],
  },
  "Hülle ohne Fenster|Broschüre + Antwortkarte": {
    hatBroschuere: true,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 380.83, preisPro1000: 248.96, expressProzent: 0.33 },
      { maxAuflage: 10000, fixpreis: 274.824, preisPro1000: 105.1512, expressProzent: 0.25 },
      { maxAuflage: 50000, fixpreis: 259.209, preisPro1000: 99.1767, expressProzent: 0.23 },
      { maxAuflage: 100000, fixpreis: 243.594, preisPro1000: 93.2022 },
    ],
  },
};

/**
 * Deltas aus dem Live-Konfigurator für gemeinsame Detailoptionen der Hülle bzw.
 * des Anschreibens. Referenzkonfigurationen mit Delta 0 sind:
 * - Fensterhülle / Hülle ohne Fenster / Panorama: "unbedruckt"
 * - Anschreiben-Grammatur: "80 g/m²"
 * - Anschreiben-Farbigkeit: "4/0-farbig Euroskala"
 *
 * Diese Deltas werden zur jeweiligen Basis-Ausstattung addiert. Detailoptionen
 * von Flyer/Broschüre/Antwortkarte bleiben vorerst auf der verifizierten
 * Referenzvariante der jeweiligen Ausstattung.
 */
const HUELLEN_FARBIGKEIT_DELTA_KURVEN: Partial<Record<string, Record<string, DeltaKurve>>> = {
  "Fensterhülle": {
    "1/0-farbig Schwarz": { 500: 75.36, 1000: 88.32, 5000: 192, 10000: 232.48, 50000: 664.16, 100000: 1111.04 },
    "1/1-farbig Schwarz": { 500: 84, 1000: 99.36, 5000: 222.24, 10000: 278.4, 50000: 845.28, 100000: 1449.28 },
    "4/0-farbig Euroskala": { 500: 79.6, 1000: 98.56, 5000: 250.24, 10000: 358.72, 50000: 1240.8, 100000: 1895.84 },
    "4/4-farbig Euroskala": { 500: 79.6, 1000: 98.56, 5000: 250.24, 10000: 358.72, 50000: 1360, 100000: 2688 },
  },
  "Panorama-Fensterhülle": {
    "1/0-farbig Schwarz": { 500: 172, 1000: 184, 5000: 280, 10000: 224, 50000: 640, 100000: 304 },
    "4/0-farbig Euroskala": { 500: 308, 1000: 328, 5000: 488, 10000: 472, 50000: 1112, 100000: 944 },
  },
  "Hülle ohne Fenster": {
    "1/0-farbig Schwarz": { 500: 75.76, 1000: 89.12, 5000: 196, 10000: 240.48, 50000: 704.16, 100000: 1191.04 },
    "1/1-farbig Schwarz": { 500: 94.72, 1000: 109.44, 5000: 227.2, 10000: 302.4, 50000: 936, 100000: 1624 },
    "4/0-farbig Euroskala": { 500: 80, 1000: 99.36, 5000: 254.24, 10000: 366.72, 50000: 1280.8, 100000: 1975.84 },
    "4/4-farbig Euroskala": { 500: 88.72, 1000: 105.44, 5000: 239.2, 10000: 374.4, 50000: 1456, 100000: 2832 },
  },
};

const ANSCHREIBEN_VARIANTEN_DELTA_KURVEN: Record<string, DeltaKurve> = {
  "80 g/m²|4/4-farbig Euroskala": { 500: 12.4, 1000: 15.52, 5000: 40.48, 10000: 50.4, 50000: 191.36, 100000: 370.24 },
  "80 g/m²|4/1-farbig Euroskala/Schwarz": { 500: 13.68, 1000: 16.64, 5000: 40.32, 10000: 88, 50000: 278.24, 100000: 465.92 },
  "80 g/m²|1/0-farbig Schwarz": { 500: 0.4, 1000: -0.16, 5000: -4.64, 10000: 13.92, 50000: -20.64, 100000: -32.16 },
  "80 g/m²|1/1-farbig Schwarz": { 500: 8.48, 1000: 12, 5000: 40.16, 10000: 86.72, 50000: 280.64, 100000: 484.8 },
  "90 g/m²|4/0-farbig Euroskala": { 500: 0.72, 1000: 0.96, 5000: 2.88, 10000: 4.96, 50000: 20.32, 100000: 45.76 },
  "90 g/m²|4/4-farbig Euroskala": { 500: 13.44, 1000: 16.8, 5000: 43.68, 10000: 56.16, 50000: 217.12, 100000: 420.8 },
  "90 g/m²|4/1-farbig Euroskala/Schwarz": { 500: 14.56, 1000: 17.76, 5000: 43.36, 10000: 94.88, 50000: 308.32, 100000: 517.92 },
  "90 g/m²|1/0-farbig Schwarz": { 500: 0.96, 1000: 0.64, 5000: -1.92, 10000: 19.2, 50000: 2.56, 100000: 7.2 },
  "90 g/m²|1/1-farbig Schwarz": { 500: 9.28, 1000: 13.12, 5000: 43.84, 10000: 93.12, 50000: 310.88, 100000: 537.12 },
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
function getStaffelpreis(staffeln: StaffelPreis[], auflage: number): StaffelPreis | null {
  return staffeln.find((staffel) => auflage <= staffel.maxAuflage) ?? null;
}

function berechneDruckPreis(staffel: StaffelPreis, auflage: number): number {
  return runden(staffel.fixpreis + (auflage / 1000) * staffel.preisPro1000);
}

function berechneDetailDelta(kurve: DeltaKurve | undefined, auflage: number): number {
  if (!kurve) return 0;

  if (auflage <= 5000 && kurve[500] !== undefined && kurve[1000] !== undefined) {
    const preisPro1000 = 2 * (kurve[1000] - kurve[500]);
    const fixpreis = 2 * kurve[500] - kurve[1000];
    return runden(fixpreis + (auflage / 1000) * preisPro1000);
  }

  const tranchePunkte: [number, number][] = [
    [5000, 10000],
    [10000, 50000],
    [50000, 100000],
  ];

  for (const [untereGrenze, obereGrenze] of tranchePunkte) {
    if (auflage <= obereGrenze && kurve[untereGrenze] !== undefined && kurve[obereGrenze] !== undefined) {
      const span = obereGrenze - untereGrenze;
      const faktor = (auflage - untereGrenze) / span;
      return runden(kurve[untereGrenze]! + (kurve[obereGrenze]! - kurve[untereGrenze]!) * faktor);
    }
  }

  const fallback = DETAIL_STAFFEL_PUNKTE.slice().reverse().find((punkt) => kurve[punkt] !== undefined);
  return fallback ? runden(kurve[fallback]!) : 0;
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
  fensterhuelleFarbigkeit?: string | null;
  anschreibenGrammatur?: string | null;
  anschreibenFarbigkeit?: string | null;
}): Preisdetails | null {
  const {
    slug,
    huellentyp,
    ausstattung,
    auflage,
    fensterhuelleFarbigkeit,
    anschreibenGrammatur,
    anschreibenFarbigkeit,
  } = params;
  if (slug !== "lang_mailing" || !huellentyp || !ausstattung || !auflage) return null;
  const config = AUSSTATTUNG_CONFIG[`${huellentyp}|${ausstattung}`];
  if (!config) return null;
  const staffel = getStaffelpreis(config.staffeln, auflage);
  if (!staffel) return null;

  const huellenDelta = berechneDetailDelta(HUELLEN_FARBIGKEIT_DELTA_KURVEN[huellentyp]?.[fensterhuelleFarbigkeit ?? ""], auflage);
  const anschreibenVariante = anschreibenGrammatur && anschreibenFarbigkeit
    ? `${anschreibenGrammatur}|${anschreibenFarbigkeit}`
    : null;
  const anschreibenVarianteDelta = berechneDetailDelta(
    anschreibenVariante ? ANSCHREIBEN_VARIANTEN_DELTA_KURVEN[anschreibenVariante] : undefined,
    auflage,
  );

  const druck = runden(
    berechneDruckPreis(staffel, auflage)
    + huellenDelta
    + anschreibenVarianteDelta
  );
  const portoRate = stufenwert(config.hatBroschuere ? PORTO_RATE_BROSCHUERE_STAFFEL : PORTO_RATE_STAFFEL, auflage);
  const porto = runden(auflage * portoRate);
  const expressProzent = staffel.expressProzent ?? stufenwert(EXPRESS_PROZENT_STAFFEL, auflage);
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
