import type { AntwortkartePreiseMap } from "@/types/kuvertiertesMailing/antwortkartePreiseMap";
import type { DeltaKurve } from "@/types/kuvertiertesMailing/types";
import { FlyerPreiseMap } from "@/types/kuvertiertesMailing/flyerPreiseMap";
import { FensterhuellePreiseMap } from "@/types/kuvertiertesMailing/fensterhuellePreiseMap";
import { PanoramaFensterhuellePreiseMap } from "@/types/kuvertiertesMailing/panoramaFensterhuellePreiseMap";
import { HuelleOhneFensterPreiseMap } from "@/types/kuvertiertesMailing/huelleOhneFensterPreiseMap";
import { AnschreibenPreiseMap } from "@/types/kuvertiertesMailing/anschreibenPreiseMap";
import { BroschuerePreiseMap } from "@/types/kuvertiertesMailing/broschuerePreiseMap";

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
const FENSTERHUELLE_DIN_C65_STAFFEL_PREISE: FensterhuellePreiseMap = {

  "unbedruckt": [
    { "min": 1, "max": 5000, "fixpreis": 0.00, "preisPro1000": 33.84 },
    { "min": 5001, "max": 10000, "fixpreis": 0.00, "preisPro1000": 33.84 },
    { "min": 10001, "max": 50000, "fixpreis": 0.00, "preisPro1000": 33.84 },
    { "min": 50001, "max": 100000, "fixpreis": 0.00, "preisPro1000": 33.84 }
  ],
  "1/0-farbig Schwarz": [
    { "min": 1, "max": 5000, "fixpreis": 93.60, "preisPro1000": 72.72 },
    { "min": 5001, "max": 10000, "fixpreis": 96.72, "preisPro1000": 59.04 },
    { "min": 10001, "max": 50000, "fixpreis": 240.24, "preisPro1000": 48.96 },
    { "min": 50001, "max": 100000, "fixpreis": 562.56, "preisPro1000": 44.88 }
  ],
  "1/1-farbig Schwarz": [
    { "min": 1, "max": 5000, "fixpreis": 102.96, "preisPro1000": 79.92 },
    { "min": 5001, "max": 10000, "fixpreis": 105.60, "preisPro1000": 65.04 },
    { "min": 10001, "max": 50000, "fixpreis": 259.92, "preisPro1000": 54.00 },
    { "min": 50001, "max": 100000, "fixpreis": 613.92, "preisPro1000": 49.44 }
  ],
  "4/0-farbig Euroskala": [
    { "min": 1, "max": 5000, "fixpreis": 90.96, "preisPro1000": 90.72 },
    { "min": 5001, "max": 10000, "fixpreis": 89.28, "preisPro1000": 78.72 },
    { "min": 10001, "max": 50000, "fixpreis": 397.20, "preisPro1000": 63.12 },
    { "min": 50001, "max": 100000, "fixpreis": 683.76, "preisPro1000": 55.44 },
  ],
  "4/4-farbig Euroskala": [
    { "min": 1, "max": 5000, "fixpreis": 90.96, "preisPro1000": 90.72 },
    { "min": 5001, "max": 10000, "fixpreis": 89.28, "preisPro1000": 78.72 },
    { "min": 10001, "max": 50000, "fixpreis": 252.00, "preisPro1000": 69.60 },
    { "min": 50001, "max": 100000, "fixpreis": 576.00, "preisPro1000": 68.40 }
  ]
};

