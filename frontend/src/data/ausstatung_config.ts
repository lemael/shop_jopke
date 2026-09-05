import type { AusstattungConfig } from '@/types/ausstattungConfig';

export const AUSSTATTUNG_CONFIG: Record<string, AusstattungConfig> = {
  "Fensterhülle|Anschreiben": {
    hatBroschuere: false,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 216.19, preisPro1000: 136.26, expressProzent: 0.25 },
      { "min": 5001, "max": 10000, fixpreis: 274.824, preisPro1000: 127.776, expressProzent: 0.17 },
      { "min": 10001, "max": 50000, fixpreis: 259.209, preisPro1000: 120.516, expressProzent: 0.15 },
      { "min": 50001, "max": 100000, fixpreis: 243.594, preisPro1000: 113.256, expressProzent: 0.135 },
    ],
  },
  "Fensterhülle|Anschreiben + Antwortkarte": {
    hatBroschuere: false,
    staffeln: [
      {"min": 1, "max": 5000, fixpreis: 240.03, preisPro1000: 157.36, expressProzent: 0.29 },
      { "min": 5001, "max": 10000, fixpreis: 274.824, preisPro1000: 135.696, expressProzent: 0.21 },
      { "min": 10001, "max": 50000, fixpreis: 259.209, preisPro1000: 127.986, expressProzent: 0.19 },
      { "min": 50001, "max": 100000, fixpreis: 243.594, preisPro1000: 120.276, expressProzent: 0.175 },
    ],
  },
  "Fensterhülle|Anschreiben + bis zu 3 Flyer": {
    hatBroschuere: false,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 248.19, preisPro1000: 168.52, expressProzent: 0.33 },
      { "min": 5001, "max": 10000, fixpreis: 274.824, preisPro1000: 151.536, expressProzent: 0.25 },
      { "min": 10001, "max": 50000, fixpreis: 259.209, preisPro1000: 142.926, expressProzent: 0.23 },
      { "min": 50001, "max": 100000, fixpreis: 243.594, preisPro1000: 134.316 },
    ],
  },
  "Fensterhülle|Anschreiben, bis zu 3 Flyer + Antwortkarte": {
    hatBroschuere: false,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 272.03, preisPro1000: 189.62, expressProzent: 0.37 },
      { "min": 5001, "max": 10000, fixpreis: 274.824, preisPro1000: 159.456, expressProzent: 0.29 },
      { "min": 10001, "max": 50000, fixpreis: 259.209, preisPro1000: 150.396, expressProzent: 0.27 },
      { "min": 50001, "max": 100000, fixpreis: 243.594, preisPro1000: 141.336 },
    ],
  },
  "Fensterhülle|Anschreiben + Broschüre": {
    hatBroschuere: true,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 379.55, preisPro1000: 283.74, expressProzent: 0.29 },
      { "min": 5001, "max": 10000, fixpreis: 274.824, preisPro1000: 141.7944, expressProzent: 0.21 },
      { "min": 10001, "max": 50000, fixpreis: 259.209, preisPro1000: 133.7379, expressProzent: 0.19 },
      { "min": 50001, "max": 100000, fixpreis: 243.594, preisPro1000: 125.6814 },
    ],
  },
  "Fensterhülle|Anschreiben, Broschüre + Antwortkarte": {
    hatBroschuere: true,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 403.39, preisPro1000: 305.96, expressProzent: 0.33 },
      { "min": 5001, "max": 10000, fixpreis: 274.824, preisPro1000: 151.2984, expressProzent: 0.25 },
      { "min": 10001, "max": 50000, fixpreis: 259.209, preisPro1000: 142.7019, expressProzent: 0.23 },
      { "min": 50001, "max": 100000, fixpreis: 243.594, preisPro1000: 134.1054 },
    ],
  },

  "Panorama-Fensterhülle|Anschreiben + bis zu 3 Flyer": {
    hatBroschuere: false,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 298.8, preisPro1000: 243.32, expressProzent: 0.33 },
      { "min": 5001, "max": 10000, fixpreis: 301.224, preisPro1000: 198.8976, expressProzent: 0.25 },
      { "min": 10001, "max": 50000, fixpreis: 284.109, preisPro1000: 187.5966, expressProzent: 0.23 },
      { "min": 50001, "max": 100000, fixpreis: 266.994, preisPro1000: 176.2956 },
    ],
  },
  "Panorama-Fensterhülle|Anschreiben, bis zu 3 Flyer + Antwortkarte": {
    hatBroschuere: false,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 322.64, preisPro1000: 270, expressProzent: 0.37 },
      { "min": 5001, "max": 10000, fixpreis: 301.224, preisPro1000: 214.7376, expressProzent: 0.29 },
      { "min": 10001, "max": 50000, fixpreis: 284.109, preisPro1000: 202.5366, expressProzent: 0.27 },
      { "min": 50001, "max": 100000, fixpreis: 266.994, preisPro1000: 190.3356 },
    ],
  },
  "Panorama-Fensterhülle|Anschreiben + Broschüre": {
    hatBroschuere: true,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 430.16, preisPro1000: 343.08, expressProzent: 0.29 },
      { "min": 5001, "max": 10000, fixpreis: 301.224, preisPro1000: 167.2176, expressProzent: 0.21 },
      { "min": 10001, "max": 50000, fixpreis: 284.109, preisPro1000: 157.7166, expressProzent: 0.19 },
      { "min": 50001, "max": 100000, fixpreis: 266.994, preisPro1000: 148.2156 },
    ],
  },
  "Panorama-Fensterhülle|Anschreiben, Broschüre + Antwortkarte": {
    hatBroschuere: true,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 454, preisPro1000: 369.76, expressProzent: 0.33 },
      { "min": 5001, "max": 10000, fixpreis: 301.224, preisPro1000: 183.0576, expressProzent: 0.25 },
      { "min": 10001, "max": 50000, fixpreis: 284.109, preisPro1000: 172.6566, expressProzent: 0.23 },
      { "min": 50001, "max": 100000, fixpreis: 266.994, preisPro1000: 162.2556 },
    ],
  },

  "Hülle ohne Fenster|bis zu 3 Flyer": {
    hatBroschuere: false,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 207.04, preisPro1000: 112.64, expressProzent: 0.33 },
      { "min": 5001, "max": 10000, fixpreis: 248.424, preisPro1000: 106.9728, expressProzent: 0.25 },
      { "min": 10001, "max": 50000, fixpreis: 234.309, preisPro1000: 100.8948, expressProzent: 0.23 },
      { "min": 50001, "max": 100000, fixpreis: 220.194, preisPro1000: 94.8168 },
    ],
  },
  "Hülle ohne Fenster|bis zu 3 Flyer + Antwortkarte": {
    hatBroschuere: false,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 230.88, preisPro1000: 133.74, expressProzent: 0.37 },
      { "min": 5001, "max": 10000, fixpreis: 248.424, preisPro1000: 114.8928, expressProzent: 0.29 },
      { "min": 10001, "max": 50000, fixpreis: 234.309, preisPro1000: 108.3648, expressProzent: 0.27 },
      { "min": 50001, "max": 100000, fixpreis: 220.194, preisPro1000: 101.8368 },
    ],
  },
  "Hülle ohne Fenster|Broschüre": {
    hatBroschuere: true,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 357, preisPro1000: 226.74, expressProzent: 0.29 },
      { "min": 5001, "max": 10000, fixpreis: 274.824, preisPro1000: 95.6472, expressProzent: 0.21 },
      { "min": 10001, "max": 50000, fixpreis: 259.209, preisPro1000: 90.2127, expressProzent: 0.19 },
      { "min": 50001, "max": 100000, fixpreis: 243.594, preisPro1000: 84.7782 },
    ],
  },
  "Hülle ohne Fenster|Broschüre + Antwortkarte": {
    hatBroschuere: true,
    staffeln: [
      { "min": 1, "max": 5000, fixpreis: 380.83, preisPro1000: 248.96, expressProzent: 0.33 },
      { "min": 5001, "max": 10000, fixpreis: 274.824, preisPro1000: 105.1512, expressProzent: 0.25 },
      { "min": 10001, "max": 50000, fixpreis: 259.209, preisPro1000: 99.1767, expressProzent: 0.23 },
      { "min": 50001, "max": 100000, fixpreis: 243.594, preisPro1000: 93.2022 },
    ],
  },
};
