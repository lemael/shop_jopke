// lib/gewicht.ts

import { Versandklasse } from "./porto";
import type { ArtikelTarifDetails } from "@/types/artikelTarifDetails";
import type { AusstattungConfig, AusstattungPreisTranche } from "@/types/kuvertiertesMailing/ausstattungPreisTranche";
export interface PapierElement {
  seiten: number;      // Nombre de pages (ex: 2, 4, 12)
  breiteMm: number;    // Largeur du format ouvert en mm (ex: 210 mm)
  laengeMm: number;    // Longueur du format ouvert en mm (ex: 210 mm pour flyer 4p)
  grammatur: number;   // Grammage en g/m² (ex: 80, 90, 115)
}

/**
 * Calcule le poids en grammes d'un composant papier à partir de sa surface et de son grammage.
 */
export function berechneElementGewicht(element: PapierElement): number {
  if (!element.seiten || !element.breiteMm || !element.laengeMm || !element.grammatur) {
    return 0;
  }
  const flaecheM2 = (element.breiteMm * element.laengeMm) / 1_000_000;
  const anzahlBlaetter = element.seiten / 2;
  return flaecheM2 * element.grammatur * anzahlBlaetter;
}

export interface FlyerInfo {
  umfang?: string | null;     // ex: "4 Seiten", "6 Seiten"
  grammatur?: string | null;  // ex: "115 g/m²"
}

export interface MailingKomponenten {
  huelle?: PapierElement;
  huelleFestGewichtG?: number; // Permet de définir un poids fixe (ex: 4.5g pour C6/5)
  anschreiben?: PapierElement;
  flyers?: FlyerInfo[];        // Tableau multi-flyers
  flyer?: PapierElement;       // Rétrocompatibilité flyer unique
  broschuereInhalt?: PapierElement;
  broschuereUmschlag?: PapierElement;
  antwortkarte?: PapierElement;
}

/**
 * Calcule la largeur du format ouvert d'un flyer DIN lang selon son nombre de pages.
 * - 2 Seiten (105 x 210 mm)  -> 1 feuillet de 105 mm = 105 mm
 * - 4 Seiten (210 x 210 mm)  -> 2 volets de 105 mm  = 210 mm (105 * 2)
 * - 6 Seiten (300 x 210 mm)  -> 3 volets de 100 mm  = 300 mm (100 * 3)
 * - 8 Seiten (400 x 210 mm)  -> 4 volets de 100 mm  = 400 mm (100 * 4)
 * - 12 Seiten (600 x 210 mm) -> 6 volets de 100 mm  = 600 mm (100 * 6)
 */
function getFlyerOffeneBreite(seiten: number): number {
  if (seiten <= 2) return 105;
  if (seiten <= 4) return 210; // 2 * 105 mm
  if (seiten <= 6) return 300; // 3 * 100 mm
  if (seiten <= 8) return 400; // 4 * 100 mm
  return 600;                  // 12 Seiten (6 * 100 mm)
}

export function getAusstattungGewicht(
  configs: AusstattungConfig[] | undefined,
  huellentyp: string | null,
  ausstattung: string | null,
  tranche: AusstattungPreisTranche | undefined
): number {
  if (!configs || configs.length === 0 || !huellentyp || !ausstattung) return 0;

  const gefundeneConfig = configs.find((cfg) => {
    // 1. Kategorien vergleichen
    const matchKategorie =
      cfg.kategorie_3?.trim() === huellentyp.trim() &&
      cfg.kategorie_4?.trim() === ausstattung.trim();

    if (!matchKategorie) return false;

    // 2. Falls eine Tranche angegeben ist, diese abgleichen
    if (tranche && cfg.tranchen) {
      return cfg.tranchen.some(
        (t) =>
          t.min === tranche.min &&
          t.max === tranche.max &&
          t.fixpreis === tranche.fixpreis &&
          t.preisPro1000 === tranche.preisPro1000
      );
    }

    return true;
  });

  return gefundeneConfig?.gewicht_in_g ?? 0;
}

