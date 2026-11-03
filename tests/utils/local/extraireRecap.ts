
import { type Page, expect } from '@playwright/test';

async function extraireRecapitulation(
  page: Page
): Promise<void> {
  console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

  // 1. Vérifier la présence du récapitulatif.
  await expect(page.locator('body')).toContainText('Ihre Auswahl');

  // 2. Extraire les caractéristiques de la configuration.
  const lignesConfiguration = await page.locator('p').evaluateAll(
    paragraphes => {
      return paragraphes
        .map(p => {
          const span = p.querySelector(':scope > span');

          if (!span) return null;

          const libelle = span.textContent
            ?.trim()
            .replace(/:$/, '') ?? '';

          const valeur = p.textContent
            ?.replace(span.textContent ?? '', '')
            .trim() ?? '';

          if (!libelle || !valeur) return null;

          return { libelle, valeur };
        })
        .filter(
          (ligne): ligne is { libelle: string; valeur: string } =>
            ligne !== null
        );
    }
  );

  const configuration: Record<string, string> = {};

  for (const ligne of lignesConfiguration) {
    configuration[ligne.libelle] = ligne.valeur;
  }

  console.log('===== CONFIGURATION =====');
  console.log(JSON.stringify(configuration, null, 2));

  // 3. Extraire les prix et les informations de livraison.
  const informationsPrix = await page.locator('dl').evaluateAll(
    listes => {
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
    }
  );

  console.log('===== PRIX ET LIVRAISON =====');

  console.log(
    'Produit :',
    informationsPrix['Kuvertiertes Mailing DIN-C4'] ?? 'Non trouvé'
  );

  console.log(
    'Porto :',
    informationsPrix['Porto'] ?? 'Non trouvé'
  );
 const optionsVerarbeitung = await page
  .getByRole('button', { name: /Standard|Express/ })
  .evaluateAll(boutons =>
    boutons.map(bouton => ({
      option: bouton.querySelector('span:first-child')
        ?.textContent?.trim() ?? '',

      prix: bouton.querySelector('span:nth-child(2)')
        ?.textContent?.trim() ?? ''
    }))
  );

console.log('===== VERARBEITUNGSZEITEN =====');
console.log(JSON.stringify(optionsVerarbeitung, null, 2));

  console.log(
    'Express :',
    optionsVerarbeitung.find(option => option.option === 'Express')?.prix?.trim() ?? 'Non trouvé'
  );

  console.log(
    'Gesamt (netto) :',
    informationsPrix['Gesamt (netto)'] ?? 'Non trouvé'
  );

  console.log(
    'TVA :',
    informationsPrix['zzgl. 19% MwSt.'] ?? 'Non trouvé'
  );

  console.log(
    'Gesamt (brutto) :',
    informationsPrix['Gesamt (brutto)'] ?? 'Non trouvé'
  );

  console.log(
    'Gewicht pro Sendung :',
    informationsPrix['Gewicht pro Sendung'] ?? 'Non trouvé'
  );

  console.log(
    'Gesamtgewicht :',
    informationsPrix['Gesamtgewicht'] ?? 'Non trouvé'
  );

  // 4. Extraire le délai de traitement.
  const traitement = page.getByRole('button', {
    name: /Standard|Express/
  });

  const traitementSelectionne = await traitement.evaluateAll(
    boutons => {
      return boutons
        .filter(bouton => {
          const classes = bouton.getAttribute('class') ?? '';

          return classes.includes('bg-[#822660]');
        })
        .map(bouton => bouton.querySelector('span')?.textContent?.trim())
        .filter((texte): texte is string => Boolean(texte));
    }
  );

  console.log(
    'Verarbeitungszeit :',
    traitementSelectionne.join(', ') || 'Non trouvé'
  );

  console.log('===== FIN DE L’EXTRACTION =====');
}

export { extraireRecapitulation };
