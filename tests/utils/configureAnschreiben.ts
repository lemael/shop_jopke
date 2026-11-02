import type { Page } from '@playwright/test';
import { Anschreiben } from '../types/Anschreiben';

async function configureGrammaturAnschreiben(
  page: Page,
  anschreiben: Anschreiben
): Promise<void> {
  console.log('===== GRAMMATUR ANSCHREIBEN =====');

  const boutonGrammatur = page.locator(
    `button[name="grammage"][value="${anschreiben.grammatur}"]`
  );

  await boutonGrammatur.waitFor({ state: 'visible' });
  await boutonGrammatur.click();

  console.log('Grammatur sélectionnée :', anschreiben.grammatur);
  console.log(
    'URL après le choix de Grammatur :',
    page.url()
  );

  console.log('===== FIN DE L’ÉTAPE GRAMMATUR ANSCHREIBEN =====');
} 

async function configureFarbigkeitAnschreiben(
  page: Page,
  anschreiben: Anschreiben
): Promise<void> {
  console.log('===== FARBIGKEIT ANSCHREIBEN =====');

  const boutonFarbigkeit = page.locator(
    `button[name="color"][value="${anschreiben.farbigkeit}"]`
  );

  await boutonFarbigkeit.waitFor({ state: 'visible' });
  await boutonFarbigkeit.click();

  console.log('Farbigkeit sélectionnée :', anschreiben.farbigkeit);
  console.log(
    'URL après le choix de Farbigkeit :',
    page.url()
  );

  console.log('===== FIN DE L’ÉTAPE FARBIGKEIT ANSCHREIBEN =====');
}
export { configureGrammaturAnschreiben, configureFarbigkeitAnschreiben };