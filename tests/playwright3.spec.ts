
import { test, expect, type Page } from '@playwright/test';

interface Combination {
  id: number;
  choix: Record<string, string>;
  etapesParcourues: string[];
  statut: 'complete' | 'incomplete' | 'error';
}

const combinaisons: Combination[] = [];

async function lireEtape(page: Page): Promise<string> {
  // Les titres StepHeader sont à adapter si leur HTML diffère.
  const titres = await page.locator('main h1, main h2, main h3').allInnerTexts();

  return titres[0]?.trim() ?? 'Étape inconnue';
}

test('Explorer une combinaison du Kartenmailing', async ({ page }) => {
  await page.goto('http://localhost:3000/shop/c4_mailing');

  await expect(page.locator('main')).toBeVisible();

  const choix: Record<string, string> = {};
  const etapesParcourues: string[] = [];

  for (let i = 0; i < 10; i++) {
    const texteAvant = await page.locator('main').innerText();
    const etape = await lireEtape(page);

    if (etapesParcourues.includes(etape)) {
      break;
    }

    etapesParcourues.push(etape);
    console.log(`Étape : ${etape}`);

    if (/Übersicht/i.test(etape)) {
      break;
    }

    // Les boutons visibles peuvent inclure les options et la navigation.
    // On inspecte leur contenu avant de choisir.
    const boutons = page.locator('main button:visible');
    const nombre = await boutons.count();

    console.log('Boutons visibles :', nombre);

    for (let j = 0; j < nombre; j++) {
      console.log(
        `Bouton ${j}:`,
        (await boutons.nth(j).innerText()).trim()
      );
    }

    // À compléter avec les sélecteurs exacts des composants OptionTile
    // et ChoiceButton pour éviter de sélectionner Zurück/Weiter.
    const option = page.locator('main button:visible')
      .filter({ hasNotText: /Weiter|Zurück|Konfiguration anfragen/i })
      .first();

    if (await option.count() === 0) {
      console.log('Aucune option détectée.');
      break;
    }

    const nomOption = (await option.innerText()).trim();
    await option.click();

    // Si le clic n'a pas changé l'étape, essayer la navigation.
    await page.waitForTimeout(300);
    const texteApres = await page.locator('main').innerText();

    if (texteApres === texteAvant) {
      const weiter = page.getByRole('button', { name: 'Weiter →', exact: true });

      if (await weiter.isVisible() && await weiter.isEnabled()) {
        await weiter.click();
      } else {
        console.log('Impossible de continuer : bouton Weiter absent ou désactivé.');
        break;
      }
    }

    choix[etape] = nomOption;
  }

  combinaisons.push({
    id: combinaisons.length + 1,
    choix,
    etapesParcourues,
    statut: /Übersicht/i.test(await lireEtape(page))
      ? 'complete'
      : 'incomplete',
  });

  console.log(JSON.stringify(combinaisons, null, 2));
});
