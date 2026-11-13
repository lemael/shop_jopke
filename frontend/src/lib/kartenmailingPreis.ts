import { PRODUKTKATALOG, type Produkt } from "@/data/produktkatalog";
import { FAMILIEN_KENNUNGEN } from "@/types/kartenmailer/kartenmailer";
import type { Config } from "@/types/kartenmailer/kartenmailer";
import { PreisDetails } from "@/types/preisDetails";
import { AusstattungConfig } from "@/types/kuvertiertesMailing/ausstattungPreisTranche";
import { berechnePortoAusKonfiguration } from "@/lib/portoKonfiguration";
import { berechneDruckPreis } from "@/lib/druckPreis";
import type { PortoKonfiguration } from "@/types/porto";

export interface KartenmailingFamilie {
  slug: KartenmailingSlug;
}


export type KartenmailingSlug = keyof typeof FAMILIEN_KENNUNGEN;

/**
 * Gruppiert PRODUKTKATALOG nach Postkarten-Format.
 * Kategorien-Ebenen: [0] Kartenmailing, [1] Format (z.B. "Postkarte DIN-Lang (210x98)").
 * Konfigurationsdimensionen je Familie: Papier (inhalt.papier) x Veredelung.
 */
export function getKartenmailingFamilie(slug: KartenmailingSlug): string | null {
  const kennung = FAMILIEN_KENNUNGEN[slug];
  return kennung;
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
  // jopke.de affiche le poids total avec une décimale (ex. 4,45 kg -> 4,5 kg).
  const gesamtGewichtKg = Math.round((gewichtProSendungG * cfg.auflage) / 100) / 10;

  // Porto selon tarife.xlsx (via le backend), avec la classe d'envoi minimale de
  // l'article : A pour DIN-Lang / Maxi / A6, D pour A5 et A4.
  const porto = berechnePortoAusKonfiguration(
    portoKonfiguration,
    cfg.auflage,
    gewichtProSendungG,
    ausstattung.mindest_versandklasse
  );

  const gesamtNettoStandard = runden(druck + porto);
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