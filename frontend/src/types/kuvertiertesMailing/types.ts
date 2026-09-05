type DeltaKurve = Partial<Record<number, number>>;
type HuellenTyp = 
  | "Fensterhülle"
  | "Panorama-Fensterhülle"
  | "Hülle-ohne-Fenster";
type InhaltTyp = 
  | "Anschreiben"
  | "Flyer"
  | "Broschuere"
  | "Antwortkarte";

type FensterhuelleFarbigkeit =
| "unbedruckt"
| "1/0-farbig Schwarz"
| "1/1-farbig Schwarz"
| "4/0-farbig Euroskala"
| "4/4-farbig Euroskala";

type PanoramaFensterhuelleGrammatur = "100 g/m²";

type PanoramaFensterhuelleFarbigkeit =
  | "unbedruckt"
  | "1/0-farbig Schwarz"
  | "4/0-farbig Euroskala";

type HuelleOhneFensterGrammatur = "75 g/m²";

type HuelleOhneFensterFarbigkeit =
  | "unbedruckt"
  | "1/0-farbig Schwarz"
  | "1/1-farbig Schwarz"
  | "4/0-farbig Euroskala"
  | "4/4-farbig Euroskala";

type AnschreibenFarbigkeit =
  | "1/0-farbig Schwarz"
  | "1/1-farbig Schwarz"
  | "4/0-farbig Euroskala"
  | "4/1-farbig Euroskala/Schwarz"
  | "4/4-farbig Euroskala";

type AnschreibenGrammatur = "80 g/m²" | "90 g/m²";
type FensterhuelleGrammatur = "75 g/m²";

type AntwortkarteEndformat = "210 x 99 mm" | "210 x 105 mm";
type AntwortkarteGrammatur = "170 g/m²" | "250 g/m²";
type AntwortkarteOberflaeche = "glänzend" | "matt";
type AntwortkarteFarbigkeit = "4/4-farbig Euroskala";


type FlyerEndformat = "100 x 210 mm" | "105 x 210 mm";

type FlyerUmfang =
  | "2 Seiten"
  | "4 Seiten"
  | "6 Seiten"
  | "8 Seiten"
  | "12 Seiten";

type FlyerGrammatur =
  | "90 g/m²"
  | "115 g/m²"
  | "135 g/m²"
  | "170 g/m²"
  | "250 g/m²";

type FlyerFarbigkeit = "4/4-farbig Euroskala";

type FlyerOberflaeche = "glänzend" | "matt";

type FlyerOffenesFormat =
  | "210 x 210 mm"
  | "297 x 210 mm"
  | "391 x 210 mm"
  | "420 x 297 mm";

type FlyerVerarbeitung =
  | "Kombifalz auf DIN lang"
  | "Mittelfalz auf DIN lang"
  | "Wickelfalz auf DIN lang";

type BroschuereEndformat = "105 x 210 mm";

type BroschuereUmfang =
  | "16 (4 + 12) Seiten"
  | "20 (4 + 16) Seiten"
  | "24 (4 + 20) Seiten"
  | "28 (4 + 24) Seiten"
  | "32 (4 + 28) Seiten"
  | "36 (4 + 32) Seiten";

type BroschuereInhaltGrammatur = "90 g/m²";
type BroschuereUmschlagGrammatur = "170 g/m²";

type BroschuereOberflaeche = "glänzend" | "matt";
type BroschuereFarbigkeit = "4/4-farbig Euroskala";
type BroschuereVerarbeitung = "Rückendrahtheftung mit 2 Klammern";


interface Huelle{
    kategorie: "Fensterhülle" | "Panorama-Fensterhülle" | "Hülle ohne Fenster";
    name: string;
    endformat: "229 x 114 mm";
    papier: "Offset";
    grammatur: FensterhuelleGrammatur | PanoramaFensterhuelleGrammatur | HuelleOhneFensterGrammatur;
    farbigkeit: FensterhuelleFarbigkeit | PanoramaFensterhuelleFarbigkeit | HuelleOhneFensterFarbigkeit;
}
/**
 * Configuration pour Fensterhülle DIN C6/5
 */
interface FensterhuelleDINC65Config {
  kategorie: "Fensterhülle";
  name: "Fensterhülle DIN C6/5";
  endformat: "229 x 114 mm";
  papier: "Offset";
  grammatur: FensterhuelleGrammatur;
  farbigkeit: FensterhuelleFarbigkeit;
}

