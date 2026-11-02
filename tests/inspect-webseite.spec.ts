import { test } from '@playwright/test';
import { OnlineConfiguratorPage } from './pages/OnlineConfiguratorPage';


// Usage : npx playwright test inspect-webseite.spec.ts --headed
test('Inspecter le configurateur en ligne', async ({ page }) => {
  const type ='Fensterhülle';
  const choix = 'flyer';
  const quantite1 = 500;
  const farbigkeitHuelle = '1/1-farbig Schwarz';
  const farbigkeitAnschreiben = '4/0-farbig Euroskala';
  const anzahlFlyer = 2;
  const grammaturFlyer = '135 g/m²';
  const oberflächeFlyer = 'matt';
  const grammaturAnschreiben = '80 g/m²';
  const numeroFlyer = 1;

  const configurateur = new OnlineConfiguratorPage(
    page,
    choix,
    quantite1,
    farbigkeitHuelle,
    grammaturAnschreiben,
    farbigkeitAnschreiben,
    anzahlFlyer,
    grammaturFlyer,
    oberflächeFlyer,
  );

  await configurateur.ouvrirPage('https://www.jopke.de/shop/din-c4-mailing');
  await configurateur.accepterCookiesNecessaires();
  await configurateur.choisirTypeHuelle(type);
 // await configurateur.inspecterPage(`page_${type}`);
 // Choix : 'flyer', 'brochure' ou 'les-deux'
  await configurateur.testerCombinaisonsPiecesJointes(numeroFlyer);

  // Le navigateur reste ouvert pour examiner les options (mode --headed).
  await page.pause();
});
