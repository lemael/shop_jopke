// Réponse de GET /api/porto/regeln (backend : feuille « Porto » de tarife.xlsx
// + supplément jopke.de de 0,01 € par Sendung).

export interface PortoRegel {
  versandklasse: string;
  beschreibung: string;
  gewicht_min_g: number;
  gewicht_max_g: number;
  /** Tarif tel qu'il figure dans tarife.xlsx. */
  tarif_excel: number;
  /** Tarif appliqué (tarif Excel + supplément jopke.de), dès 5.000 Sendungen. */
  tarif: number;
  /** Tarif Dialogpost Easy (tarif + Easy-Zuschlag), petites quantités. */
  tarif_easy: number;
  /** Dès cette quantité, on paie pour 5.000 Sendungen (moins cher qu'Easy). */
  ab_auflage_aufzahlung: number;
}

export interface PortoKonfiguration {
  easy_zuschlag: number;
  aufschlag_jopke: number;
  mindestauflage_dialogpost: number;
  regeln: PortoRegel[];
}
