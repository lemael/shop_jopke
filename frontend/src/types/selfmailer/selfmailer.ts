export const ALL_STEPS = ["Auflage", "Umfang", "Grammatur", "Perforation", "Übersicht"];

export type StepName = (typeof ALL_STEPS)[number];

export interface Config {
  auflage: number ;
  umfang: string;
  grammatur: string;
  perforation: string[];
 
}

