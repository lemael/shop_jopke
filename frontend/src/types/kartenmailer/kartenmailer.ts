
export const ALL_STEPS = ["Auflage", "Papier", "Veredelung", "Übersicht"];
export type StepName = (typeof ALL_STEPS)[number];
const FAMILIEN_KENNUNGEN = {
  post_din_lan_98: "(210x98)",
  post_din_lan_105: "(210x105)",
  post_maxi: "(235x125)",
  post_din_a6: "(148x105)",
  post_din_a5: "(210x148)",
  post_din_a4: "(297x210)",
  postkarte_maxi: "(Bestseller)"
};
export { FAMILIEN_KENNUNGEN };
export interface Config {
  papier: string;
  veredelung: string;
  auflage: number;
}
