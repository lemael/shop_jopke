import type { Flyer } from '../types/Flyer';
import type { Brochure } from '../types/Brochure';
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
  flyer?: Flyer;
  brochure?: Brochure;
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

const brochure: Brochure = {
  umfang: '8(4+4)Seiten',
  farbigkeit: '4/4-farbig Euroskala',
  grammatur: '135 g/m²',
  oberflaeche: 'matt',
  isChecked: true,
};

const scenariosFlyer: TestScenario[] = ([1, 2, 3] as const).map(anzahl => ({
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

const scenarioBrochure: TestScenario = {
  name: '500 Stück – Broschüre',
  type: 'Fensterhülle',
  choix: 'brochure',
  ausstattung: 'Anschreiben + Broschüre',
  quantite: 500,
  huelle,
  anschreiben,
  brochure,
};

const farbigkeitenHuelle = [
  'unbedruckt',
  '1/0-farbig Schwarz',
  '4/0-farbig Euroskala',
  '4/4-farbig Euroskala',
];

const scenariosFarbigkeitHuelle: TestScenario[] = farbigkeitenHuelle.map(farbigkeit => ({
  name: `500 Stück – 1 Flyer – Hülle ${farbigkeit}`,
  type: 'Fensterhülle',
  choix: 'flyer',
  ausstattung: 'Anschreiben + bis zu 3 Flyer',
  quantite: 500,
  huelle: { farbigkeit },
  anschreiben,
  flyer: { ...flyer, anzahl: 1 },
}));

const grammaturenAnschreiben = ['80 g/m²', '90 g/m²'];

const scenariosGrammaturAnschreiben: TestScenario[] = grammaturenAnschreiben.map(grammatur => ({
  name: `500 Stück – 1 Flyer – Anschreiben ${grammatur}`,
  type: 'Fensterhülle',
  choix: 'flyer',
  ausstattung: 'Anschreiben + bis zu 3 Flyer',
  quantite: 500,
  huelle,
  anschreiben: { ...anschreiben, grammatur },
  flyer: { ...flyer, anzahl: 1 },
}));

const farbigkeitenAnschreiben = [
  '4/0-farbig Euroskala',
  '4/4-farbig Euroskala',
  '4/1-farbig Euroskala/Schwarz',
  '1/0-farbig Schwarz',
  '1/1-farbig Schwarz',
];

const scenariosFarbigkeitAnschreiben: TestScenario[] = farbigkeitenAnschreiben.map(farbigkeit => ({
  name: `500 Stück – 1 Flyer – Anschreiben ${farbigkeit}`,
  type: 'Fensterhülle',
  choix: 'flyer',
  ausstattung: 'Anschreiben + bis zu 3 Flyer',
  quantite: 500,
  huelle,
  anschreiben: { ...anschreiben, farbigkeit },
  flyer: { ...flyer, anzahl: 1 },
}));

const umfaengeFlyer = ['2', '4', '6', '8'];

const scenariosUmfangFlyer: TestScenario[] = umfaengeFlyer.map(umfang => ({
  name: `500 Stück – 1 Flyer – Umfang ${umfang} Seiten`,
  type: 'Fensterhülle',
  choix: 'flyer',
  ausstattung: 'Anschreiben + bis zu 3 Flyer',
  quantite: 500,
  huelle,
  anschreiben,
  flyer: { ...flyer, umfang, anzahl: 1 },
}));

const grammaturenFlyer = ['135 g/m²', '170 g/m²', '250 g/m²'];

const scenariosGrammaturFlyer: TestScenario[] = grammaturenFlyer.map(grammatur => ({
  name: `500 Stück – 1 Flyer – Flyer ${grammatur}`,
  type: 'Fensterhülle',
  choix: 'flyer',
  ausstattung: 'Anschreiben + bis zu 3 Flyer',
  quantite: 500,
  huelle,
  anschreiben,
  flyer: { ...flyer, grammatur, anzahl: 1 },
}));

const oberflaechenFlyer = ['matt', 'glänzend'];

const scenariosOberflaecheFlyer: TestScenario[] = oberflaechenFlyer.map(oberflaeche => ({
  name: `500 Stück – 1 Flyer – Oberfläche ${oberflaeche}`,
  type: 'Fensterhülle',
  choix: 'flyer',
  ausstattung: 'Anschreiben + bis zu 3 Flyer',
  quantite: 500,
  huelle,
  anschreiben,
  flyer: { ...flyer, oberflaeche, anzahl: 1 },
}));

export const scenarios: TestScenario[] = [
  ...scenariosFlyer,
  scenarioBrochure,
  ...scenariosFarbigkeitHuelle,
  ...scenariosGrammaturAnschreiben,
  ...scenariosFarbigkeitAnschreiben,
  ...scenariosUmfangFlyer,
  ...scenariosGrammaturFlyer,
  ...scenariosOberflaecheFlyer,
];
