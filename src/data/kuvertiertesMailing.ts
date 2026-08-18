// Feste Spezifikation des Anschreibens (nicht wählbar, siehe Produktübersicht auf jopke.de).
const ANSCHREIBEN_OFFENES_FORMAT = "210 x 297 mm";
const ANSCHREIBEN_UMFANG = "2 Seiten";
const ANSCHREIBEN_PAPIER = "Offset";

const ANSCHREIBEN_GRAMMATUR_OPTIONEN = ["80 g/m²", "90 g/m²"] as const;

const ANSCHREIBEN_FARBIGKEIT_OPTIONEN = [
  "4/0-farbig Euroskala",
  "4/4-farbig Euroskala",
  "4/1-farbig Euroskala/Schwarz",
  "1/0-farbig Schwarz",
  "1/1-farbig Schwarz",
] as const;

/**
 * Flyer DIN lang hat auf jopke.de eigene Auswahl-Schritte (Umfang → Grammatur → Oberfläche);
 * Endformat, Farbigkeit und Papier sind dabei fest und werden automatisch übernommen. Welche
 * Grammaturen wählbar sind, hängt vom gewählten Umfang ab (mehr Seiten → weniger/leichtere
 * Grammaturen, wahrscheinlich wegen der maximalen Stapeldicke) — verifiziert auf jopke.de.
 */
const FLYER_UMFANG_OPTIONEN = ["2 Seiten", "4 Seiten", "6 Seiten", "8 Seiten", "12 Seiten"] as const;
const FLYER_GRAMMATUR_NACH_UMFANG: Record<string, readonly string[]> = {
  "2 Seiten": ["170 g/m²", "250 g/m²"],
  "4 Seiten": ["90 g/m²", "115 g/m²", "135 g/m²", "170 g/m²"],
  "6 Seiten": ["90 g/m²", "115 g/m²", "135 g/m²", "170 g/m²"],
  "8 Seiten": ["90 g/m²", "115 g/m²", "135 g/m²", "170 g/m²"],
  "12 Seiten": ["90 g/m²", "115 g/m²", "135 g/m²"],
};
const FLYER_OBERFLAECHE_OPTIONEN = ["matt", "glänzend"] as const;
const FLYER_ENDFORMAT_LANG = "100 x 210 mm, 105 x 210 mm";
const FLYER_FARBIGKEIT = "4/4-farbig Euroskala";
const FLYER_PAPIER_LANG = "Bilderdruck";

/**
 * Broschüre DIN lang hat auf jopke.de eigene Auswahl-Schritte (Umfang → Oberfläche) —
 * anders als Flyer gibt es hier keinen Grammatur-Schritt: Grammatur ist fest (Inhalt
 * 90 g/m², Umschlag 170 g/m², jeweils ein einzelner Wert in der Produktübersicht),
 * verifiziert auf jopke.de.
 */
const BROSCHUERE_UMFANG_OPTIONEN = ["16 Seiten", "20 Seiten", "24 Seiten", "28 Seiten", "32 Seiten", "36 Seiten"] as const;
const BROSCHUERE_OBERFLAECHE_OPTIONEN = ["matt", "glänzend"] as const;
const BROSCHUERE_ENDFORMAT_LANG = "105 x 210 mm";
const BROSCHUERE_FARBIGKEIT = "4/4-farbig Euroskala";
const BROSCHUERE_GRAMMATUR_LANG = "Inhalt 90 g/m², Umschlag 170 g/m²";
const BROSCHUERE_PAPIER_LANG = "Bilderdruck";
const BROSCHUERE_VERARBEITUNG_LANG = "Rückendrahtheftung mit 2 Klammern";

/**
 * Antwortkarte DIN lang hat auf jopke.de eigene Auswahl-Schritte (Endformat → Grammatur →
 * Oberfläche) — alle drei unabhängig voneinander (verifiziert: beide Endformate führen zu
 * denselben zwei Grammatur-Optionen).
 */
const ANTWORTKARTE_ENDFORMAT_OPTIONEN = ["210 x 99 mm", "210 x 105 mm"] as const;
const ANTWORTKARTE_GRAMMATUR_OPTIONEN = ["170 g/m²", "250 g/m²"] as const;
const ANTWORTKARTE_OBERFLAECHE_OPTIONEN = ["matt", "glänzend"] as const;
const ANTWORTKARTE_UMFANG_LANG = "2 Seiten";
const ANTWORTKARTE_FARBIGKEIT = "4/4-farbig Euroskala";
const ANTWORTKARTE_PAPIER_LANG = "Bilderdruck";

/**
 * Feste Spezifikationsgruppen für optionale Inhaltsteile ohne eigene Auswahl-Schritte
 * (Flyer/Broschüre DIN A4 bei DIN-C4-Mailing — dort nur bei 1.000 Stück verifiziert bzw.
 * mit mehreren Grammatur-Werten in der Produktübersicht, daher als Spannweite dargestellt
 * statt interaktiv).
 */
