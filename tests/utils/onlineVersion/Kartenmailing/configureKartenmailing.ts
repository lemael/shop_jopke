import type { Page } from '@playwright/test';
import type { Kartenmailing } from '../../../types/Kartenmailing';

/**
 * Clique sur une option si l'étape existe. Certains produits (ex. Bestseller)
 * n'ont qu'une seule valeur possible : l'étape peut alors être sautée et on
 * arrive directement sur l'Übersicht.
 */
async function choisirOption(page: Page, etape: string, texte: string): Promise<void> {
  console.log(`===== ${etape.toUpperCase()} =====`);

  if (page.url().includes('order-overview')) {
    console.log(`Aucune étape ${etape} pour ce produit, déjà sur l’Übersicht.`);
    return;
  }

  const bouton = page.getByRole('button', { name: texte, exact: true });

  await bouton.waitFor({ state: 'visible' });
  await bouton.click();
  await page.waitForLoadState('domcontentloaded').catch(() => {});

  console.log(`${etape} sélectionné :`, texte);
  console.log(`URL après le choix de ${etape} :`, page.url());
  console.log(`===== FIN DE L’ÉTAPE ${etape.toUpperCase()} =====`);
}

async function configurePapier(page: Page, kartenmailing: Kartenmailing): Promise<void> {
  await choisirOption(page, 'Papier', kartenmailing.papier);
}

async function configureVeredelung(page: Page, kartenmailing: Kartenmailing): Promise<void> {
  await choisirOption(page, 'Veredelung', kartenmailing.veredelung);
}

export { configurePapier, configureVeredelung };
