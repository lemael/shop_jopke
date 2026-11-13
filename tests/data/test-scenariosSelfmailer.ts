
import type { Selfmailer, TypLocalSelfmailer, TypOnlineSelfmailer } from '../types/Selfmailer';

export interface TestScenarioSelfmailer {
  name: string;
  type: TypLocalSelfmailer;
  typeOnline: TypOnlineSelfmailer;
  quantite: number;
  selfmailer: Selfmailer;
}

/**
 * Une variante = une ligne de tarife.xlsx (Produkt-Nummer).
 * Libellés des boutons du configurateur local :
 *   - umfang    : "Umfang Endformat"   (ex. "4 Seiten 210 x 105 mm")
 *   - grammatur : "Grammatur Papier"   (ex. "170 g/m² Bilderdruck")
 * Les helpers online en déduisent les libellés jopke.de ("4 Seiten", "170 g/m²").
 * perforation : 'Ohne' par défaut ; l'étape est sautée si le produit n'en a pas.
 */
interface Variante {
  produkt: string;
  nummer: string;
  type: TypLocalSelfmailer;
  typeOnline: TypOnlineSelfmailer;
  umfang: string;
  grammatur: string;
  perforation: string;
  quantites: number[];
}

// Quantités du rapport « Kalkulator-Vergleich Runde 1 » :
// variante 1 sur 10 quantités, variantes 2 et 3 sur 4 quantités.
const QUANTITES_VARIANTE_1 = [500, 1000, 1234, 5000, 5001, 10000, 10001, 20000, 50000, 100000];
const QUANTITES_VARIANTES_2_3 = [500, 2500, 20000, 100000];

const LEVI = { type: 'levi', typeOnline: 'din-lang-selfmailer-levi' } as const;
const INATA = { type: 'inata', typeOnline: 'maxi-selfmailer-inata' } as const;
const ALBA = { type: 'klappe_alba', typeOnline: 'maxi-selfmailer-mit-klappe-alba' } as const;
const MIKRO = { type: 'mikro', typeOnline: 'din-a6-selfmailer-mikro' } as const;
const MEGALO = { type: 'megalo', typeOnline: 'din-a5-selfmailer-megalo' } as const;
const ANDIGO = { type: 'andigo', typeOnline: 'din-lang-poster-selfmailer-andigo' } as const;
const BESTSELLER = { type: 'bestseller_levi', typeOnline: 'unser-bestseller-levi' } as const;

const varianten: Variante[] = [
  // DIN-Lang-Selfmailer LEVI
  { produkt: 'LEVI', nummer: '200.101', ...LEVI, umfang: '4 Seiten 210 x 105 mm', grammatur: '170 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTE_1 },
  { produkt: 'LEVI', nummer: '200.301', ...LEVI, umfang: '8 Seiten 210 x 100 mm', grammatur: '135 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTES_2_3 },

  // Maxi-Selfmailer INATA (pas de Perforation)
  { produkt: 'INATA', nummer: '210.101', ...INATA, umfang: '4 Seiten 235 x 125 mm', grammatur: '170 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTE_1 },
  { produkt: 'INATA', nummer: '210.211', ...INATA, umfang: '6 Seiten 235 x 125 mm', grammatur: '170 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTES_2_3 },
  { produkt: 'INATA', nummer: '210.301', ...INATA, umfang: '8 Seiten 235 x 125 mm', grammatur: '135 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTES_2_3 },

  // Maxi-Selfmailer mit Klappe ALBA
  { produkt: 'ALBA', nummer: '220.101', ...ALBA, umfang: '6 Seiten + Klappe 235 x 125 mm', grammatur: '135 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTE_1 },
  { produkt: 'ALBA', nummer: '220.201', ...ALBA, umfang: '8 Seiten + Klappe 235 x 125 mm', grammatur: '135 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTES_2_3 },
  { produkt: 'ALBA', nummer: '220.231', ...ALBA, umfang: '8 Seiten + Klappe 235 x 125 mm', grammatur: '250 g/m² Bilderdruck', perforation: 'parallel zur letzten Seite', quantites: QUANTITES_VARIANTES_2_3 },

  // DIN-A6-Selfmailer MIKRO
  { produkt: 'MIKRO', nummer: '230.101', ...MIKRO, umfang: '4 Seiten 148 x 105 mm', grammatur: '170 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTE_1 },
  { produkt: 'MIKRO', nummer: '230.211', ...MIKRO, umfang: '6 Seiten 148 x 105 mm', grammatur: '170 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTES_2_3 },
  { produkt: 'MIKRO', nummer: '230.311', ...MIKRO, umfang: '8 Seiten 148 x 105 mm', grammatur: '170 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTES_2_3 },

  // DIN-A5-Selfmailer MEGALO (Versandklasse D, pas de Perforation)
  { produkt: 'MEGALO', nummer: '240.101', ...MEGALO, umfang: '4 Seiten 210 x 148 mm', grammatur: '170 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTE_1 },
  { produkt: 'MEGALO', nummer: '240.221', ...MEGALO, umfang: '6 Seiten 210 x 148 mm', grammatur: '250 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTES_2_3 },
  { produkt: 'MEGALO', nummer: '240.321', ...MEGALO, umfang: '8 Seiten 210 x 148 mm', grammatur: '250 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTES_2_3 },

  // DIN-Lang-Poster-Selfmailer ANDIGO (pas de Perforation)
  { produkt: 'ANDIGO', nummer: '250.101', ...ANDIGO, umfang: '12 Seiten 210 x 100 mm', grammatur: '115 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTE_1 },
  { produkt: 'ANDIGO', nummer: '250.111', ...ANDIGO, umfang: '12 Seiten 210 x 100 mm', grammatur: '135 g/m² Bilderdruck', perforation: 'Ohne', quantites: QUANTITES_VARIANTES_2_3 },

  // Unser Bestseller LEVI (290.101) : le rapport le teste à la fois comme 3e variante
  // de LEVI (500, 2.500, 20.000, 100.000) et comme produit Bestseller
  // (500, 1.000, 5.000, 20.000, 100.000). C'est le même article : on teste l'union.
  { produkt: 'Bestseller LEVI', nummer: '290.101', ...BESTSELLER, umfang: '6 Seiten 210 x 100 mm', grammatur: '135 g/m² Bilderdruck', perforation: 'Ohne', quantites: [500, 1000, 2500, 5000, 20000, 100000] },
];

export const scenarios: TestScenarioSelfmailer[] = varianten.flatMap(variante =>
  variante.quantites.map(quantite => ({
    name: `${quantite} Stück – ${variante.produkt} ${variante.nummer} – ${variante.umfang} – ${variante.grammatur} – Perforation ${variante.perforation}`,
    type: variante.type,
    typeOnline: variante.typeOnline,
    quantite,
    selfmailer: {
      type: variante.type,
      umfang: variante.umfang,
      grammatur: variante.grammatur,
      perforation: variante.perforation,
    },
  }))
);