export function getTarifGewicht(
  allTarife: ArtikelTarifDetails[],
  kategorie: string,
  criteria: {
    grammatur?: string | null;
    umfang?: string | null;
    endformat?: string | null;
    farbigkeit?: string | null;
    produkt_gruppe?: string | null;
  }
): number {
  if (!allTarife || allTarife.length === 0) return 0;

  const match = allTarife.find((item) => {
    // 1. Kategorie-Match
    if (item.kategorie !== kategorie && item.produkt_gruppe !== kategorie) return false;

    // 2. Kriterien-Matching (prüft nur gesetzte Werte)
    if (criteria.grammatur && item.grammatur !== criteria.grammatur) return false;
    if (criteria.umfang && item.umfang !== criteria.umfang) return false;
    if (criteria.endformat && item.endformat !== criteria.endformat) return false;
    if (criteria.farbigkeit && item.farbigkeit !== criteria.farbigkeit) return false;
    if (criteria.produkt_gruppe && item.produkt_gruppe !== criteria.produkt_gruppe) return false;

    return true;
  });

  return match?.gewicht_in_g ?? 0;
}
/**
 * Calcule le poids total par envoi (en grammes) d'un mailing complet.
 */
export function berechneGesamtGewicht(komponenten: MailingKomponenten): number {
  let gesamtGewicht = 0;

  // 1. Enveloppe (poids fixe Excel de 4.5g ou calculé selon le papier)
  if (komponenten.huelleFestGewichtG !== undefined) {
    gesamtGewicht += komponenten.huelleFestGewichtG;
  } else if (komponenten.huelle) {
    gesamtGewicht += berechneElementGewicht(komponenten.huelle);
  }

  // 2. Lettre / Anschreiben
  if (komponenten.anschreiben) {
    gesamtGewicht += berechneElementGewicht(komponenten.anschreiben);
  }

  // 3. Multi-Flyers (flyerConfigs)
  if (komponenten.flyers && komponenten.flyers.length > 0) {
    for (const f of komponenten.flyers) {
      const seiten = parseInt(f.umfang ?? "", 10) || 2;
      const grammatur = parseInt(f.grammatur ?? "", 10) || 115;
      const breiteMm = getFlyerOffeneBreite(seiten);

      gesamtGewicht += berechneElementGewicht({
        seiten,
        breiteMm,
        laengeMm: 210,
        grammatur,
      });
    }
  } else if (komponenten.flyer) {
    // Rétrocompatibilité
    gesamtGewicht += berechneElementGewicht(komponenten.flyer);
  }

  // 4. Brochure & Carte réponse
  if (komponenten.broschuereInhalt) gesamtGewicht += berechneElementGewicht(komponenten.broschuereInhalt);
  if (komponenten.broschuereUmschlag) gesamtGewicht += berechneElementGewicht(komponenten.broschuereUmschlag);
  if (komponenten.antwortkarte) gesamtGewicht += berechneElementGewicht(komponenten.antwortkarte);

  return Math.round(gesamtGewicht * 10) / 10; // Arrondi à 1 décimale (ex: 20.4 g)
}

/**
 * Calcule à la fois le poids unitaire par envoi (g) et le poids total de la commande (kg).
 */
export function berechneMailingGewichtDetails(
  komponenten: MailingKomponenten,
  auflage: number
) {
  const gewichtProSendungG = berechneGesamtGewicht(komponenten);
  const gesamtGewichtKg = Math.round((gewichtProSendungG * auflage) / 100) / 10; // kg avec 1 décimale

  return {
    gewichtProSendungG,
    gesamtGewichtKg,
  };
}

/**
 * Détermine automatiquement la Versandklasse (A-H) en fonction du poids total et des dimensions.
 */
export function ermittleVersandklasse(
  gesamtGewichtG: number,
  formatTyp: "DIN_LANG" | "DIN_C4" = "DIN_LANG"
): Versandklasse {
  if (formatTyp === "DIN_LANG") {
    // Format Standard : <= 235 x 125 x 5 mm
    if (gesamtGewichtG <= 20) return "B"; // Standard (2) <= 20g
    return "C";                           // Standard (3) 21-50g
  }

  // Format Groß (DIN C4) : <= 353 x 250 x 30 mm
  if (gesamtGewichtG <= 50) return "D";   // Groß (1) <= 50g
  if (gesamtGewichtG <= 100) return "E";  // Groß (2) 51-100g
  if (gesamtGewichtG <= 250) return "F";  // Groß (3) 101-250g
  if (gesamtGewichtG <= 500) return "G";  // Groß (4) 251-500g
  return "H";                             // Groß (5) 501-1000g
}