const PANORAMA_FENSTERHUELLE_DIN_C65_STAFFEL_PREISE: PanoramaFensterhuellePreiseMap = {
    "unbedruckt": [
      { "min": 1, "max": 5000, "fixpreis": 48.00, "preisPro1000": 96.00 },
      { "min": 5001, "max": 10000, "fixpreis": 96.00, "preisPro1000": 84.00 },
      { "min": 10001, "max": 50000, "fixpreis": 132.00, "preisPro1000": 81.60 },
      { "min": 50001, "max": 100000, "fixpreis": 144.00, "preisPro1000": 79.20 },
    ],
    "1/0-farbig Schwarz": [
      { "min": 1, "max": 5000, "fixpreis": 288.00, "preisPro1000": 132.00 },
      { "min": 5001, "max": 10000, "fixpreis": 336.00, "preisPro1000": 93.60 },
      { "min": 10001, "max": 50000, "fixpreis": 372.00, "preisPro1000": 96.00 },
      { "min": 50001, "max": 100000, "fixpreis": 600.00, "preisPro1000": 79.20 }
    ],
    "4/0-farbig Euroskala": [
      { "min": 1, "max": 5000, "fixpreis": 480.00, "preisPro1000": 156.00 },
      { "min": 5001, "max": 10000, "fixpreis": 600.00, "preisPro1000": 104.40 },
      { "min": 10001, "max": 50000, "fixpreis": 720.00, "preisPro1000": 103.20 },
      { "min": 50001, "max": 100000, "fixpreis": 840.00, "preisPro1000": 86.40 }
    ]
};
const HUELLE_OHNE_FENSTER_DIN_C65_STAFFEL_PREISE: HuelleOhneFensterPreiseMap = {
    "unbedruckt": [
      { "min": 1, "max": 5000, "fixpreis": 0.00, "preisPro1000": 32.64 },
      { "min": 5001, "max": 10000, "fixpreis": 0.00, "preisPro1000": 32.64 },
      { "min": 10001, "max": 50000, "fixpreis": 0.00, "preisPro1000": 32.64 },
      { "min": 50001, "max": 100000, "fixpreis": 0.00, "preisPro1000": 32.64 }
    ],
    "1/0-farbig Schwarz": [
      { "min": 1, "max": 5000, "fixpreis": 93.60, "preisPro1000": 72.72 },
      { "min": 5001, "max": 10000, "fixpreis": 96.72, "preisPro1000": 59.04 },
      { "min": 10001, "max": 50000, "fixpreis": 240.24, "preisPro1000": 48.96 },
      { "min": 50001, "max": 100000, "fixpreis": 562.56, "preisPro1000": 44.88 }
    ],
    "1/1-farbig Schwarz": [
      { "min": 1, "max": 5000, "fixpreis": 120.00, "preisPro1000": 76.80 },
      { "min": 5001, "max": 10000, "fixpreis": 132.00, "preisPro1000": 64.80 },
      { "min": 10001, "max": 50000, "fixpreis": 156.00, "preisPro1000": 57.60 },
      { "min": 50001, "max": 100000, "fixpreis": 180.00, "preisPro1000": 55.20 }
    ],
    "4/0-farbig Euroskala": [
      { "min": 1, "max": 5000, "fixpreis": 90.96, "preisPro1000": 90.72 },
      { "min": 5001, "max": 10000, "fixpreis": 89.28, "preisPro1000": 78.72 },
      { "min": 10001, "max": 50000, "fixpreis": 397.20, "preisPro1000": 63.12 },
      { "min": 50001, "max": 100000, "fixpreis": 683.76, "preisPro1000": 55.44 }
    ],
    "4/4-farbig Euroskala": [
      { "min": 1, "max": 5000, "fixpreis": 108.00, "preisPro1000": 82.80 },
      { "min": 5001, "max": 10000, "fixpreis": 96.00, "preisPro1000": 79.20 },
      { "min": 10001, "max": 50000, "fixpreis": 96.00, "preisPro1000": 74.40 },
      { "min": 50001, "max": 100000, "fixpreis": 312.00, "preisPro1000": 72.00 }
    ]
};


