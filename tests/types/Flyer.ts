export interface Flyer {
  anzahl?: FlyerNummer;
  umfang: string;
  farbigkeit: string;
  grammatur: string;
  oberflaeche: string;

  isChecked: boolean;
}
export type FlyerNummer = 1 | 2 | 3;