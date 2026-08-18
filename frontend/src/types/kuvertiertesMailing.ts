import type { ALL_STEPS } from "@/data/kuvertiertesMailing";
interface FlyerConfig {
  umfang: string | null;
  grammatur: string | null;
  oberflaeche: string | null;
}
type StepName = (typeof ALL_STEPS)[number];
interface Config {
  huellentyp: string | null;
  ausstattung: string | null;
  auflage: number | null;
  fensterhuelleFarbigkeit: string | null;
  anschreibenGrammatur: string | null;
  anschreibenFarbigkeit: string | null;
  flyerUmfang: string | null;
  flyerGrammatur: string | null;
  flyerOberflaeche: string | null;
  broschuereUmfang: string | null;
  broschuereOberflaeche: string | null;
  antwortkarteEndformat: string | null;
  antwortkarteGrammatur: string | null;
  antwortkarteOberflaeche: string | null;
  anzahlFlyer: number | null;
  flyerConfigs: FlyerConfig[];
  verarbeitungszeit: "Standard" | "Express";
}

export type { FlyerConfig, Config, StepName };