import type { ALL_STEPS } from "@/data/kuvertiertesMailing";
import type { FlyerDINLangConfig } from "@/types/kuvertiertesMailing/types";

type FlyerConfig = {
  umfang: string;
  grammatur: string;
  oberflaeche: string;
};

type StepName = (typeof ALL_STEPS)[number];
interface Config {
  huellentyp: string ;
  ausstattung: string;
  auflage: number;
  huelleFarbigkeit: string;
  anschreibenGrammatur: string ;
  anschreibenFarbigkeit: string;
  flyerUmfang: string ;
  flyerGrammatur: string ;
  flyerOberflaeche: string ;
  broschuereUmfang: string ;
  broschuereInhaltOberflaeche: string ;
  broschuereUmschlagOberflaeche: string ;
  broschuereInhaltGrammatur: string ;
  broschuereUmschlagGrammatur: string ;
  antwortkarteEndformat: string;
  antwortkarteGrammatur: string;
  antwortkarteOberflaeche: string;
  anzahlFlyer: number;
  flyerConfigs: FlyerConfig[];
  verarbeitungszeit: "Standard" | "Express";
  
}

export type { Config, StepName, FlyerConfig };