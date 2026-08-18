import { berechnePorto, type Versandklasse } from "./porto";
import {
  berechneGesamtGewicht,
  ermittleVersandklasse,
  type MailingKomponenten,
} from "./gewicht";
import type { MailingSlug } from "./mailing";
import type { StaffelPreis } from "@/types/staffelPreis";
import type { DeltaKurve } from "@/types/types";
import { AUSSTATTUNG_CONFIG } from "@/data/ausstatung_config";
import {
  AUFLAGE_STAFFEL,
  DETAIL_STAFFEL_PUNKTE,
  EXPRESS_PROZENT_STAFFEL,
  tranchePunkte,
} from "@/data/constants";
import DELTA_KURVEN from "@/data/delta_kurven";
import type { PreisDetails } from "@/types/preisDetails";

const SLUG_TO_FORMAT_TYPE: Record<MailingSlug, "DIN_LANG" | "DIN_C4"> = {
  lang_mailing: "DIN_LANG",
  c4_mailing: "DIN_C4",
};
/**
 * Preisberechnung für Kuvertiertes Mailing (DIN-Lang-Mailing).
 *
 * Die Staffelwerte für 1-5.000 Stück stammen aus echten Preisübersicht-Abfragen
 * im jopke.de-Konfigurator (500 und 1.000 Stück, daraus Fixpreis + Preis pro
 * 1.000 Stück abgeleitet). Die Staffeln ab 5.001 Stück stammen direkt aus dem
 * Excel-Stammdatensatz. Für DIN-C4-Mailing liegen weiterhin keine verifizierten
 * Konfiguratorwerte vor; in diesem Fall gibt berechnePreis() `null` zurück.
 */










/** Schlüssel: `${Hüllentyp}|${Ausstattung}` (siehe kategorien[2]/[3] in produktkatalog.ts). */



/**
 * Porto (max., ohne Optimierung) in €/Stück, je Auflagenstaffel. Für Kombinationen
 * ohne Broschüre bei allen drei Hüllentypen identisch verifiziert (0,56 €/Stück bis
 * 3.000 Stück, 0,38 €/Stück ab 5.000 Stück — Fensterhülle+Anschreiben durchgehend
 * verifiziert). Broschüre-Kombinationen wiegen mehr → höhere Versandklasse (0,60
 * bzw. 0,42 €/Stück, für Hülle-ohne-Fenster+Broschüre durchgehend verifiziert; für
 * Fensterhülle/Panorama+Broschüre nur bei 1.000 Stück verifiziert, restliche Staffeln
 * anhand der identischen Hülle-ohne-Fenster-Kurve angenommen).
 *
const PORTO_RATE_STAFFEL: Record<number, number> = {
  500: 0.56, 1000: 0.56, 2000: 0.56, 3000: 0.56,
  5000: 0.38, 10000: 0.38, 20000: 0.38, 50000: 0.38, 100000: 0.38,
};
const PORTO_RATE_BROSCHUERE_STAFFEL: Record<number, number> = {
  500: 0.60, 1000: 0.60, 2000: 0.60, 3000: 0.60,
  5000: 0.42, 10000: 0.42, 20000: 0.42,
};
/**   */



function getStaffelpreis(staffeln: StaffelPreis[], auflage: number): StaffelPreis | null {
  return staffeln.find((staffel) => auflage <= staffel.maxAuflage) ?? null;
}

/**
 * Hilfsfunktion zum Extrahieren der Zahl aus einem Grammatur-Text.
 * Beispiel: "80 g/m²" -> 80
 */
function parseGrammatur(val: string | null | undefined, fallback: number): number {
  if (!val) return fallback;
  const match = val.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : fallback;
}
function berechneDruckPreis(staffel: StaffelPreis, auflage: number): number {
  return runden(staffel.fixpreis + (auflage / 1000) * staffel.preisPro1000);
}


/**
 * Hilfsfunktion zum Extrahieren der Seitenzahl aus einem Umfang-Text.
 * Beispiel: "12 Seiten" -> 12
 */
function parseSeiten(val: string | null | undefined, fallback: number): number {
  if (!val) return fallback;
  const match = val.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : fallback;
}

