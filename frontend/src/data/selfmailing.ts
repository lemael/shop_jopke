import { SelfmailerFamilie } from "@/lib/selfmailerPreis";



const SELFMAILER_PRICE_MATRIX: Partial<Record<SelfmailerFamilie["slug"], Record<number, Record<number, number>>>> = {
  inata: {
    4: { 500: 0.35, 1000: 0.30, 2000: 0.26, 3000: 0.24, 5000: 0.22, 10000: 0.20 },
    6: { 500: 0.42, 1000: 0.37, 2000: 0.33, 3000: 0.30, 5000: 0.27, 10000: 0.24 },
    8: { 500: 0.49, 1000: 0.44, 2000: 0.39, 3000: 0.35, 5000: 0.31, 10000: 0.28 },
  },
};

const GRAMMATUR_FACTOR: Record<string, number> = {
  "135 g/m²": 0.92,
  "170 g/m²": 1,
  "250 g/m²": 1.15,
};

const PORTO_RATE = 0.56;

export { SELFMAILER_PRICE_MATRIX, GRAMMATUR_FACTOR, PORTO_RATE };