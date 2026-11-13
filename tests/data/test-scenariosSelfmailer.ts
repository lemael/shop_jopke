
import type { Selfmailer, TypLocalSelfmailer, TypOnlineSelfmailer } from '../types/Selfmailer';

export interface TestScenarioSelfmailer {
  name: string;
  type: TypLocalSelfmailer;
  typeOnline: TypOnlineSelfmailer;
  quantite: number;
  selfmailer: Selfmailer;
}

const selfmailer: Selfmailer = {
  type: 'levi',
  umfang: '4 Seiten 210 x 105 mm',
  grammatur: '170 g/m² Bilderdruck',
  perforation: 'Ohne',
};

// Progression fine entre 500 et 1000 Stück pour observer l'évolution de l'écart de Porto
// (forfait fixe 10,04 € + 1 Ct/Stück en moins côté nouveau calculateur).
const quantites = [500, 600, 700, 800, 900, 1000];

export const scenarios: TestScenarioSelfmailer[] = quantites.map(quantite => ({
  name: `${quantite} Stück – Levi – 4 Seiten 210 x 105 mm`,
  type: 'levi' as const,
  typeOnline: 'din-lang-selfmailer-levi' as const,
  quantite,
  selfmailer,
}));
