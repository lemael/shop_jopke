import { type Page } from '@playwright/test';

export async function extraireInformationsPrix(page: Page) {
  return await page.locator('dl').evaluateAll(listes => {
    const resultat: Record<string, string> = {};

    for (const liste of listes) {
      const lignes = liste.querySelectorAll(':scope > div');

      for (const ligne of lignes) {
        const dt = ligne.querySelector(':scope > dt');
        const dd = ligne.querySelector(':scope > dd');

        if (!dt || !dd) continue;

        const libelle = dt.textContent?.trim().replace(/:$/, '') ?? '';
        const valeur = dd.textContent?.trim() ?? '';

        if (libelle && valeur) {
          resultat[libelle] = valeur;
        }
      }
    }

    return resultat;
  });
}