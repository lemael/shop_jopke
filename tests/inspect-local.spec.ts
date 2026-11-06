import { test } from '@playwright/test';
import { LocalConfiguratorPage } from './pages/local/LocalConfiguratorPageDin-c4-Mailing';
import type { Flyer } from './types/Flyer';


// Usage : npx playwright test inspect-webseite.spec.ts --headed
test('Inspecter le configurateur en ligne', async ({ page }) => {
  const type ='Fensterhülle';
 
  const quantite1 = 500;

  const url = 'https://frontend-production-d09b.up.railway.app/shop/c4_mailing';

  const ausstattung = 'Anschreiben + bis zu 3 Flyer';
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
  const flyer : Flyer = {anzahl: numeroFlyer, umfang: anzahlFlyer, farbigkeit: farbigkeitFlyer, grammatur: grammaturFlyer, oberflaeche: oberflächeFlyer, isChecked: isCheckedFlyer };
  const brochure = { umfang: '', farbigkeit:'', grammatur: '', oberflaeche: '', isChecked: false };

  const configurateur = new LocalConfiguratorPage(
    page,
    url,
    type,
    quantite1,
    ausstattung,
    huelle,
    anschreiben,
    brochure,
    flyer
  );

  await configurateur.öffnenPage();
  await configurateur.wählenTypeHuelle();
 // await configurateur.inspecterPage(`page_${type}`);
 // Choix : 'flyer', 'brochure' ou 'les-deux'
  await configurateur.testerCombinaisonsPiecesJointes();

  // Le navigateur reste ouvert pour examiner les options (mode --headed).
  await page.pause();
});
