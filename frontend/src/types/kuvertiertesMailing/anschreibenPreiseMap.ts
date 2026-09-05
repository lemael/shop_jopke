import { StaffelPreis } from "../staffelPreis";
import { AnschreibenFarbigkeit } from "./types";

export type AnschreibenPreiseMap = Record<
  string, // Grammatur, ex: "80 g/m²", "90 g/m²"
  Partial<Record<AnschreibenFarbigkeit, StaffelPreis[]>>
>;