import { StaffelPreis } from "../staffelPreis";
import { FensterhuelleFarbigkeit } from "./types";

export type FensterhuellePreiseMap = Record<
  FensterhuelleFarbigkeit,
  StaffelPreis[]
>;