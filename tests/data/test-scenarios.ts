import type { Flyer } from '../types/Flyer';
import type { Anschreiben } from '../types/Anschreiben';
import type { Huelle, TypHuelle } from '../types/Huelle';
import type { ChoixPiecesJointes } from '../pages/OnlineConfiguratorPage';

export interface TestScenario {
  name: string;
  type: TypHuelle;
  choix: ChoixPiecesJointes;
  ausstattung: string;
  quantite: number;
  huelle: Huelle;
  anschreiben: Anschreiben;
  flyer: Flyer;
}

const huelle: Huelle = {
  farbigkeit: '1/1-farbig Schwarz',
};

const anschreiben: Anschreiben = {
  farbigkeit: '4/0-farbig Euroskala',
  grammatur: '80 g/m²',
  isChecked: true,
};

const flyer: Omit<Flyer, 'anzahl'> = {
  umfang: '2',
  farbigkeit: '4/4-farbig Euroskala',
  grammatur: '135 g/m²',
  oberflaeche: 'matt',
  isChecked: true,
};

export const scenarios: TestScenario[] = ([1, 2, 3] as const).map(anzahl => ({
  name: `500 Stück – ${anzahl} Flyer`,
  type: 'Fensterhülle',
  choix: 'flyer',
  ausstattung: 'Anschreiben + bis zu 3 Flyer',
  quantite: 500,
  huelle,
  anschreiben,
  flyer: {
    ...flyer,
    anzahl,
  },
}));
