
import type { Page } from '@playwright/test';
import type { PrixOnline, RecapitulationOnline } from '../../../types/typeExtractionSelfmailer';


async function extraireRecapitulation(
  page: Page
): Promise<RecapitulationOnline> {

  await page.waitForURL('**/order-overview');
  await page.getByText(/Gesamt\s*\(netto\)/).waitFor({ state: 'visible' });

  console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

  const textePage = (await page.locator('body').innerText())
    .replace(/\s+/g, ' ')
    .trim();

  // ==========================================
  // 1. EXTRAIRE LES PRIX
  // ==========================================

  const extrairePrix = (regex: RegExp, nom: string): string => {
    const resultat = textePage.match(regex);

    if (!resultat?.[1]) {
      throw new Error(`Prix "${nom}" introuvable dans la récapitulation.`);
    }

    return resultat[1];
  };
  const extrairePrixTraitement = async (nom: string): Promise<string> => {
    const label = page.locator(
      `label[for="delivery-selection-${nom.toLowerCase()}"]`
    );
    const valeur = label
      .locator('xpath=..')
      .locator('xpath=following-sibling::dd[1]');

    const texte = await valeur.innerText();

    const resultat = texte.match(/([\d.]+,\d{2})\s*€/);

    if (!resultat?.[1]) {
      throw new Error(`Prix "${nom}" introuvable.`);
    }

    return resultat[1];
  };
  const extraireValeur = (regex: RegExp, nom: string): string => {
    const resultat = textePage.match(regex);

    if (!resultat?.[1]) {
      throw new Error(`Valeur "${nom}" introuvable.`);
    }

    return resultat[1];
  };
  const prix: PrixOnline = {
  // Le nom du produit varie selon le type de Selfmailer (LEVI, INATA, ...) :
  // on capture le prix qui précède directement la ligne "Porto:".
  produit: extrairePrix(
    /([\d.]+,\d{2})\s*€\s*Porto:/,
    'Produit'
  ),

  standard: await extrairePrixTraitement('Standard'),

  express: await extrairePrixTraitement('Express'),

  porto: extrairePrix(
    /Porto:\s*([\d.]+,\d{2})\s*€/,
    'Porto'
  ),

  totalNet: extrairePrix(
    /Gesamt\s*\(netto\):\s*([\d.]+,\d{2})\s*€/,
    'Gesamt netto'
  ),

  tva: extrairePrix(
    /zzgl\.\s*19%\s*MwSt\.?:\s*([\d.]+,\d{2})\s*€/,
    'TVA'
  ),

  totalBrut: extrairePrix(
    /Gesamt\s*\(brutto\):\s*([\d.]+,\d{2})\s*€/,
    'Gesamt brutto'
  ),

  gewichtProSendung: extraireValeur(
    /Gewicht pro Sendung:\s*(?:ca\.\s*)?([\d.,]+)\s*g/,
    'Gewicht pro Sendung'
  ),

  gesamtgewicht: extraireValeur(
    /Gesamtgewicht:\s*(?:ca\.\s*)?([\d.,]+)\s*kg/,
    'Gesamtgewicht'
  ),
};
  console.log('===== PRIX =====');
  console.table(prix);


  // ==========================================
  // 2. EXTRAIRE LA QUANTITÉ
  // ==========================================

  // Le séparateur de milliers allemand ("1.000 Stück") fait partie du nombre capturé,
  // afin de correspondre au format affiché par le configurateur local.
  const quantite = textePage.match(
    /Auflage:\s*([\d.]+)\s*Stück/
  )?.[1];

  if (!quantite) {
    throw new Error('Quantité introuvable dans la récapitulation.');
  }

  console.log('Auflage :', quantite);


  // ==========================================
  // 3. EXTRAIRE LE NOM DU PRODUIT ET SES CARACTÉRISTIQUES
  // ==========================================

  // Le Selfmailer est un produit unique (pas de sous-produits Hülle/Anschreiben/
  // Broschüre comme pour le DIN-C4-Mailing) : toutes ses caractéristiques sont
  // listées dans le bloc "Ihre aktuelle Konfiguration".
  const nomProduit = (
    await page.locator('.current .name strong').innerText()
  ).trim();

  const caracteristiques: Record<string, string> = await page
    .locator('.current')
    .evaluate((bloc) => {
      const resultat: Record<string, string> = {};

      for (const ligne of bloc.querySelectorAll(':scope .row')) {
        const headline = ligne.querySelector(':scope .headline');
        const colonnes = ligne.querySelectorAll(':scope > .col');

        if (!headline || colonnes.length < 2) continue;

        const libelle = headline.textContent?.trim().replace(/:$/, '') ?? '';
        const valeur =
          colonnes[colonnes.length - 1].textContent?.replace(/\s+/g, ' ').trim() ?? '';

        if (libelle && valeur) {
          resultat[libelle] = valeur;
        }
      }

      return resultat;
    });

  console.log('===== PRODUIT ET CARACTÉRISTIQUES =====');
  console.log(nomProduit, JSON.stringify(caracteristiques, null, 2));


  // ==========================================
  // 4. CONSTRUIRE L'OBJET DE RÉCAPITULATION
  // ==========================================

  const recapOnline: RecapitulationOnline = {
    prix,
    quantite,
    nomProduit,
    caracteristiques,
  };

  console.log('===== FIN DE L’EXTRACTION =====');

  return recapOnline;
}

export { extraireRecapitulation };
