import { expect, type Page } from '@playwright/test';
import { Huelle, TypHuelle } from '../types/Huelle';

async function configureFarbigkeitHuelle(page: Page, huelle: Huelle): Promise<void> {
  const couleur = page.locator(
    `button[name="color"][value="${huelle.farbigkeit}"]`
  );

  await couleur.waitFor({ state: 'visible' });
  await couleur.click();

  console.log('Couleur sélectionnée :', huelle.farbigkeit);
  console.log('URL après le choix de couleur :', page.url());
}

async function choisirTypeHuelle(
    page: Page,
    type: TypHuelle
  ) {
    const chemins = {
      'Fensterhülle': '/shop/fensterhulle-1/attachments',
      'Hülle ohne Fenster': '/shop/hulle-ohne-fenster-1/attachments'
    };

    const chemin = chemins[type];
    const lien = page.locator(`a[href="${chemin}"]`);

    await expect(lien).toBeVisible();

    console.log(`Clic sur : ${type}`);
    console.log('URL avant clic :', page.url());

    // Cliquer sans attendre obligatoirement un événement de navigation.
    await lien.click();

    // Attendre que l'URL change vers le chemin attendu.
    try {
        await expect(page).toHaveURL(
        new RegExp(chemin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        );
    } catch {
        console.log('URL après clic :', page.url());
        console.log(
        'Le clic n’a pas conduit à l’URL attendue. Vérifie le lien et la navigation.'
        );
        throw new Error(`Navigation échouée pour ${type}`);
    }

    console.log('Nouvelle URL :', page.url());
  }
export { configureFarbigkeitHuelle, choisirTypeHuelle };