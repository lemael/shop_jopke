import type { Versandklasse } from "@/lib/porto";

export interface AusstattungPreisTranche {
  min: number;
  max: number;
  fixpreis?: number;
  preisPro1000?: number;
  abweichende_lz_standard?: string;
  abweichende_lz_express?: string;
  aufschlag_express_in_prozent?: number;
}

export interface AusstattungConfig {
  // Hiérarchie & Catégories
  produkt_gruppe?: string;
  kategorie?: string;
  kategorie_beschreibung?: string;

  produkt_gruppe_2?: string;
  kategorie_2?: string;
  kategorie_beschreibung_2?: string;

  produkt_gruppe_3?: string;
  kategorie_3?: string;
  kategorie_beschreibung_3?: string;

  produkt_gruppe_4?: string;
  kategorie_4?: string;

  // Détails de l'article
  produkt_nummer?: string;
  name?: string;
  beschreibung?: string;
  pdf?: string;

  // Composants
  huelle?: string;
  anschreiben?: string;
  flyer?: string;
  broschuere?: string;
  antwortkarte?: string;

  // Spécifications & Formats
  endformat?: string;
  offenes_format?: string;
  umfang: string;

  // Bloc Papier 1 (Inhalt)
  papier?: string;
  grammatur: string;
  oberflaeche?: string;

  // Bloc Papier 2 (Umschlag)
  papier_2?: string;
  grammatur_2: string;
  oberflaeche_2?: string;

  // Finitions & Impression
  farbigkeit?: string;
  vorderseite?: string;
  rueckseite?: string;
  verarbeitung?: string;
  perforation: string;
  veredelung?: string;
  upload?: string;

  // Logistique & Limites
  mindestmenge: number;
  maximalmenge: number;
  gewicht_in_g?: number;
  mindest_versandklasse: Versandklasse;

  // Tranches tarifaires
  tranchen: AusstattungPreisTranche[];
}