const ANSCHREIBEN_A1000_STAFFEL_PREISE: AnschreibenPreiseMap = {
  "80 g/m²": {
    "4/0-farbig Euroskala": [
      { "min": 1, "max": 5000, "fixpreis": 33.84, "preisPro1000": 35.52 },
      { "min": 5001, "max": 10000, "fixpreis": 37.92, "preisPro1000": 31.92 },
      { "min": 10001, "max": 50000, "fixpreis": 156.72, "preisPro1000": 28.56 },
      { "min": 50001, "max": 100000, "fixpreis": 224.40, "preisPro1000": 29.04 }
    ],
    "4/4-farbig Euroskala": [
      { "min": 1, "max": 5000, "fixpreis": 47.76, "preisPro1000": 44.88 },
      { "min": 5001, "max": 10000, "fixpreis": 179.76, "preisPro1000": 33.84 },
      { "min": 10001, "max": 50000, "fixpreis": 299.28, "preisPro1000": 35.28 },
      { "min": 50001, "max": 100000, "fixpreis": 202.08, "preisPro1000": 36.00 }
    ],
    "4/1-farbig Euroskala/Schwarz": [
      { "min": 1, "max": 5000, "fixpreis": 49.92, "preisPro1000": 44.40 },
      { "min": 5001, "max": 10000, "fixpreis": 81.12, "preisPro1000": 40.80 },
      { "min": 10001, "max": 50000, "fixpreis": 161.76, "preisPro1000": 27.84 },
      { "min": 50001, "max": 100000, "fixpreis": 224.16, "preisPro1000": 28.56 }
    ],
    "1/0-farbig Schwarz": [
      { "min": 1, "max": 5000, "fixpreis": 35.28, "preisPro1000": 33.84 },
      { "min": 5001, "max": 10000, "fixpreis": 63.60, "preisPro1000": 31.44 },
      { "min": 10001, "max": 50000, "fixpreis": 205.68, "preisPro1000": 36.00 },
      { "min": 50001, "max": 100000, "fixpreis": 303.60, "preisPro1000": 35.52 }
    ],
    "1/1-farbig Schwarz": [
      { "min": 1, "max": 5000, "fixpreis": 41.28, "preisPro1000": 46.08 },
      { "min": 5001, "max": 10000, "fixpreis": 76.80, "preisPro1000": 41.04 },
      { "min": 10001, "max": 50000, "fixpreis": 163.20, "preisPro1000": 29.04 },
      { "min": 50001, "max": 100000, "fixpreis": 221.04, "preisPro1000": 29.76 }
    ]
  },
  "90 g/m²": {
    "4/0-farbig Euroskala": [
      { "min": 1, "max": 5000, "fixpreis": 34.56, "preisPro1000": 36.24 },
      { "min": 5001, "max": 10000, "fixpreis": 38.16, "preisPro1000": 32.64 },
      { "min": 10001, "max": 50000, "fixpreis": 231.60, "preisPro1000": 35.28 },
      { "min": 50001, "max": 100000, "fixpreis": 305.28, "preisPro1000": 36.00 }
    ],
    "4/4-farbig Euroskala": [
      { "min": 1, "max": 5000, "fixpreis": 48.96, "preisPro1000": 45.60 },
      { "min": 5001, "max": 10000, "fixpreis": 50.16, "preisPro1000": 39.12 },
      { "min": 10001, "max": 50000, "fixpreis": 182.40, "preisPro1000": 34.56 },
      { "min": 50001, "max": 100000, "fixpreis": 235.20, "preisPro1000": 29.04 }
    ],
    "4/1-farbig Euroskala/Schwarz": [
      { "min": 1, "max": 5000, "fixpreis": 50.88, "preisPro1000": 45.12 },
      { "min": 5001, "max": 10000, "fixpreis": 81.84, "preisPro1000": 41.76 },
      { "min": 10001, "max": 50000, "fixpreis": 199.20, "preisPro1000": 36.96 },
      { "min": 50001, "max": 100000, "fixpreis": 310.08, "preisPro1000": 36.24 }
    ],
    "1/0-farbig Schwarz": [
      { "min": 1, "max": 5000, "fixpreis": 35.76, "preisPro1000": 34.56 },
      { "min": 5001, "max": 10000, "fixpreis": 64.32, "preisPro1000": 32.16 },
      { "min": 10001, "max": 50000, "fixpreis": 160.56, "preisPro1000": 28.56 },
      { "min": 50001, "max": 100000, "fixpreis": 203.04, "preisPro1000": 36.96 }
    ],
    "1/1-farbig Schwarz": [
      { "min": 1, "max": 5000, "fixpreis": 42.00, "preisPro1000": 47.04 },
      { "min": 5001, "max": 10000, "fixpreis": 79.20, "preisPro1000": 41.76 },
      { "min": 10001, "max": 50000, "fixpreis": 203.04, "preisPro1000": 36.96 },
      { "min": 50001, "max": 100000, "fixpreis": 310.08, "preisPro1000": 36.24 }
    ]
  }
}