function berechneDetailDelta(kurve: DeltaKurve | undefined, auflage: number): number {
  if (!kurve) return 0;

  if (auflage <= 5000 && kurve[500] !== undefined && kurve[1000] !== undefined) {
    const preisPro1000 = 2 * (kurve[1000] - kurve[500]);
    const fixpreis = 2 * kurve[500] - kurve[1000];
    return runden(fixpreis + (auflage / 1000) * preisPro1000);
  }

 

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

/** Stufenfunktion: verwendet den Wert der nächstgelegenen (nicht größeren) Staffel. */
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




/**
 * Berechnet die Preisübersicht für eine Konfiguration des kuvertierten Mailings.
 * Gibt `null` zurück, wenn keine verifizierten Preisdaten von jopke.de vorliegen
 * (derzeit nur für DIN-Lang-Mailings mit allen drei Hüllentypen abgedeckt).
 */
export function berechnePreis(params: {
  slug: MailingSlug;
  huellentyp: string | null;
  ausstattung: string | null;
  auflage: number | null;
  fensterhuelleFarbigkeit?: string | null;
  anschreibenGrammatur?: string | null;
  anschreibenFarbigkeit?: string | null;
  flyerUmfang?: string | null;
  flyerGrammatur?: string | null;
  broschuereUmfang?: string | null;
  antwortkarteEndformat?: string | null;
  antwortkarteGrammatur?: string | null;
}): PreisDetails | null {
  const {
    slug,
    huellentyp,
    ausstattung,
    auflage,
    fensterhuelleFarbigkeit,
    anschreibenGrammatur,
    anschreibenFarbigkeit,
    flyerUmfang,
    flyerGrammatur,
    broschuereUmfang,
    antwortkarteEndformat,
    antwortkarteGrammatur,
  } = params;

  if (slug !== "lang_mailing" || !huellentyp || !ausstattung || !auflage) return null;
  const config = AUSSTATTUNG_CONFIG[`${huellentyp}|${ausstattung}`];
  if (!config) return null;
  const staffel = getStaffelpreis(config.staffeln, auflage);
  if (!staffel) return null;

  // -------------------------------------------------------------
  // 1. BERECHNUNG DES DRUCKPREISES (BASIS + DELTAS)
  // -------------------------------------------------------------
  const huellenDelta = berechneDetailDelta(
    DELTA_KURVEN.HUELLEN_FARBIGKEIT_DELTA_KURVEN[huellentyp]?.[fensterhuelleFarbigkeit ?? ""],
    auflage
  );
  const anschreibenVariante =
    anschreibenGrammatur && anschreibenFarbigkeit
      ? `${anschreibenGrammatur}|${anschreibenFarbigkeit}`
      : null;
  const anschreibenVarianteDelta = berechneDetailDelta(
    anschreibenVariante ? DELTA_KURVEN.ANSCHREIBEN_VARIANTEN_DELTA_KURVEN[anschreibenVariante] : undefined,
    auflage
  );

  const antwortkarteEndformatDelta = berechneDetailDelta(
    antwortkarteEndformat ? DELTA_KURVEN.ANTWORTKARTE_ENDFORMAT_DELTA_KURVEN[antwortkarteEndformat] : undefined,
    auflage
  );

  const druck = runden(
    berechneDruckPreis(staffel, auflage) +
      huellenDelta +
      anschreibenVarianteDelta +
      antwortkarteEndformatDelta
  );

  // -------------------------------------------------------------
  // 2. GEWICHTSBERECHNUNG & ERMITTLUNG DER VERSANDKLASSE
  // -------------------------------------------------------------
  const komponenten: MailingKomponenten = {};

  // A) Hülle (Format DIN Lang: 229 x 114 mm, 75 g/m² oder 100 g/m² für Panorama)
  const huellenGrammaturNum = huellentyp === "Panorama-Fensterhülle" ? 100 : 75;
  komponenten.huelle = {
    seiten: 2,
    breiteMm: 114,
    laengeMm: 229,
    grammatur: huellenGrammaturNum,
  };

  // B) Anschreiben (DIN A4: 210 x 297 mm, 2 Seiten)
  if (ausstattung.includes("Anschreiben")) {
    komponenten.anschreiben = {
      seiten: 2,
      breiteMm: 210,
      laengeMm: 297,
      grammatur: parseGrammatur(anschreibenGrammatur, 80),
    };
  }

  // C) Flyer (DIN Lang: 105 x 210 mm)
  if (ausstattung.includes("Flyer")) {
    komponenten.flyer = {
      seiten: parseSeiten(flyerUmfang, 2),
      breiteMm: 105,
      laengeMm: 210,
      grammatur: parseGrammatur(flyerGrammatur, 135),
    };
  }

  // D) Broschüre (Inhalt 90 g/m² + Umschlag 170 g/m²)
  if (config.hatBroschuere || ausstattung.includes("Broschüre")) {
    const gesamtSeiten = parseSeiten(broschuereUmfang, 16);
    // Annahme: 4 Umschlagseiten, der Rest ist Inhalt
    const inhaltSeiten = Math.max(0, gesamtSeiten - 4);

    komponenten.broschuereInhalt = {
      seiten: inhaltSeiten,
      breiteMm: 105,
      laengeMm: 210,
      grammatur: 90,
    };
    komponenten.broschuereUmschlag = {
      seiten: 4,
      breiteMm: 105,
      laengeMm: 210,
      grammatur: 170,
    };
  }

  // E) Antwortkarte (DIN Lang: ~210 x 105 mm)
  if (ausstattung.includes("Antwortkarte")) {
    komponenten.antwortkarte = {
      seiten: 2,
      breiteMm: 105,
      laengeMm: 210,
      grammatur: parseGrammatur(antwortkarteGrammatur, 170),
    };
  }

  // Gesamtgewicht berechnen
  const gesamtGewichtG = berechneGesamtGewicht(komponenten);
  const gesamtGewichtKg = runden((gesamtGewichtG * auflage) / 1000);

  // Automatische Ermittlung der Versandklasse (B oder C für DIN Lang, D bis H für C4)
  const formatTyp = SLUG_TO_FORMAT_TYPE[slug];
  const versandklasse: Versandklasse = ermittleVersandklasse(gesamtGewichtG, formatTyp);

  // -------------------------------------------------------------
  // 3. BERECHNUNG VON PORTO UND GESAMTSUMME
  // -------------------------------------------------------------
  const porto = berechnePorto(auflage, versandklasse);

  const expressProzent = staffel.expressProzent ?? stufenwert(EXPRESS_PROZENT_STAFFEL, auflage);
  const expressAufpreis = runden(druck * expressProzent);

  const gesamtNettoStandard = runden(druck + porto);
  const gesamtNettoExpress = runden(gesamtNettoStandard + expressAufpreis);
  const mwstStandard = runden(gesamtNettoStandard * 0.19);
  const gesamtBruttoStandard = runden(gesamtNettoStandard + mwstStandard);

  return {
    druck,
    porto,
    expressAufpreis,
    gesamtNettoStandard,
    gesamtNettoExpress,
    mwstStandard,
    gesamtBruttoStandard,
    gewichtProSendungG: gesamtGewichtG,
    gesamtGewichtKg,
  };
}
export function formatEuro(wert: number): string {
  return `${wert.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}
