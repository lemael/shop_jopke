import type {
  AusstattungConfig,
  AusstattungPreisTranche,
} from "@/types/kuvertiertesMailing/ausstattungPreisTranche";

/**
 * Prix de vente du Druck, calculé comme sur jopke.de à partir des colonnes
 * « Extern » (Fixpreis / Preis o/oo) de tarife.xlsx :
 *
 *   Fix   = runden(Fixpreis / 1,5)
 *   ‰     = runden(Preis o/oo / 1,5)
 *   Druck = runden(Fix + Auflage / 1000 × ‰)
 *
 * Le Fix et le ‰ sont arrondis séparément, AVANT la multiplication par la quantité.
 * Vérifié sur les 163 prix du rapport « Kalkulator-Vergleich » (163/163 identiques).
 *
 * Tous les calculs se font en centimes entiers pour éviter le bruit flottant
 * (ex. 99,2325 / 1,5 = 66,155 doit donner 66,16 et non 66,15).
 */

const DIVISEUR_VK = 1.5;

/** Arrondi commercial (0,5 vers le haut) d'un montant positif exprimé en centimes. */
function rundenCent(centimes: number): number {
  return Math.round(centimes);
}

/** runden(wert / 1,5) en centimes ; wert est lu avec 4 décimales (ex. 156,9975). */
function geteiltDurchDiviseurInCent(wert: number): number {
  const zehntausendstel = Math.round(wert * 10000);
  return rundenCent(zehntausendstel / (DIVISEUR_VK * 100));
}

/**
 * Prix de vente d'UN article (en centimes), à partir de ses colonnes « Extern » :
 * runden(Fixpreis / 1,5) + runden(Auflage / 1000 × runden(Preis o/oo / 1,5)).
 */
function verkaufspreisInCent(fixpreis: number, preisPro1000: number, auflage: number): number {
  const fixCent = geteiltDurchDiviseurInCent(fixpreis);
  const pro1000Cent = geteiltDurchDiviseurInCent(preisPro1000);
  return fixCent + rundenCent((auflage * pro1000Cent) / 1000);
}

/**
 * Prix de vente d'un article en euros (même formule que jopke.de).
 * Un mailing composé (Kuvertiertes Mailing) = somme des prix de ses articles :
 * Hauptartikel + Hülle + Anschreiben + Flyer + Broschüre + Antwortkarte.
 */
export function berechneVerkaufspreis(
  fixpreis: number | undefined,
  preisPro1000: number | undefined,
  auflage: number
): number {
  return verkaufspreisInCent(fixpreis ?? 0, preisPro1000 ?? 0, auflage) / 100;
}

export function findeTranche(
  ausstattung: AusstattungConfig,
  auflage: number
): AusstattungPreisTranche | undefined {
  return ausstattung.tranchen.find((t) => auflage >= t.min && auflage <= t.max);
}

export interface DruckPreis {
  druck: number;
  expressAufpreis: number;
}

export function berechneDruckPreis(
  ausstattung: AusstattungConfig,
  auflage: number
): DruckPreis | null {
  const tranche = findeTranche(ausstattung, auflage);
  if (!tranche) {
    console.error(
      `Keine Preis-Tranche für ${ausstattung.produkt_nummer} bei ${auflage} Stück`,
      ausstattung.tranchen
    );
    return null;
  }

  const druckCent = verkaufspreisInCent(tranche.fixpreis ?? 0, tranche.preisPro1000 ?? 0, auflage);

  // Supplément Express = runden(Druck × Aufschlag Express % de la tranche).
  const expressProzent = tranche.aufschlag_express_in_prozent ?? 0;
  const expressCent = rundenCent((druckCent * Math.round(expressProzent * 100)) / 10000);

  return {
    druck: druckCent / 100,
    expressAufpreis: expressCent / 100,
  };
}
