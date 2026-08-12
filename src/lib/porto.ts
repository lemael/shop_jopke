// lib/porto.ts

export type Versandklasse = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export interface PortoRegel {
  description: string;
  maxFormat: {
    laengeMm: number;
    breiteMm: number;
    hoeheMm: number;
  };
  gewicht: {
    minG: number;
    maxG: number;
  };
  tarifBase: number;
  seuilAufzahlung: number;
}

export const PORTO_REGELN: Record<Versandklasse, PortoRegel> = {
  A: {
    description: "Karte Standard (1)",
    maxFormat: { laengeMm: 235, breiteMm: 125, hoeheMm: 0.5 },
    gewicht: { minG: 0, maxG: 20 },
    tarifBase: 0.36,
    seuilAufzahlung: 3334,
  },
  B: {
    description: "Standard (2)",
    maxFormat: { laengeMm: 235, breiteMm: 125, hoeheMm: 5 },
    gewicht: { minG: 0, maxG: 20 },
    tarifBase: 0.38,
    seuilAufzahlung: 3393,
  },
  C: {
    description: "Standard (3)",
    maxFormat: { laengeMm: 235, breiteMm: 125, hoeheMm: 5 },
    gewicht: { minG: 21, maxG: 50 },
    tarifBase: 0.42,
    seuilAufzahlung: 3500,
  },
  D: {
    description: "Groß (1)",
    maxFormat: { laengeMm: 353, breiteMm: 250, hoeheMm: 30 },
    gewicht: { minG: 0, maxG: 50 },
    tarifBase: 0.54,
    seuilAufzahlung: 3750,
  },
  E: {
    description: "Groß (2)",
    maxFormat: { laengeMm: 353, breiteMm: 250, hoeheMm: 30 },
    gewicht: { minG: 51, maxG: 100 },
    tarifBase: 0.67,
    seuilAufzahlung: 3942,
  },
  F: {
    description: "Groß (3)",
    maxFormat: { laengeMm: 353, breiteMm: 250, hoeheMm: 30 },
    gewicht: { minG: 101, maxG: 250 },
    tarifBase: 0.82,
    seuilAufzahlung: 4100,
  },
  G: {
    description: "Groß (4)",
    maxFormat: { laengeMm: 353, breiteMm: 250, hoeheMm: 30 },
    gewicht: { minG: 251, maxG: 500 },
    tarifBase: 0.94,
    seuilAufzahlung: 4197,
  },
  H: {
    description: "Groß (5)",
    maxFormat: { laengeMm: 353, breiteMm: 250, hoeheMm: 30 },
    gewicht: { minG: 501, maxG: 1000 },
    tarifBase: 1.11,
    seuilAufzahlung: 4303,
  },
};

function runden(wert: number): number {
  return Math.round(wert * 100) / 100;
}

export function berechnePorto(auflage: number, versandklasse: Versandklasse): number {
  const regel = PORTO_REGELN[versandklasse];
  if (!regel) return 0;

  // 1. À partir de 5 000 ex : tarif Dialogpost standard
  if (auflage >= 5000) {
    return runden(auflage * regel.tarifBase);
  }

  // 2. Zone d'Aufzahlung (entre le seuil et 4 999 ex) : payer pour 5 000 ex.
  if (auflage >= regel.seuilAufzahlung) {
    return runden(5000 * regel.tarifBase);
  }

  // 3. Dialogpost Easy : tarif de base + 0,18 € par envoi (pour auflage < seuil)
  return runden(auflage * (regel.tarifBase + 0.18));
}