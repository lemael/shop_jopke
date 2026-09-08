import { PRODUKTKATALOG, type Produkt } from "@/data/produktkatalog";
import type { Config} from "@/types/selfmailer/selfmailer";
import { SELFMAILER_PRICE_MATRIX, GRAMMATUR_FACTOR, PORTO_RATE } from "@/data/selfmailing";
import { PreisDetails } from "@/types/preisDetails";
import { AusstattungConfig } from "@/types/kuvertiertesMailing/ausstattungPreisTranche";
import { berechnePorto } from "@/lib/porto";

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
function berechneHauptartikelVorauswahlPreis(
    staffel: AusstattungConfig,
    auflage: number
): number {
    const indexTranche =
        auflage <= 5000 ? 0 :
        auflage <= 10000 ? 1 :
        auflage <= 50000 ? 2 : 3;

    const tranche = staffel.tranchen[indexTranche];

    const fixpreis = tranche.fixpreis ?? 0;
    const preisPro1000 = tranche.preisPro1000 ?? 0;
    console.log(`Berechne Hauptartikelpreis für Auflage ${auflage}: Tranche ${indexTranche}, Fixpreis ${fixpreis}, Preis pro 1000 ${preisPro1000}`);
    return runden(
        fixpreis + (auflage / 1000) * preisPro1000
    );
}
export function calcSelfmailerPrice(ausstattung: AusstattungConfig, cfg: Config): PreisDetails | null {

   const indexTranche =
        cfg.auflage <= 5000 ? 0 :
        cfg.auflage <= 10000 ? 1 :
        cfg.auflage <= 50000 ? 2 : 3;
  const druck = runden( berechneHauptartikelVorauswahlPreis(ausstattung, cfg.auflage)/1.5 ) + 0.01;
  const porto = berechnePorto(cfg.auflage, ausstattung.mindest_versandklasse);
  const gesamtNettoStandard = runden(druck + porto );
  const expressProzent = (ausstattung.tranchen[indexTranche].aufschlag_express_in_prozent ?? 0) / 100;
  const expressAufpreis = runden(druck * expressProzent);
  const gesamtNettoExpress = runden(gesamtNettoStandard + expressAufpreis);
  const mwstStandard = runden(gesamtNettoStandard * 0.19);

  const gesamtBruttoStandard = runden(gesamtNettoStandard + mwstStandard);
  const gewichtProSendungG = ausstattung.gewicht_in_g ?? 0;
  const gesamtGewichtKg = runden((gewichtProSendungG * cfg.auflage) / 1000);
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