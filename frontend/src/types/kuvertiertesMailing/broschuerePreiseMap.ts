import type { StaffelPreis } from "@/types/staffelPreis";

export type BroschuerePreiseMap = Record<
  string, // Umfang, ex: "16 (4 + 12) Seiten", "20 (4 + 16) Seiten", etc.
  Record<
    string, // Grammatur/Finition Inhalt & Umschlag, ex: "90 g/m² matt | 170 g/m² matt"
    StaffelPreis[]
  >
>;