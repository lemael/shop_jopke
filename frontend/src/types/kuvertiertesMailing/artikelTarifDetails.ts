import { StaffelPreis } from "./staffelPreis";

export interface ArtikelTarifDetails {
  kategorie: string;
  produkt_gruppe: string | null;
  produkt_nummer: string | null;
  produkt_name: string | null;
  produkt_beschreibung: string | null;
  endformat: string | null;
  offenes_format: string | null;
  umfang: string | null;
  papier: string | null;
  grammatur: string | null;
  oberflaeche: string | null;
  papier_2: string | null;
  grammatur_2: string | null;
  oberflaeche_2: string | null;
  farbigkeit: string | null;
  vorderseite: string | null;
  rueckseite: string | null;
  verarbeitung: string | null;
  perforation: string | null;
  upload: string | null;
  mindestmenge: number | null;
  maximalmenge: number | null;
  gewicht_in_g: number | null;
  versandklasse: string | null;
  tranchen: StaffelPreis[];
}