const FLYER__STAFFEL_PREISE: FlyerPreiseMap = {
  "2 Seiten": {
    "170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 48.00, "preisPro1000": 23.28 },
      { "min": 5001, "max": 10000, "fixpreis": 60.00, "preisPro1000": 21.60 },
      { "min": 10001, "max": 50000, "fixpreis": 81.12, "preisPro1000": 19.20 },
      { "min": 50001, "max": 100000, "fixpreis": 168.00, "preisPro1000": 18.48 }
    ],
    "170 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 48.00, "preisPro1000": 23.28 },
      { "min": 5001, "max": 10000, "fixpreis": 60.00, "preisPro1000": 21.60 },
      { "min": 10001, "max": 50000, "fixpreis": 81.12, "preisPro1000": 19.20 },
      { "min": 50001, "max": 100000, "fixpreis": 168.00, "preisPro1000": 18.48 }
    ],
    "250 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 48.00, "preisPro1000": 33.36 },
      { "min": 5001, "max": 10000, "fixpreis": 60.00, "preisPro1000": 27.84 },
      { "min": 10001, "max": 50000, "fixpreis": 102.00, "preisPro1000": 25.92 },
      { "min": 50001, "max": 100000, "fixpreis": 264.00, "preisPro1000": 24.00 }
    ],
    "250 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 48.00, "preisPro1000": 33.36 },
      { "min": 5001, "max": 10000, "fixpreis": 60.00, "preisPro1000": 27.84 },
      { "min": 10001, "max": 50000, "fixpreis": 102.00, "preisPro1000": 25.92 },
      { "min": 50001, "max": 100000, "fixpreis": 264.00, "preisPro1000": 24.00 }
    ]
  },
  "4 Seiten": {
    "90 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 67.68, "preisPro1000": 35.52 },
      { "min": 5001, "max": 10000, "fixpreis": 55.20, "preisPro1000": 30.96 },
      { "min": 10001, "max": 50000, "fixpreis": 82.32, "preisPro1000": 29.04 },
      { "min": 50001, "max": 100000, "fixpreis": 245.52, "preisPro1000": 27.12 }
    ],
    "90 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 67.68, "preisPro1000": 35.52 },
      { "min": 5001, "max": 10000, "fixpreis": 55.20, "preisPro1000": 30.96 },
      { "min": 10001, "max": 50000, "fixpreis": 82.32, "preisPro1000": 29.04 },
      { "min": 50001, "max": 100000, "fixpreis": 245.52, "preisPro1000": 27.12 }
    ],
    "115 g/m² matt": [
    { "min": 1, "max": 5000, "fixpreis": 72.00, "preisPro1000": 36.48 },
    { "min": 5001, "max": 10000, "fixpreis": 60.00, "preisPro1000": 33.36 },
    { "min": 10001, "max": 50000, "fixpreis": 144.00, "preisPro1000": 31.20 },
    { "min": 50001, "max": 100000, "fixpreis": 268.08, "preisPro1000": 30.72 }
    ],
    "115 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 72.00, "preisPro1000": 36.48 },
      { "min": 5001, "max": 10000, "fixpreis": 60.00, "preisPro1000": 33.36 },
      { "min": 10001, "max": 50000, "fixpreis": 144.00, "preisPro1000": 31.20 },
      { "min": 50001, "max": 100000, "fixpreis": 268.08, "preisPro1000": 30.72 }
    ],
    "135 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 71.28, "preisPro1000": 39.36 },
      { "min": 5001, "max": 10000, "fixpreis": 60.00, "preisPro1000": 37.44 },
      { "min": 10001, "max": 50000, "fixpreis": 144.00, "preisPro1000": 33.60 },
      { "min": 50001, "max": 100000, "fixpreis": 324.72, "preisPro1000": 32.40 }
    ],
    "135 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 71.28, "preisPro1000": 39.36 },
      { "min": 5001, "max": 10000, "fixpreis": 60.00, "preisPro1000": 37.44 },
      { "min": 10001, "max": 50000, "fixpreis": 144.00, "preisPro1000": 33.60 },
      { "min": 50001, "max": 100000, "fixpreis": 324.72, "preisPro1000": 32.40 }
    ],
    "170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 73.92, "preisPro1000": 55.68 },
      { "min": 5001, "max": 10000, "fixpreis": 63.12, "preisPro1000": 45.12 },
      { "min": 10001, "max": 50000, "fixpreis": 134.64, "preisPro1000": 45.60 },
      { "min": 50001, "max": 100000, "fixpreis": 260.40, "preisPro1000": 45.12 }
    ],
    "170 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 73.92, "preisPro1000": 55.68 },
      { "min": 5001, "max": 10000, "fixpreis": 63.12, "preisPro1000": 45.12 },
      { "min": 10001, "max": 50000, "fixpreis": 134.64, "preisPro1000": 45.60 },
      { "min": 50001, "max": 100000, "fixpreis": 260.40, "preisPro1000": 45.12 }
    ]
  },
  "6 Seiten": {
    "90 g/m² matt": [
    { "min": 1, "max": 5000, "fixpreis": 80.16, "preisPro1000": 48.00 },
    { "min": 5001, "max": 10000, "fixpreis": 84.00, "preisPro1000": 42.00 },
    { "min": 10001, "max": 50000, "fixpreis": 134.40, "preisPro1000": 40.32 },
    { "min": 50001, "max": 100000, "fixpreis": 396.72, "preisPro1000": 39.36 }
    ],
    "90 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 80.16, "preisPro1000": 48.00 },
      { "min": 5001, "max": 10000, "fixpreis": 84.00, "preisPro1000": 42.00 },
      { "min": 10001, "max": 50000, "fixpreis": 134.40, "preisPro1000": 40.32 },
      { "min": 50001, "max": 100000, "fixpreis": 396.72, "preisPro1000": 39.36 }
    ],
    "115 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 81.12, "preisPro1000": 49.92 },
      { "min": 5001, "max": 10000, "fixpreis": 80.64, "preisPro1000": 44.16 },
      { "min": 10001, "max": 50000, "fixpreis": 138.24, "preisPro1000": 42.24 },
      { "min": 50001, "max": 100000, "fixpreis": 416.64, "preisPro1000": 41.28 }
    ],
    "115 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 81.12, "preisPro1000": 49.92 },
      { "min": 5001, "max": 10000, "fixpreis": 80.64, "preisPro1000": 44.16 },
      { "min": 10001, "max": 50000, "fixpreis": 138.24, "preisPro1000": 42.24 },
      { "min": 50001, "max": 100000, "fixpreis": 416.64, "preisPro1000": 41.28 }
    ],
    "135 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 71.52, "preisPro1000": 56.16 },
      { "min": 5001, "max": 10000, "fixpreis": 78.00, "preisPro1000": 49.92 },
      { "min": 10001, "max": 50000, "fixpreis": 154.80, "preisPro1000": 48.24 },
      { "min": 50001, "max": 100000, "fixpreis": 445.92, "preisPro1000": 47.76 }
    ],
    "135 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 71.52, "preisPro1000": 56.16 },
      { "min": 5001, "max": 10000, "fixpreis": 78.00, "preisPro1000": 49.92 },
      { "min": 10001, "max": 50000, "fixpreis": 154.80, "preisPro1000": 48.24 },
      { "min": 50001, "max": 100000, "fixpreis": 445.92, "preisPro1000": 47.76 }
    ],
    "170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 84.96, "preisPro1000": 72.96 },
      { "min": 5001, "max": 10000, "fixpreis": 78.00, "preisPro1000": 62.16 },
      { "min": 10001, "max": 50000, "fixpreis": 201.12, "preisPro1000": 61.20 },
      { "min": 50001, "max": 100000, "fixpreis": 544.80, "preisPro1000": 58.08 }
    ],
    "170 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 84.96, "preisPro1000": 72.96 },
      { "min": 5001, "max": 10000, "fixpreis": 78.00, "preisPro1000": 62.16 },
      { "min": 10001, "max": 50000, "fixpreis": 201.12, "preisPro1000": 61.20 },
      { "min": 50001, "max": 100000, "fixpreis": 544.80, "preisPro1000": 58.08 }
    ]
  },
  "8 Seiten": {
    "90 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 96.48, "preisPro1000": 74.64 },
      { "min": 5001, "max": 10000, "fixpreis": 82.80, "preisPro1000": 61.92 },
      { "min": 10001, "max": 50000, "fixpreis": 422.16, "preisPro1000": 50.40 },
      { "min": 50001, "max": 100000, "fixpreis": 763.44, "preisPro1000": 54.72 }
    ],
    "90 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 96.48, "preisPro1000": 74.64 },
      { "min": 5001, "max": 10000, "fixpreis": 82.80, "preisPro1000": 61.92 },
      { "min": 10001, "max": 50000, "fixpreis": 422.16, "preisPro1000": 50.40 },
      { "min": 50001, "max": 100000, "fixpreis": 763.44, "preisPro1000": 54.72 }
    ],
    "115 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 100.32, "preisPro1000": 76.80 },
      { "min": 5001, "max": 10000, "fixpreis": 84.48, "preisPro1000": 63.60 },
      { "min": 10001, "max": 50000, "fixpreis": 432.00, "preisPro1000": 54.48 },
      { "min": 50001, "max": 100000, "fixpreis": 764.88, "preisPro1000": 57.60 }
    ],
    "115 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 100.32, "preisPro1000": 76.80 },
      { "min": 5001, "max": 10000, "fixpreis": 84.48, "preisPro1000": 63.60 },
      { "min": 10001, "max": 50000, "fixpreis": 432.00, "preisPro1000": 54.48 },
      { "min": 50001, "max": 100000, "fixpreis": 764.88, "preisPro1000": 57.60 }
    ],
    "135 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 101.76, "preisPro1000": 82.32 },
      { "min": 5001, "max": 10000, "fixpreis": 92.16, "preisPro1000": 68.40 },
      { "min": 10001, "max": 50000, "fixpreis": 451.20, "preisPro1000": 63.12 },
      { "min": 50001, "max": 100000, "fixpreis": 870.24, "preisPro1000": 66.00 }
    ],
    "135 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 101.76, "preisPro1000": 82.32 },
      { "min": 5001, "max": 10000, "fixpreis": 92.16, "preisPro1000": 68.40 },
      { "min": 10001, "max": 50000, "fixpreis": 451.20, "preisPro1000": 63.12 },
      { "min": 50001, "max": 100000, "fixpreis": 870.24, "preisPro1000": 66.00 }
    ],
    "170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 113.76, "preisPro1000": 105.36 },
      { "min": 5001, "max": 10000, "fixpreis": 112.80, "preisPro1000": 89.76 },
      { "min": 10001, "max": 50000, "fixpreis": 418.08, "preisPro1000": 78.48 },
      { "min": 50001, "max": 100000, "fixpreis": 1023.60, "preisPro1000": 79.20 }
    ],
    "170 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 113.76, "preisPro1000": 105.36 },
      { "min": 5001, "max": 10000, "fixpreis": 112.80, "preisPro1000": 89.76 },
      { "min": 10001, "max": 50000, "fixpreis": 418.08, "preisPro1000": 78.48 },
      { "min": 50001, "max": 100000, "fixpreis": 1023.60, "preisPro1000": 79.20 }
    ]
  },
  "12 Seiten": {
    "90 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 284.16, "preisPro1000": 100.68 },
      { "min": 5001, "max": 10000, "fixpreis": 342.24, "preisPro1000": 84.84 },
      { "min": 10001, "max": 50000, "fixpreis": 481.68, "preisPro1000": 80.52 },
      { "min": 50001, "max": 100000, "fixpreis": 820.56, "preisPro1000": 73.80 }
    ],
    "90 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 284.16, "preisPro1000": 100.68 },
      { "min": 5001, "max": 10000, "fixpreis": 342.24, "preisPro1000": 84.84 },
      { "min": 10001, "max": 50000, "fixpreis": 481.68, "preisPro1000": 80.52 },
      { "min": 50001, "max": 100000, "fixpreis": 820.56, "preisPro1000": 73.80 }
    ],
    "115 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 289.44, "preisPro1000": 131.16 },
      { "min": 5001, "max": 10000, "fixpreis": 407.76, "preisPro1000": 98.04 },
      { "min": 10001, "max": 50000, "fixpreis": 509.04, "preisPro1000": 87.72 },
      { "min": 50001, "max": 100000, "fixpreis": 953.52, "preisPro1000": 87.00 }
    ],
    "115 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 289.44, "preisPro1000": 131.16 },
      { "min": 5001, "max": 10000, "fixpreis": 407.76, "preisPro1000": 98.04 },
      { "min": 10001, "max": 50000, "fixpreis": 509.04, "preisPro1000": 87.72 },
      { "min": 50001, "max": 100000, "fixpreis": 953.52, "preisPro1000": 87.00 }
    ],
    "135 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 281.28, "preisPro1000": 119.64 },
      { "min": 5001, "max": 10000, "fixpreis": 357.84, "preisPro1000": 104.76 },
      { "min": 10001, "max": 50000, "fixpreis": 525.12, "preisPro1000": 93.96 },
      { "min": 50001, "max": 100000, "fixpreis": 1006.56, "preisPro1000": 93.00 }
    ],
    "135 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 281.28, "preisPro1000": 119.64 },
      { "min": 5001, "max": 10000, "fixpreis": 357.84, "preisPro1000": 104.76 },
      { "min": 10001, "max": 50000, "fixpreis": 525.12, "preisPro1000": 93.96 },
      { "min": 50001, "max": 100000, "fixpreis": 1006.56, "preisPro1000": 93.00 }
    ]
  }
};

