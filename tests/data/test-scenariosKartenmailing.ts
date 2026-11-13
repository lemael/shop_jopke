import type {
  Kartenmailing,
  TypLocalKartenmailing,
  TypOnlineKartenmailing,
} from '../types/Kartenmailing';

export interface TestScenarioKartenmailing {
  name: string;
  type: TypLocalKartenmailing;
  typeOnline: TypOnlineKartenmailing;
  quantite: number;
  kartenmailing: Kartenmailing;
}

/**
 * Une variante = une ligne de tarife.xlsx (Produkt-Nummer).
 * papier : libellé complet du bouton, identique en local et sur jopke.de.
 */
interface Variante {
  produkt: string;
  nummer: string;
  type: TypLocalKartenmailing;
  typeOnline: TypOnlineKartenmailing;
  kartenmailing: Kartenmailing;
  quantites: number[];
}

// Papiers et Veredelungen proposés pour toutes les cartes.
const CHROMOKARTON_260_OHNE: Kartenmailing = {
  papier: '260 g/m² Chromokarton mit 1,4-fachem Volumen VS glänzend RS matt',
  veredelung: 'Ohne',
};
const BILDERDRUCK_300_GLAENZEND_OHNE: Kartenmailing = {
  papier: '300 g/m² Bilderdruck glänzend',
  veredelung: 'Ohne',
};
const BILDERDRUCK_350_MATT_UV_LACK: Kartenmailing = {
  papier: '350 g/m² Bilderdruck matt',
  veredelung: 'UV-Lack Vorderseite',
};
// La Bestseller n'a qu'une seule combinaison possible.
const BESTSELLER_300_UV_LACK: Kartenmailing = {
  papier: '300 g/m² Chromokarton mit 1,4-fachem Volumen VS glänzend RS matt',
  veredelung: 'UV-Lack Vorderseite',
};

// Quantités du rapport « Kalkulator-Vergleich Runde 1 » :
// variante 1 sur 10 quantités, variantes 2 et 3 sur 4 quantités.
const QUANTITES_VARIANTE_1 = [500, 1000, 1234, 5000, 5001, 10000, 10001, 20000, 50000, 100000];
const QUANTITES_VARIANTES_2_3 = [500, 2500, 20000, 100000];

const DIN_LANG_98 = { type: 'post_din_lan_98', typeOnline: 'postkarte-din-lang-210x98' } as const;
const MAXI = { type: 'post_maxi', typeOnline: 'postkarte-maxi-235x125' } as const;
const DIN_A4 = { type: 'post_din_a4', typeOnline: 'postkarte-din-a4-297x210' } as const;

const variantenRapport: Variante[] = [
  // Postkarte DIN-Lang 210x98 (Versandklasse A)
  { produkt: 'Postkarte DIN-Lang 210x98', nummer: '300.101', ...DIN_LANG_98, kartenmailing: CHROMOKARTON_260_OHNE, quantites: QUANTITES_VARIANTE_1 },
  { produkt: 'Postkarte DIN-Lang 210x98', nummer: '300.141', ...DIN_LANG_98, kartenmailing: BILDERDRUCK_300_GLAENZEND_OHNE, quantites: QUANTITES_VARIANTES_2_3 },
  { produkt: 'Postkarte DIN-Lang 210x98', nummer: '300.171', ...DIN_LANG_98, kartenmailing: BILDERDRUCK_350_MATT_UV_LACK, quantites: QUANTITES_VARIANTES_2_3 },

  // Postkarte Maxi 235x125 (Versandklasse A)
  { produkt: 'Postkarte Maxi 235x125', nummer: '320.101', ...MAXI, kartenmailing: CHROMOKARTON_260_OHNE, quantites: QUANTITES_VARIANTE_1 },
  { produkt: 'Postkarte Maxi 235x125', nummer: '320.141', ...MAXI, kartenmailing: BILDERDRUCK_300_GLAENZEND_OHNE, quantites: QUANTITES_VARIANTES_2_3 },
  { produkt: 'Postkarte Maxi 235x125', nummer: '320.171', ...MAXI, kartenmailing: BILDERDRUCK_350_MATT_UV_LACK, quantites: QUANTITES_VARIANTES_2_3 },

  // Postkarte DIN A4 297x210 (Versandklasse D)
  { produkt: 'Postkarte DIN A4 297x210', nummer: '350.101', ...DIN_A4, kartenmailing: CHROMOKARTON_260_OHNE, quantites: QUANTITES_VARIANTE_1 },
  { produkt: 'Postkarte DIN A4 297x210', nummer: '350.141', ...DIN_A4, kartenmailing: BILDERDRUCK_300_GLAENZEND_OHNE, quantites: QUANTITES_VARIANTES_2_3 },
  { produkt: 'Postkarte DIN A4 297x210', nummer: '350.171', ...DIN_A4, kartenmailing: BILDERDRUCK_350_MATT_UV_LACK, quantites: QUANTITES_VARIANTES_2_3 },
];

// Cartes absentes du rapport : un contrôle à 500 Stück chacune.
const variantesHorsRapport: Variante[] = [
  { produkt: 'Postkarte DIN-Lang 210x105', nummer: 'hors-rapport', type: 'post_din_lan_105', typeOnline: 'postkarte-din-lang-210x105', kartenmailing: CHROMOKARTON_260_OHNE, quantites: [500] },
  { produkt: 'Postkarte Bestseller Maxi', nummer: 'hors-rapport', type: 'postkarte_maxi', typeOnline: 'unser-bestseller-karte-maxi', kartenmailing: BESTSELLER_300_UV_LACK, quantites: [500] },
  { produkt: 'Postkarte DIN A6 148x105', nummer: 'hors-rapport', type: 'post_din_a6', typeOnline: 'postkarte-din-a6-148x105', kartenmailing: CHROMOKARTON_260_OHNE, quantites: [500] },
  { produkt: 'Postkarte DIN A5 210x148', nummer: 'hors-rapport', type: 'post_din_a5', typeOnline: 'postkarte-din-a5-210x148', kartenmailing: CHROMOKARTON_260_OHNE, quantites: [500] },
];

export const scenarios: TestScenarioKartenmailing[] = [...variantenRapport, ...variantesHorsRapport].flatMap(
  variante =>
    variante.quantites.map(quantite => ({
      name: `${quantite} Stück – ${variante.produkt} ${variante.nummer} – ${variante.kartenmailing.papier.match(/^\d+ g\/m² \S+/)?.[0]} – ${variante.kartenmailing.veredelung}`,
      type: variante.type,
      typeOnline: variante.typeOnline,
      quantite,
      kartenmailing: variante.kartenmailing,
    }))
);
