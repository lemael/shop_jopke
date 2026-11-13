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

const standard: Kartenmailing = {
  papier: '260 g/m² Chromokarton mit 1,4-fachem Volumen VS glänzend RS matt',
  veredelung: 'Ohne',
};

// La Bestseller n'a qu'une seule combinaison possible.
const bestseller: Kartenmailing = {
  papier: '300 g/m² Chromokarton mit 1,4-fachem Volumen VS glänzend RS matt',
  veredelung: 'UV-Lack Vorderseite',
};

const produits: {
  nom: string;
  type: TypLocalKartenmailing;
  typeOnline: TypOnlineKartenmailing;
  kartenmailing: Kartenmailing;
}[] = [
  { nom: 'DIN-Lang 210x98',  type: 'post_din_lan_98',  typeOnline: 'postkarte-din-lang-210x98',   kartenmailing: standard },
  { nom: 'DIN-Lang 210x105', type: 'post_din_lan_105', typeOnline: 'postkarte-din-lang-210x105',  kartenmailing: standard },
  { nom: 'Maxi 235x125',     type: 'post_maxi',        typeOnline: 'postkarte-maxi-235x125',      kartenmailing: standard },
  { nom: 'Bestseller Maxi',  type: 'postkarte_maxi',   typeOnline: 'unser-bestseller-karte-maxi', kartenmailing: bestseller },
  { nom: 'DIN A6 148x105',   type: 'post_din_a6',      typeOnline: 'postkarte-din-a6-148x105',    kartenmailing: standard },
  { nom: 'DIN A5 210x148',   type: 'post_din_a5',      typeOnline: 'postkarte-din-a5-210x148',    kartenmailing: standard },
  { nom: 'DIN A4 297x210',   type: 'post_din_a4',      typeOnline: 'postkarte-din-a4-297x210',    kartenmailing: standard },
];

const creerScenario = (
  produit: (typeof produits)[number],
  quantite: number
): TestScenarioKartenmailing => ({
  name: `${quantite} Stück – Postkarte ${produit.nom} – ${produit.kartenmailing.papier.match(/^\d+ g\/m²/)?.[0]} – ${produit.kartenmailing.veredelung}`,
  type: produit.type,
  typeOnline: produit.typeOnline,
  quantite,
  kartenmailing: produit.kartenmailing,
});

// 1. Tous les produits à 500 Stück.
const scenariosParProduit = produits.map(produit => creerScenario(produit, 500));

// 2. Une carte (DIN A6) sur les quantités du rapport « Kalkulator-Vergleich » :
//    sauts de tranche 5.000 / 10.000 / 50.000. 100.000 est exclu (plantage connu côté local).
const quantitesStaffel = [1000, 1234, 5000, 5001, 10000, 10001, 20000, 50000];
const dinA6 = produits.find(produit => produit.type === 'post_din_a6')!;
const scenariosParQuantite = quantitesStaffel.map(quantite => creerScenario(dinA6, quantite));

export const scenarios: TestScenarioKartenmailing[] = [
  ...scenariosParProduit,
  ...scenariosParQuantite,
];