/**
 * Delta für Varianten der Antwortkarte (DIN lang).
 * Referenz für jede Gruppe ist die Variante mit 170 g/m².
 */

const ANTWORTKARTE__STAFFEL_PREISE: AntwortkartePreiseMap = {

  "210 x 99 mm": {
    "170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 35.76, "preisPro1000": 23.28 },
      { "min": 5001, "max": 10000, "fixpreis": 44.16, "preisPro1000": 20.64 },
      { "min": 10001, "max": 50000, "fixpreis": 79.44, "preisPro1000": 17.76 },
      { "min": 50001, "max": 100000, "fixpreis": 173.28, "preisPro1000": 17.04 }
    ],
    "170 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 35.76, "preisPro1000": 23.28 },
      { "min": 5001, "max": 10000, "fixpreis": 44.16, "preisPro1000": 20.64 },
      { "min": 10001, "max": 50000, "fixpreis": 79.44, "preisPro1000": 17.76 },
      { "min": 50001, "max": 100000, "fixpreis": 173.28, "preisPro1000": 17.04 }
    ],
    "250 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 38.40, "preisPro1000": 31.44 },
      { "min": 5001, "max": 10000, "fixpreis": 54.48, "preisPro1000": 26.88 },
      { "min": 10001, "max": 50000, "fixpreis": 96.96, "preisPro1000": 23.76 },
      { "min": 50001, "max": 100000, "fixpreis": 224.64, "preisPro1000": 22.56 }
    ],
    "250 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 38.40, "preisPro1000": 31.44 },
      { "min": 5001, "max": 10000, "fixpreis": 54.48, "preisPro1000": 26.88 },
      { "min": 10001, "max": 50000, "fixpreis": 96.96, "preisPro1000": 23.76 },
      { "min": 50001, "max": 100000, "fixpreis": 224.64, "preisPro1000": 22.56 }
    ]
  },
  "210 x 105 mm": {
    "170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 37.92, "preisPro1000": 23.28 },
      { "min": 5001, "max": 10000, "fixpreis": 47.76, "preisPro1000": 21.60 },
      { "min": 10001, "max": 50000, "fixpreis": 81.12, "preisPro1000": 18.72 },
      { "min": 50001, "max": 100000, "fixpreis": 189.36, "preisPro1000": 18.00 }
    ],
    "170 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 37.92, "preisPro1000": 23.28 },
      { "min": 5001, "max": 10000, "fixpreis": 47.76, "preisPro1000": 21.60 },
      { "min": 10001, "max": 50000, "fixpreis": 81.12, "preisPro1000": 18.72 },
      { "min": 50001, "max": 100000, "fixpreis": 189.36, "preisPro1000": 18.00 }
    ],
    "250 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 40.32, "preisPro1000": 33.36 },
      { "min": 5001, "max": 10000, "fixpreis": 57.12, "preisPro1000": 27.84 },
      { "min": 10001, "max": 50000, "fixpreis": 102.00, "preisPro1000": 25.20 },
      { "min": 50001, "max": 100000, "fixpreis": 241.68, "preisPro1000": 24.00 }
    ],
    "250 g/m² glänzend": [
      { "min": 1, "max": 5000, "fixpreis": 40.32, "preisPro1000": 33.36 },
      { "min": 5001, "max": 10000, "fixpreis": 57.12, "preisPro1000": 27.84 },
      { "min": 10001, "max": 50000, "fixpreis": 102.00, "preisPro1000": 25.20 },
      { "min": 50001, "max": 100000, "fixpreis": 241.68, "preisPro1000": 24.00 }
    ],
  },

};

