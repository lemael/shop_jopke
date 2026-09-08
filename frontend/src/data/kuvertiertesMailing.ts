// Feste Spezifikation des Anschreibens (nicht wählbar, siehe Produktübersicht auf jopke.de).

const ALL_STEPS = [
  "Hüllentyp",
  "Ausstattung",
  "Auflage",
  "Farbigkeit Hülle",
  "Anzahl Flyer",
  "Grammatur Anschreiben",
  "Farbigkeit Anschreiben",
  "Umfang Flyer",
  "Grammatur Flyer",
  "Oberfläche Flyer",
  "Umfang Broschüre",
  "Grammatur Broschüre (Inhalt)",
  "Oberfläche Broschüre (Inhalt)",
  "Oberfläche Broschüre (Umschlag)",
  "Grammatur Broschüre (Umschlag)",
  "Endformat Antwortkarte",
  "Grammatur Antwortkarte",
  "Oberfläche Antwortkarte",
  "Übersicht",
] as const;
type StepName = (typeof ALL_STEPS)[number];
const FLYER_STEPS = new Set<StepName>(["Umfang Flyer", "Grammatur Flyer", "Oberfläche Flyer"]);
const BROSCHUERE_STEPS = new Set<StepName>(["Umfang Broschüre", "Oberfläche Broschüre (Umschlag)", "Grammatur Broschüre (Umschlag)", "Grammatur Broschüre (Inhalt)", "Oberfläche Broschüre (Inhalt)"]);
const ANTWORTKARTE_STEPS = new Set<StepName>(["Endformat Antwortkarte", "Grammatur Antwortkarte", "Oberfläche Antwortkarte"]);




export {

  ALL_STEPS,
  FLYER_STEPS,
  BROSCHUERE_STEPS,
  ANTWORTKARTE_STEPS,

};  