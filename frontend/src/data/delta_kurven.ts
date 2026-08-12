import type { DeltaKurve } from "@/types/types";

/**
 * Deltas aus dem Live-Konfigurator für gemeinsame Detailoptionen der Hülle bzw.
 * des Anschreibens. Referenzkonfigurationen mit Delta 0 sind:
 * - Fensterhülle / Hülle ohne Fenster / Panorama: "unbedruckt"
 * - Anschreiben-Grammatur: "80 g/m²"
 * - Anschreiben-Farbigkeit: "4/0-farbig Euroskala"
 *
 * Diese Deltas werden zur jeweiligen Basis-Ausstattung addiert. Detailoptionen
 * von Flyer/Broschüre/Antwortkarte bleiben vorerst auf der verifizierten
 * Referenzvariante der jeweiligen Ausstattung.
 */
const HUELLEN_FARBIGKEIT_DELTA_KURVEN: Partial<Record<string, Record<string, DeltaKurve>>> = {
  "Fensterhülle": {
    "1/0-farbig Schwarz": { 500: 75.36, 1000: 88.32, 5000: 192, 10000: 232.48, 50000: 664.16, 100000: 1111.04 },
    "1/1-farbig Schwarz": { 500: 84, 1000: 99.36, 5000: 222.24, 10000: 278.4, 50000: 845.28, 100000: 1449.28 },
    "4/0-farbig Euroskala": { 500: 79.6, 1000: 98.56, 5000: 250.24, 10000: 358.72, 50000: 1240.8, 100000: 1895.84 },
    "4/4-farbig Euroskala": { 500: 79.6, 1000: 98.56, 5000: 250.24, 10000: 358.72, 50000: 1360, 100000: 2688 },
  },
  "Panorama-Fensterhülle": {
    "1/0-farbig Schwarz": { 500: 172, 1000: 184, 5000: 280, 10000: 224, 50000: 640, 100000: 304 },
    "4/0-farbig Euroskala": { 500: 308, 1000: 328, 5000: 488, 10000: 472, 50000: 1112, 100000: 944 },
  },
  "Hülle ohne Fenster": {
    "1/0-farbig Schwarz": { 500: 75.76, 1000: 89.12, 5000: 196, 10000: 240.48, 50000: 704.16, 100000: 1191.04 },
    "1/1-farbig Schwarz": { 500: 94.72, 1000: 109.44, 5000: 227.2, 10000: 302.4, 50000: 936, 100000: 1624 },
    "4/0-farbig Euroskala": { 500: 80, 1000: 99.36, 5000: 254.24, 10000: 366.72, 50000: 1280.8, 100000: 1975.84 },
    "4/4-farbig Euroskala": { 500: 88.72, 1000: 105.44, 5000: 239.2, 10000: 374.4, 50000: 1456, 100000: 2832 },
  },
};

const ANSCHREIBEN_VARIANTEN_DELTA_KURVEN: Record<string, DeltaKurve> = {
  "80 g/m²|4/4-farbig Euroskala": { 500: 12.4, 1000: 15.52, 5000: 40.48, 10000: 50.4, 50000: 191.36, 100000: 370.24 },
  "80 g/m²|4/1-farbig Euroskala/Schwarz": { 500: 13.68, 1000: 16.64, 5000: 40.32, 10000: 88, 50000: 278.24, 100000: 465.92 },
  "80 g/m²|1/0-farbig Schwarz": { 500: 0.4, 1000: -0.16, 5000: -4.64, 10000: 13.92, 50000: -20.64, 100000: -32.16 },
  "80 g/m²|1/1-farbig Schwarz": { 500: 8.48, 1000: 12, 5000: 40.16, 10000: 86.72, 50000: 280.64, 100000: 484.8 },
  "90 g/m²|4/0-farbig Euroskala": { 500: 0.72, 1000: 0.96, 5000: 2.88, 10000: 4.96, 50000: 20.32, 100000: 45.76 },
  "90 g/m²|4/4-farbig Euroskala": { 500: 13.44, 1000: 16.8, 5000: 43.68, 10000: 56.16, 50000: 217.12, 100000: 420.8 },
  "90 g/m²|4/1-farbig Euroskala/Schwarz": { 500: 14.56, 1000: 17.76, 5000: 43.36, 10000: 94.88, 50000: 308.32, 100000: 517.92 },
  "90 g/m²|1/0-farbig Schwarz": { 500: 0.96, 1000: 0.64, 5000: -1.92, 10000: 19.2, 50000: 2.56, 100000: 7.2 },
  "90 g/m²|1/1-farbig Schwarz": { 500: 9.28, 1000: 13.12, 5000: 43.84, 10000: 93.12, 50000: 310.88, 100000: 537.12 },
};

/**
 * Delta für das Endformat der Antwortkarte (DIN lang), abgeleitet aus dem Live-Konfigurator.
 * Referenz: Diese Werte entsprechen den Mehrkosten für das Endformat im Vergleich zur
 * Basiskonfiguration der Ausstattung (Farbe 1/1, Grammatur etc. fix).
 * Punkte bei 500 und 1000 Stück verifiziert (Extraktion aus jopke.de für 8 Gruppen), der Rest
 * wird linear aus diesen beiden Punkten extrapoliert (Fixpreis + PreisPro1000).
 *
 *   Δ(auflage) = fixpreis + auflage/1000 * preisPro1000
 *   210 x 99 mm:  Fixpreis 1.76, PreisPro1000 5.44  → 500: 4.48, 1000: 7.20
 *   210 x 105 mm: Fixpreis 3.04, PreisPro1000 6.72  → 500: 6.40, 1000: 9.76
 */
const ANTWORTKARTE_ENDFORMAT_DELTA_KURVEN: Record<string, DeltaKurve> = {
  "210 x 99 mm": { 500: 4.48, 1000: 7.2, 5000: 28.96, 10000: 56.16, 50000: 273.76, 100000: 545.76 },
  "210 x 105 mm": { 500: 6.4, 1000: 9.76, 5000: 36.64, 10000: 70.24, 50000: 339.04, 100000: 675.04 },
};
export default {
  HUELLEN_FARBIGKEIT_DELTA_KURVEN,
  ANSCHREIBEN_VARIANTEN_DELTA_KURVEN,
  ANTWORTKARTE_ENDFORMAT_DELTA_KURVEN,
};