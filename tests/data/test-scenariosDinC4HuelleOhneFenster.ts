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

const grammaturenBrochure = ['90 g/m²', '115 g/m²', '135 g/m²'];

const scenariosGrammaturBrochure: TestScenarioDinC4HuelleOhneFenster[] = grammaturenBrochure.map(grammatur => ({
  name: `500 Stück – Broschüre – Grammatur Inhalt/Umschlag ${grammatur} – Umfang ${brochure.umfang}`,
  type: 'Hülle ohne Fenster',
  choix: 'brochure',
  ausstattung: 'Broschüre',
  quantite: 500,
  huelle,
  brochure: { ...brochure, grammatur },
}));

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

// Toutes les tranches de prix (1–5.000, 5.001–10.000, 10.001–50.000, 50.001–100.000)
// et les zones de Porto (Easy, Aufzahlung auf 5.000, Dialogpost), comme dans le
// rapport « Kalkulator-Vergleich ».
const QUANTITES_VARIANTE_1 = [500, 1000, 1234, 5000, 5001, 10000, 10001, 20000, 50000, 100000];

const scenariosStaffelFlyer: TestScenarioDinC4HuelleOhneFenster[] = QUANTITES_VARIANTE_1.map(quantite => ({
  name: `${quantite} Stück – Staffel – 1 Flyer`,
  type: 'Hülle ohne Fenster',
  choix: 'flyer',
  ausstattung: 'bis zu 3 Flyer',
  quantite,
  huelle,
  flyer: { ...flyer, anzahl: 1 },
}));

// Maximalmenge des configurations avec Broschüre dans tarife.xlsx (140.131 / 140.531) :
// jopke.de refuse au-delà de 20.000 Stück.
const MAXIMALMENGE_BROSCHUERE = 20000;

const scenariosStaffelBrochure: TestScenarioDinC4HuelleOhneFenster[] = QUANTITES_VARIANTE_1
  .filter(quantite => quantite <= MAXIMALMENGE_BROSCHUERE)
  .map(quantite => ({
  name: `${quantite} Stück – Staffel – Broschüre ${brochure.umfang}`,
  type: 'Hülle ohne Fenster',
  choix: 'brochure',
  ausstattung: 'Broschüre',
  quantite,
  huelle,
  brochure,
}));

export const scenarios: TestScenarioDinC4HuelleOhneFenster[] = [
  ...scenariosFlyer,
  ...scenariosGrammaturBrochure,
  ...scenariosFarbigkeitHuelle,
  ...scenariosUmfangFlyer,
  ...scenariosGrammaturFlyer,
  ...scenariosOberflaecheFlyer,
  ...scenariosStaffelFlyer,
  ...scenariosStaffelBrochure,
];
