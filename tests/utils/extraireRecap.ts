import type { Page } from '@playwright/test';

async function extraireRecapitulation(
    page: Page
): Promise<void> {
  console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

  // Récupérer tout le texte de la page
  const textePage = await page.locator('body').innerText();

  // 1. Extraire les prix
  const prix = {
    produit: textePage.match(
      /DIN-C4-Mailing\s+([\d.]+,\d{2})\s*€/
    ),

    porto: textePage.match(
      /Porto:\s*([\d.]+,\d{2})\s*€/
    ),

    totalNet: textePage.match(
      /Gesamt\s*\(netto\):\s*([\d.]+,\d{2})\s*€/
    ),

    tva: textePage.match(
      /zzgl\.\s*19%\s*MwSt\.:?\s*([\d.]+,\d{2})\s*€/
    ),

    totalBrut: textePage.match(
      /Gesamt\s*\(brutto\):\s*([\d.]+,\d{2})\s*€/
    ),
  };

  console.log('===== PRIX =====');

  console.log(
    'DIN-C4-Mailing :',
    prix.produit?.[1] ?? 'Non trouvé',
    '€'
  );

  console.log(
    'Porto :',
    prix.porto?.[1] ?? 'Non trouvé',
    '€'
  );

  console.log(
    'Gesamt (netto) :',
    prix.totalNet?.[1] ?? 'Non trouvé',
    '€'
  );

  console.log(
    'zzgl. 19% MwSt :',
    prix.tva?.[1] ?? 'Non trouvé',
    '€'
  );

  console.log(
    'Gesamt (brutto) :',
    prix.totalBrut?.[1] ?? 'Non trouvé',
    '€'
  );

  // 2. Extraire la quantité
  const quantite = textePage.match(
    /Auflage:\s*(\d+)\s*Stück/
  );

  console.log(
    'Auflage :',
    quantite?.[1] ?? 'Non trouvée'
  );

  // 3. Extraire les produits présents
  const produits = [
    'Fensterhülle DIN C4',
    'Anschreiben DIN A4',
    'Flyer DIN A4',
    'Broschüre DIN A4',
  ];

  const produitsTrouves = produits.filter((produit) =>
    textePage.includes(produit)
  );

  console.log('===== PRODUITS CONFIGURÉS =====');

  for (const produit of produitsTrouves) {
    console.log(`- ${produit}`);
  }

  // 4. Extraire les caractéristiques détaillées
  const configuration = page.locator(
    '.current .col.col-60'
  );

  const produitsp = await configuration
    .locator(':scope > h3')
    .evaluateAll((titres) => {
      return titres.map((titre) => {
        const nom = titre.textContent?.trim() ?? '';

        const caracteristiques: Record<string, string> = {};

        let element: Element | null =
          titre.nextElementSibling;

        while (
          element &&
          element.tagName !== 'H3'
        ) {
          const lignes = element.querySelectorAll(
            ':scope > .row'
          );

          for (const ligne of lignes) {
            const colonnes = ligne.querySelectorAll(
              ':scope > .col'
            );

            if (colonnes.length >= 2) {
              const libelle =
                colonnes[0]
                  .textContent
                  ?.trim()
                  .replace(/:$/, '') ?? '';

              const valeur =
                colonnes[1]
                  .textContent
                  ?.trim() ?? '';

              if (libelle && valeur) {
                caracteristiques[libelle] = valeur;
              }
            }
          }

          element = element.nextElementSibling;
        }

        return {
          nom,
          caracteristiques,
        };
      });
    });

  console.log(
    '===== PRODUITS ET CARACTÉRISTIQUES ====='
  );

  console.log(
    JSON.stringify(produitsp, null, 2)
  );

  console.log(
    '===== FIN DE L’EXTRACTION ====='
  );
}

export { extraireRecapitulation };