import type { Flyer } from '../types/Flyer';
import type { Brochure } from '../types/Brochure';
import type { Huelle, TypHuelle } from '../types/Huelle';
import type { ChoixPiecesJointes } from '../pages/online/OnlineConfiguratorPageDin-c4-Mailing';

export interface TestScenarioDinC4HuelleOhneFenster {
  name: string;
  type: TypHuelle;
  choix: ChoixPiecesJointes;
  ausstattung: string;
  quantite: number;
  huelle: Huelle;
  flyer?: Flyer;
  brochure?: Brochure;
}

const huelle: Huelle = {
  farbigkeit: '1/1-farbig Schwarz',
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

const scenariosFlyer: TestScenarioDinC4HuelleOhneFenster[] = ([1, 2, 3] as const).map(anzahl => ({
  name: `500 Stück – ${anzahl} Flyer`,
  type: 'Hülle ohne Fenster',
  choix: 'flyer',
  ausstattung: 'bis zu 3 Flyer',
  quantite: 500,
  huelle,
  flyer: {
    ...flyer,
    anzahl,
  },
}));

const scenarioBrochure: TestScenarioDinC4HuelleOhneFenster = {
  name: '500 Stück – Broschüre',
  type: 'Hülle ohne Fenster',
  choix: 'brochure',
  ausstattung: 'Broschüre',
  quantite: 500,
  huelle,
  brochure,
};

const farbigkeitenHuelle = [
  'unbedruckt',
  '1/0-farbig Schwarz',
  '4/0-farbig Euroskala',
  '4/4-farbig Euroskala',
];

const scenariosFarbigkeitHuelle: TestScenarioDinC4HuelleOhneFenster[] = farbigkeitenHuelle.map(farbigkeit => ({
  name: `500 Stück – 1 Flyer – Hülle ${farbigkeit}`,
  type: 'Hülle ohne Fenster',
  choix: 'flyer',
  ausstattung: 'bis zu 3 Flyer',
  quantite: 500,
  huelle: { farbigkeit },
  flyer: { ...flyer, anzahl: 1 },
}));




const umfaengeFlyer = ['2', '4', '6', '8'];

const scenariosUmfangFlyer: TestScenarioDinC4HuelleOhneFenster[] = umfaengeFlyer.map(umfang => ({
  name: `500 Stück – 1 Flyer – Umfang ${umfang} Seiten`,
  type: 'Hülle ohne Fenster',
  choix: 'flyer',
  ausstattung: 'bis zu 3 Flyer',
  quantite: 500,
  huelle,
  flyer: { ...flyer, umfang, anzahl: 1 },
}));

const grammaturenFlyer = ['135 g/m²', '170 g/m²', '250 g/m²'];

const scenariosGrammaturFlyer: TestScenarioDinC4HuelleOhneFenster[] = grammaturenFlyer.map(grammatur => ({
  name: `500 Stück – 1 Flyer – Flyer ${grammatur}`,
  type: 'Hülle ohne Fenster',
  choix: 'flyer',
  ausstattung: 'bis zu 3 Flyer',
  quantite: 500,
  huelle,
  flyer: { ...flyer, grammatur, anzahl: 1 },
}));

const oberflaechenFlyer = ['matt', 'glänzend'];

const scenariosOberflaecheFlyer: TestScenarioDinC4HuelleOhneFenster[] = oberflaechenFlyer.map(oberflaeche => ({
  name: `500 Stück – 1 Flyer – Oberfläche ${oberflaeche}`,
  type: 'Hülle ohne Fenster',
  choix: 'flyer',
  ausstattung: 'bis zu 3 Flyer',
  quantite: 500,
  huelle,
  flyer: { ...flyer, oberflaeche, anzahl: 1 },
}));

export const scenarios: TestScenarioDinC4HuelleOhneFenster[] = [
  ...scenariosFlyer,
  scenarioBrochure,
  ...scenariosFarbigkeitHuelle,
  ...scenariosUmfangFlyer,
  ...scenariosGrammaturFlyer,
  ...scenariosOberflaecheFlyer,
];