const FLYER_GRUPPE_C4 = {
  titel: "Flyer DIN A4",
  zeilen: [
    ["Endformat", "210 x 297 mm"],
    ["Umfang", "2, 4, 6, 8 Seiten"],
    ["Farbigkeit", "4/4-farbig Euroskala"],
    ["Grammatur", "90 g/m², 135 g/m², 170 g/m², 250 g/m²"],
    ["Papier", "Bilderdruck"],
    ["Oberfläche", "glänzend, matt"],
  ] as [string, string][],
};

const FENSTERHUELLE_FARBIGKEIT_OPTIONEN = [
  "unbedruckt",
  "1/0-farbig Schwarz",
  "1/1-farbig Schwarz",
  "4/0-farbig Euroskala",
  "4/4-farbig Euroskala",
] as const;

const BROSCHUERE_GRUPPE_C4 = {
  titel: "Broschüre DIN A4",
  zeilen: [
    ["Endformat", "210 x 297 mm"],
    ["Umfang", "8, 12, 16, 20, 24, 28, 32 Seiten"],
    ["Farbigkeit", "4/4-farbig Euroskala"],
    ["Grammatur", "Inhalt 90 g/m², 115 g/m², 135 g/m² · Umschlag 90 g/m², 115 g/m², 135 g/m², 170 g/m², 250 g/m²"],
    ["Papier", "Bilderdruck"],
    ["Oberfläche", "glänzend, matt"],
  ] as [string, string][],
};

const ALL_STEPS = [
  "Hüllentyp",
  "Ausstattung",
  "Auflage",
  "Anzahl Flyer",
  "Farbigkeit Hülle",
  "Grammatur Anschreiben",
  "Farbigkeit Anschreiben",
  "Umfang Flyer",
  "Grammatur Flyer",
  "Oberfläche Flyer",
  "Umfang Broschüre",
  "Oberfläche Broschüre",
  "Endformat Antwortkarte",
  "Grammatur Antwortkarte",
  "Oberfläche Antwortkarte",
  "Übersicht",
] as const;
type StepName = (typeof ALL_STEPS)[number];
const FLYER_STEPS = new Set<StepName>(["Umfang Flyer", "Grammatur Flyer", "Oberfläche Flyer"]);
const BROSCHUERE_STEPS = new Set<StepName>(["Umfang Broschüre", "Oberfläche Broschüre"]);
const ANTWORTKARTE_STEPS = new Set<StepName>(["Endformat Antwortkarte", "Grammatur Antwortkarte", "Oberfläche Antwortkarte"]);

// Panorama-Fensterhülle hat auf jopke.de weniger Farbigkeit-Optionen als Fensterhülle/Hülle ohne Fenster.
const PANORAMA_FARBIGKEIT_OPTIONEN = ["unbedruckt", "1/0-farbig Schwarz", "4/0-farbig Euroskala"] as const;


export {
  ANSCHREIBEN_OFFENES_FORMAT,
  ANSCHREIBEN_UMFANG,
  ANSCHREIBEN_PAPIER,
  ANSCHREIBEN_GRAMMATUR_OPTIONEN,
  ANSCHREIBEN_FARBIGKEIT_OPTIONEN,
  FLYER_UMFANG_OPTIONEN,
  FLYER_GRAMMATUR_NACH_UMFANG,
  FLYER_OBERFLAECHE_OPTIONEN,
  FLYER_ENDFORMAT_LANG,
  FLYER_FARBIGKEIT,
  FLYER_PAPIER_LANG,
  BROSCHUERE_UMFANG_OPTIONEN,
  BROSCHUERE_OBERFLAECHE_OPTIONEN,
  BROSCHUERE_ENDFORMAT_LANG,
  BROSCHUERE_FARBIGKEIT,
  BROSCHUERE_GRAMMATUR_LANG,
  BROSCHUERE_PAPIER_LANG,
  BROSCHUERE_VERARBEITUNG_LANG,
  ANTWORTKARTE_ENDFORMAT_OPTIONEN,
  ANTWORTKARTE_GRAMMATUR_OPTIONEN,
  ANTWORTKARTE_OBERFLAECHE_OPTIONEN,
  ANTWORTKARTE_UMFANG_LANG,
  ANTWORTKARTE_FARBIGKEIT,
  ANTWORTKARTE_PAPIER_LANG,
  FLYER_GRUPPE_C4,
  BROSCHUERE_GRUPPE_C4,
  ALL_STEPS,
  FLYER_STEPS,
  BROSCHUERE_STEPS,
  ANTWORTKARTE_STEPS,
  FENSTERHUELLE_FARBIGKEIT_OPTIONEN,
  PANORAMA_FARBIGKEIT_OPTIONEN,
};  