const BROSCHUERE_VARIANTEN_DELTA_KURVEN: Record<string, DeltaKurve> = {
  "8 Seiten|90 g/m²": { 500: 0, 1000: 0, 5000: 0, 10000: 0, 50000: 0, 100000: 0 }, // Referenz
  "8 Seiten|115 g/m²": { 500: 9.84, 1000: 5.04, 5000: 21.84, 10000: 21.84, 50000: 60.48, 100000: 449.52 },
  "8 Seiten|135 g/m²": { 500: 0, 1000: 5.04, 5000: 25.2, 10000: 25.2, 50000: 67.2, 100000: 637.44 },
  "12 Seiten|90 g/m²|90 g/m²": { 500: 0, 1000: 0, 5000: 0, 10000: 0, 50000: 0, 100000: 0 }, // Referenz
  "12 Seiten|90 g/m²|170 g/m²": { 500: 116.64, 1000: 72.24, 5000: 46.56, 10000: 46.56, 50000: -456.72, 100000: 807.84 },
  "12 Seiten|90 g/m²|250 g/m²": { 500: 116.64, 1000: 76.56, 5000: 44.64, 10000: 44.64, 50000: -562.8, 100000: 949.44 },
  "20 Seiten|90 g/m²|90 g/m²": { 500: 0, 1000: 0, 5000: 0, 10000: 0, 50000: 0, 100000: 0 }, // Referenz
  "20 Seiten|90 g/m²|170 g/m²": { 500: -11.28, 1000: 36, 5000: 36.48, 10000: 36.48, 50000: -50.64, 100000: 572.16 },
  "20 Seiten|90 g/m²|250 g/m²": { 500: 8.88, 1000: 55.44, 5000: 43.2, 10000: 43.2, 50000: -644.88, 100000: 1124.88 },
  "24 Seiten|90 g/m²|90 g/m²": { 500: 0, 1000: 0, 5000: 0, 10000: 0, 50000: 0, 100000: 0 }, // Referenz
  "24 Seiten|90 g/m²|170 g/m²": { 500: 27.36, 1000: 83.28, 5000: 41.76, 10000: 41.76, 50000: 1153.44, 100000: 552.72 },
  "24 Seiten|90 g/m²|250 g/m²": { 500: 51.12, 1000: 91.2, 5000: 48.72, 10000: 48.72, 50000: 323.28, 100000: 1124.88 },
  "28 Seiten|90 g/m²|90 g/m²": { 500: 0, 1000: 0, 5000: 0, 10000: 0, 50000: 0, 100000: 0 }, // Referenz
  "28 Seiten|90 g/m²|170 g/m²": { 500: 16.32, 1000: 59.52, 5000: 47.28, 10000: 47.28, 50000: 1033.68, 100000: 572.16 },
  "28 Seiten|90 g/m²|250 g/m²": { 500: 45.36, 1000: 68.64, 5000: 54.96, 10000: 54.96, 50000: 530.64, 100000: 1125.12 },
  "32 Seiten|90 g/m²|90 g/m²": { 500: 0, 1000: 0, 5000: 0, 10000: 0, 50000: 0, 100000: 0 }, // Referenz
  "32 Seiten|90 g/m²|170 g/m²": { 500: 38.4, 1000: 82.8, 5000: 76.56, 10000: 76.56, 50000: 1632.96, 100000: 552.96 },
  "32 Seiten|90 g/m²|250 g/m²": { 500: 70.08, 1000: 92.88, 5000: 85.2, 10000: 85.2, 50000: 1197.12, 100000: 1125.12 },
};