interface PanoramaFensterhuelleDINC65Config {
  kategorie: "Panorama-Fensterhülle";
  name: "Panorama-Fensterhülle DIN C6/5";
  endformat: "229 x 114 mm";
  papier: "Offset";
  grammatur: PanoramaFensterhuelleGrammatur;
  farbigkeit: PanoramaFensterhuelleFarbigkeit;
}

interface HuelleOhneFensterDINC65Config {
  kategorie: "Hülle ohne Fenster";
  name: "Hülle ohne Fenster DIN C6/5";
  endformat: "229 x 114 mm";
  papier: "Offset";
  grammatur: HuelleOhneFensterGrammatur;
  farbigkeit: HuelleOhneFensterFarbigkeit;
}

/**
 * Configuration pour Anschreiben DIN A4
 */

interface AnschreibenDINA4Config {
  kategorie: "Anschreiben";
  name: "Anschreiben DIN A4";
  offenesFormat: "210 x 297 mm";
  umfang: "2 Seiten";
  papier: "Offset";
  verarbeitung: "Wickelfalz auf DIN lang";
  grammatur: AnschreibenGrammatur;
  farbigkeit: AnschreibenFarbigkeit;
}

interface AntwortkarteDINLangConfig {
  kategorie: "Antwortkarte";
  name: "Antwortkarte DIN lang";
  endformat: AntwortkarteEndformat;
  umfang: "2 Seiten";
  papier: "Bilderdruck";
  grammatur: AntwortkarteGrammatur;
  farbigkeit: AntwortkarteFarbigkeit;
  oberflaeche: AntwortkarteOberflaeche;
}

interface FlyerDINLangConfig {
  kategorie: "Flyer";
  produkt_gruppe?: string | null;
  name: "Flyer DIN lang";
  endformat: FlyerEndformat;
  umfang: FlyerUmfang;
  papier: "Bilderdruck";
  grammatur: FlyerGrammatur;
  farbigkeit: FlyerFarbigkeit;
  oberflaeche: FlyerOberflaeche;
  offenesFormat?: FlyerOffenesFormat;
  verarbeitung?: FlyerVerarbeitung;
}

interface BroschuereDINLangConfig {
  kategorie: "Broschüre";
  name: "Broschüre DIN lang";
  endformat: BroschuereEndformat;
  umfang: BroschuereUmfang;
  verarbeitung: BroschuereVerarbeitung;
  
  // Contenu (Inhalt)
  papier: "Bilderdruck";
  grammatur: BroschuereInhaltGrammatur;
  farbigkeit: BroschuereFarbigkeit;
  oberflaeche: BroschuereOberflaeche;
  
  // Couverture (Umschlag)
  umschlagPapier: "Bilderdruck";
  umschlagGrammatur: BroschuereUmschlagGrammatur;
  umschlagOberflaeche: BroschuereOberflaeche;
}
export type {
     DeltaKurve, 
    HuellenTyp, 
    InhaltTyp,
     FensterhuelleDINC65Config, 
     AnschreibenDINA4Config, 
     AntwortkarteDINLangConfig, 
     FensterhuelleFarbigkeit, 
     AnschreibenFarbigkeit, 
     AnschreibenGrammatur, 
     FensterhuelleGrammatur,
      AntwortkarteEndformat, 
      AntwortkarteGrammatur, 
      AntwortkarteOberflaeche, 
      AntwortkarteFarbigkeit,
     BroschuereEndformat,
     BroschuereUmfang,
     BroschuereVerarbeitung,
     BroschuereInhaltGrammatur,
     BroschuereFarbigkeit,
     BroschuereOberflaeche,
     BroschuereUmschlagGrammatur,
     BroschuereDINLangConfig,
     HuelleOhneFensterDINC65Config,
     HuelleOhneFensterGrammatur,
     HuelleOhneFensterFarbigkeit,
     PanoramaFensterhuelleDINC65Config,
     PanoramaFensterhuelleGrammatur,
     PanoramaFensterhuelleFarbigkeit,
     Huelle,
      FlyerUmfang,
      FlyerGrammatur,
      FlyerFarbigkeit,
      FlyerOberflaeche,
      FlyerEndformat,
      FlyerOffenesFormat,
      FlyerVerarbeitung,
      FlyerDINLangConfig
};