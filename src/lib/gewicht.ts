// lib/gewicht.ts

import { Versandklasse } from "./porto";

export interface PapierElement {
  seiten: number;      // Nombre de pages (ex: 2, 4, 12)
  breiteMm: number;    // Largeur en mm
  laengeMm: number;    // Longueur en mm
  grammatur: number;   // Grammage en g/m² (ex: 80, 90, 170)
}

/**
 * Calcule le poids en grammes d'un composant papier.
 */
export function berechneElementGewicht(element: PapierElement): number {
  if (!element.seiten || !element.breiteMm || !element.laengeMm || !element.grammatur) {
    return 0;
  }
  const flaecheM2 = (element.breiteMm * element.laengeMm) / 1_000_000;
  const anzahlBlaetter = element.seiten / 2;
  return flaecheM2 * element.grammatur * anzahlBlaetter;
}

export interface MailingKomponenten {
  huelle?: PapierElement;
  anschreiben?: PapierElement;
  flyer?: PapierElement;
  broschuereInhalt?: PapierElement;
  broschuereUmschlag?: PapierElement;
  antwortkarte?: PapierElement;
}

/**
 * Calcule le poids total d'un mailing complet en grammes.
 */
export function berechneGesamtGewicht(komponenten: MailingKomponenten): number {
  let gesamtGewicht = 0;

  if (komponenten.huelle) gesamtGewicht += berechneElementGewicht(komponenten.huelle);
  if (komponenten.anschreiben) gesamtGewicht += berechneElementGewicht(komponenten.anschreiben);
  if (komponenten.flyer) gesamtGewicht += berechneElementGewicht(komponenten.flyer);
  if (komponenten.broschuereInhalt) gesamtGewicht += berechneElementGewicht(komponenten.broschuereInhalt);
  if (komponenten.broschuereUmschlag) gesamtGewicht += berechneElementGewicht(komponenten.broschuereUmschlag);
  if (komponenten.antwortkarte) gesamtGewicht += berechneElementGewicht(komponenten.antwortkarte);

  return Math.round(gesamtGewicht * 10) / 10; // Arrondi à 1 décimale comme dans Excel
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