const BROSCHUERE_STAFFEL_PREISE: BroschuerePreiseMap = {
 
  "16 (4 + 12) Seiten": {
    "90 g/m² matt | 170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 245.04, "preisPro1000": 206.40 },
      { "min": 5001, "max": 10000, "fixpreis": 217.68, "preisPro1000": 180.72 },
      { "min": 10001, "max": 50000, "fixpreis": 491.28, "preisPro1000": 192.48 },
      { "min": 50001, "max": 100000, "fixpreis": 2086.32, "preisPro1000": 192.48 }
    ]
  },
  "20 (4 + 16) Seiten": {
    "90 g/m² matt | 170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 277.44, "preisPro1000": 241.68 },
      { "min": 5001, "max": 10000, "fixpreis": 254.40, "preisPro1000": 210.96 },
      { "min": 10001, "max": 50000, "fixpreis": 564.24, "preisPro1000": 224.88 },
      { "min": 50001, "max": 100000, "fixpreis": 2206.08, "preisPro1000": 224.88 }
    ]
  },
  "24 (4 + 20) Seiten": {
    "90 g/m² matt | 170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 320.88, "preisPro1000": 274.56 },
      { "min": 5001, "max": 10000, "fixpreis": 290.16, "preisPro1000": 239.52 },
      { "min": 10001, "max": 50000, "fixpreis": 633.12, "preisPro1000": 256.80 },
      { "min": 50001, "max": 100000, "fixpreis": 2615.76, "preisPro1000": 256.80 },
    ]
  },
  "28 (4 + 24) Seiten": {
    "90 g/m² matt | 170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 293.04, "preisPro1000": 283.20 },
      { "min": 5001, "max": 10000, "fixpreis": 255.36, "preisPro1000": 255.36 },
      { "min": 10001, "max": 50000, "fixpreis": 787.20, "preisPro1000": 248.16 },
      { "min": 50001, "max": 100000, "fixpreis": 2497.68, "preisPro1000": 235.68 }
    ]
  },
  "32 (4 + 28) Seiten": {
    "90 g/m² matt | 170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 394.08, "preisPro1000": 342.48 },
      { "min": 5001, "max": 10000, "fixpreis": 363.60, "preisPro1000": 297.12 },
      { "min": 10001, "max": 50000, "fixpreis": 774.24, "preisPro1000": 320.88 },
      { "min": 50001, "max": 100000, "fixpreis": 3469.44, "preisPro1000": 320.88 }
    ]
  },
  "36 (4 + 32) Seiten": {
    "90 g/m² matt | 170 g/m² matt": [
      { "min": 1, "max": 5000, "fixpreis": 423.36, "preisPro1000": 377.76 },
      { "min": 5001, "max": 10000, "fixpreis": 402.24, "preisPro1000": 327.12 },
      { "min": 10001, "max": 50000, "fixpreis": 847.20, "preisPro1000": 353.28 },
      { "min": 50001, "max": 100000, "fixpreis": 2719.68, "preisPro1000": 371.76 }
    ]
  }
};

export  {
  BROSCHUERE_STAFFEL_PREISE,
  BROSCHUERE_VARIANTEN_DELTA_KURVEN,
  ANTWORTKARTE__STAFFEL_PREISE,
  FLYER__STAFFEL_PREISE,
  FENSTERHUELLE_DIN_C65_STAFFEL_PREISE,
  HUELLE_OHNE_FENSTER_DIN_C65_STAFFEL_PREISE,
  ANSCHREIBEN_A1000_STAFFEL_PREISE,
  PANORAMA_FENSTERHUELLE_DIN_C65_STAFFEL_PREISE,
  


};