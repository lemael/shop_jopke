import { test } from '@playwright/test';
import { OnlineConfiguratorPage } from './pages/OnlineConfiguratorPage';


// Usage : npx playwright test inspect-webseite.spec.ts --headed
test('Inspecter le configurateur en ligne', async ({ page }) => {
  const type ='Fensterhülle';
  const choix = 'flyer';
  const quantite1 = 500;

  // Hülle
  const farbigkeitHuelle = '1/1-farbig Schwarz';
  // Anschreiben
  const farbigkeitAnschreiben = '4/0-farbig Euroskala';
  const grammaturAnschreiben = '80 g/m²';
  const isCheckedAnschreiben = true;
  // Flyer
  const anzahlFlyer = "2";
  const farbigkeitFlyer = '4/4-farbig Euroskala';
  const grammaturFlyer = '135 g/m²';
  const oberflächeFlyer = 'matt';
  const numeroFlyer = 1;
  const isCheckedFlyer = true;

  const huelle = { farbigkeit: farbigkeitHuelle };
  const anschreiben = { farbigkeit: farbigkeitAnschreiben, grammatur: grammaturAnschreiben, isChecked: isCheckedAnschreiben };
  const flyer = { umfang: anzahlFlyer, farbigkeit: farbigkeitFlyer, grammatur: grammaturFlyer, oberflaeche: oberflächeFlyer, isChecked: isCheckedFlyer };
  const brochure = {};

  const configurateur = new OnlineConfiguratorPage(
  page,
   choix,
    quantite1,
    huelle,
    anschreiben,
    flyer,
   
  );

  await configurateur.ouvrirPage('https://www.jopke.de/shop/din-c4-mailing');
  await configurateur.accepterCookiesNecessaires();
  await configurateur.choisirTypeHuelle(type);
 // await configurateur.inspecterPage(`page_${type}`);
 // Choix : 'flyer', 'brochure' ou 'les-deux'
  await configurateur.testerCombinaisonsPiecesJointes(quantite1, numeroFlyer, choix);

  // Le navigateur reste ouvert pour examiner les options (mode --headed).
  await page.pause();
});
