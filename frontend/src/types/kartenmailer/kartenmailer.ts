
export const ALL_STEPS = [
export type StepName = (typeof ALL_STEPS)[number];

interface Config {
  papier: string | null;
  veredelung: string | null;
  auflage: number | null;
}