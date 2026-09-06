import { StaffelPreis } from "../staffelPreis";
import { HuelleOhneFensterFarbigkeit } from "./types";

export type HuelleOhneFensterPreiseMap = Record<
  HuelleOhneFensterFarbigkeit,
  StaffelPreis[]
>;