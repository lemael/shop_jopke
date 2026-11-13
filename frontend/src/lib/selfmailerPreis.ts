import { PRODUKTKATALOG, type Produkt } from "@/data/produktkatalog";
import type { Config} from "@/types/selfmailer/selfmailer";
import { SELFMAILER_PRICE_MATRIX, GRAMMATUR_FACTOR, PORTO_RATE } from "@/data/selfmailing";
import { PreisDetails } from "@/types/preisDetails";
import { AusstattungConfig } from "@/types/kuvertiertesMailing/ausstattungPreisTranche";
import { berechnePortoAusKonfiguration } from "@/lib/portoKonfiguration";
import { berechneDruckPreis } from "@/lib/druckPreis";
import type { PortoKonfiguration } from "@/types/porto";

export interface SelfmailerFamilie {
  slug: SelfmailerSlug;
}

export const FAMILIEN_KENNUNGEN = {
  levi: "LEVI",
  inata: "INATA",
  klappe_alba: "ALBA",
  mikro: "MIKRO",
  megalo: "MEGALO",
  andigo: "ANDIGO",
  afisa: "AFISA",
  alvaro: "ALVARO",
} as const;

export const FAMILIEN_KATEGORIEN = {
  bestseller_levi: "Unser Bestseller ! LEVI",
  levi: "DIN-Lang-Selfmailer LEVI",} as const;

export type FamilienKategorie = keyof typeof FAMILIEN_KATEGORIEN; 
export type SelfmailerSlug = keyof typeof FAMILIEN_KENNUNGEN;

function letzteKategorie(p: Produkt) {
  return p.kategorien[p.kategorien.length - 1];
}

/**
 * Gruppiert PRODUKTKATALOG nach Selfmailer-Produktlinie.
 * Die Namen in der Quelldatei enthalten teils Unicode-Leerzeichen (z.B. INATA) -
 * daher Abgleich per Kennung statt exaktem Namensvergleich.
 */
export interface SelfmailerFamilieResult {
  kennung: string | undefined;
  kategorie_2?: FamilienKategorie;
}

export function getSelfmailerFamilie(
  slug: SelfmailerSlug,
  kategorie_2?: FamilienKategorie
): SelfmailerFamilieResult {
  const kennung = FAMILIEN_KENNUNGEN[slug];

  return {
    kennung,
    kategorie_2,
  };
}

function runden(wert: number): number {
  return Math.round(wert * 100) / 100;
}
export function calcSelfmailerPrice(
  ausstattung: AusstattungConfig,
  cfg: Config,
  portoKonfiguration: PortoKonfiguration | null
): PreisDetails | null {
  // Sans les règles de Porto du backend, on n'affiche pas de prix.
  if (!portoKonfiguration) return null;

  // Druck et supplément Express selon la formule de jopke.de (voir druckPreis.ts).
  // La tranche est choisie par min/max (et non par sa position dans le tableau).
  const druckPreis = berechneDruckPreis(ausstattung, cfg.auflage);
  if (!druckPreis) return null;
  const { druck, expressAufpreis } = druckPreis;

  const gewichtProSendungG = ausstattung.gewicht_in_g ?? 0;
  // jopke.de affiche le poids total avec une décimale (ex. 4,56 kg -> 4,6 kg).
  const gesamtGewichtKg = Math.round((gewichtProSendungG * cfg.auflage) / 100) / 10;
  // Porto selon tarife.xlsx (via le backend), classe d'envoi minimale de l'article incluse.
  const porto = berechnePortoAusKonfiguration(
    portoKonfiguration,
    cfg.auflage,
    gewichtProSendungG,
    ausstattung.mindest_versandklasse
  );
  const gesamtNettoStandard = runden(druck + porto );
  const gesamtNettoExpress = runden(gesamtNettoStandard + expressAufpreis);
  const mwstStandard = runden(gesamtNettoStandard * 0.19);

  const gesamtBruttoStandard = runden(gesamtNettoStandard + mwstStandard);
  console.table({
    "Druck": druck,
    "Porto": porto,
    "MwSt Standard": mwstStandard,
    "Gesamt Netto Standard": gesamtNettoStandard,
    "Gesamt Netto Express": gesamtNettoExpress,
    "Gesamt Brutto Standard": gesamtBruttoStandard,
    "Gewicht pro Sendung (g)": gewichtProSendungG,
    "Gesamtgewicht (kg)": gesamtGewichtKg,
    "Express Aufpreis": expressAufpreis
  });
  return { druck, porto, mwstStandard, gesamtNettoStandard, gesamtNettoExpress, gesamtBruttoStandard, gewichtProSendungG, gesamtGewichtKg, expressAufpreis };
}