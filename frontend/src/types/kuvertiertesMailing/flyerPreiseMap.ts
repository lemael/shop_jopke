import type { StaffelPreis } from "@/types/staffelPreis";

export type FlyerPreiseMap = Record<
  string, // Umfang, ex: "2 Seiten", "4 Seiten", etc.
  Record<
    string, // Grammatur + Oberflaeche, ex: "170 g/m² matt"
    StaffelPreis[]
  >
>;