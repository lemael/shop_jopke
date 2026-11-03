import { expect, type Page } from '@playwright/test';
import { Huelle, TypHuelle } from '../../types/Huelle';


async function configureFarbigkeitHuelle(
  page: Page,
  huelle: Huelle
): Promise<void> {
  console.log('===== FARBIGKEIT HÜLLE local =====');

  const texte = huelle.farbigkeit;

  const bouton = page.getByRole('button', {
    name: texte,
    exact: true
  });

  // 1. Vérifier que le bouton est disponible.
  await expect(bouton).toBeVisible();

  // 2. Cliquer sur la couleur souhaitée.
  console.log('Sélection de la couleur :', texte);
  await bouton.click();

  
}

async function wählenTypeHuelle(
    page: Page,
    type: TypHuelle
  ) {
    const bouton = page.getByRole('button', {
      name: type,
      exact: true
    });

    await expect(bouton).toBeVisible();
    await expect(bouton.locator('span')).toHaveText(type);



    console.log(`Clic sur : ${type}`);
    console.log('URL avant clic :', page.url());

    // Cliquer sans attendre obligatoirement un événement de navigation.
    await bouton.click();

    console.log('URL après clic :', page.url());
  }
export { configureFarbigkeitHuelle, wählenTypeHuelle };