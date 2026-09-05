import { StaffelPreis } from "@/types/staffelPreis";

export type AntwortkartePreiseMap = Record<
  string, // Endformat, ex: "210 x 99 mm"
  Record<
    string, // Grammatur + Oberflaeche, ex: "170 g/m² matt"
    StaffelPreis[]
  >
>;