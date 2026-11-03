import { type Page } from '@playwright/test';

export async function extraireInformationsPrix(page: Page) {
  const resultat = await page.locator('dl').evaluateAll(listes => {
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

  const optionsTraitement = await page
    .getByRole('button', { name: /Standard|Express/ })
    .evaluateAll(boutons =>
      boutons.map(bouton => ({
        option: bouton.querySelector('span:first-child')?.textContent?.trim() ?? '',
        prix: bouton.querySelector('span:nth-child(2)')?.textContent?.trim() ?? '',
      }))
    );

  const prixExpress = optionsTraitement.find(option => option.option === 'Express')?.prix;
  if (!prixExpress) {
    throw new Error('Prix "Express" introuvable dans le récapitulatif local.');
  }

  resultat.Express = prixExpress;

  return resultat;
}