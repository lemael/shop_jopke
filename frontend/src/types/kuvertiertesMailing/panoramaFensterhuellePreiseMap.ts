import { StaffelPreis } from "../staffelPreis";
import { PanoramaFensterhuelleFarbigkeit } from "./types";

export type PanoramaFensterhuellePreiseMap = Record<
  PanoramaFensterhuelleFarbigkeit,
  StaffelPreis[]
>;