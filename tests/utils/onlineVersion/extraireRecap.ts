
import type { Page } from '@playwright/test';

export interface PrixOnline {
  produit: string;
  porto: string;
  totalNet: string;
  tva: string;
  totalBrut: string;
}

export interface ProduitOnline {
  nom: string;
  caracteristiques: Record<string, string>;
}

export interface RecapitulationOnline {
  prix: PrixOnline;
  quantite: string;
  produits: ProduitOnline[];
}

async function extraireRecapitulation(
  page: Page
): Promise<RecapitulationOnline> {

  console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

  const textePage = await page.locator('body').innerText();

  // ==========================================
  // 1. EXTRAIRE LES PRIX
  // ==========================================

  const extrairePrix = (regex: RegExp, nom: string): string => {
    const resultat = textePage.match(regex);

    if (!resultat?.[1]) {
      throw new Error(`Prix "${nom}" introuvable dans la récapitulation.`);
    }

    return resultat[1];
  };

  const prix: PrixOnline = {
    produit: extrairePrix(
      /DIN-C4-Mailing\s+([\d.]+,\d{2})\s*€/,
      'DIN-C4-Mailing'
    ),

    porto: extrairePrix(
      /Porto:\s*([\d.]+,\d{2})\s*€/,
      'Porto'
    ),

    totalNet: extrairePrix(
      /Gesamt\s*\(netto\):\s*([\d.]+,\d{2})\s*€/,
      'Gesamt netto'
    ),

    tva: extrairePrix(
      /zzgl\.\s*19%\s*MwSt\.?:\s*([\d.]+,\d{2})\s*€/,
      'TVA'
    ),

    totalBrut: extrairePrix(
      /Gesamt\s*\(brutto\):\s*([\d.]+,\d{2})\s*€/,
      'Gesamt brutto'
    ),
  };

  console.log('===== PRIX =====');
  console.table(prix);


  // ==========================================
  // 2. EXTRAIRE LA QUANTITÉ
  // ==========================================

  const quantite = textePage.match(
    /Auflage:\s*(\d+)\s*Stück/
  )?.[1];

  if (!quantite) {
    throw new Error('Quantité introuvable dans la récapitulation.');
  }

  console.log('Auflage :', quantite);


  // ==========================================
  // 3. IDENTIFIER LES PRODUITS
  // ==========================================

  const nomsProduits = [
    'Fensterhülle DIN C4',
    'Anschreiben DIN A4',
    'Flyer DIN A4',
    'Broschüre DIN A4',
  ];

  const produitsTrouves = nomsProduits.filter((produit) =>
    textePage.includes(produit)
  );

  console.log('===== PRODUITS CONFIGURÉS =====');

  produitsTrouves.forEach((produit) => {
    console.log(`- ${produit}`);
  });


  // ==========================================
  // 4. EXTRAIRE LES CARACTÉRISTIQUES
  // ==========================================

  const configuration = page.locator('.current .col.col-60');

  const produits: ProduitOnline[] = await configuration
    .locator(':scope > h3')
    .evaluateAll((titres) => {

      return titres.map((titre) => {

        const nom = titre.textContent?.trim() ?? '';

        const caracteristiques: Record<string, string> = {};

        let element: Element | null = titre.nextElementSibling;

        while (element && element.tagName !== 'H3') {

          const lignes = element.querySelectorAll(':scope > .row');

          for (const ligne of lignes) {

            const colonnes = ligne.querySelectorAll(':scope > .col');

            if (colonnes.length >= 2) {

              const libelle =
                colonnes[0].textContent?.trim().replace(/:$/, '') ?? '';

              const valeur =
                colonnes[1].textContent?.trim() ?? '';

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


  console.log('===== PRODUITS ET CARACTÉRISTIQUES =====');
  console.log(JSON.stringify(produits, null, 2));


  // ==========================================
  // 5. CONSTRUIRE L'OBJET DE RÉCAPITULATION
  // ==========================================

  const recapOnline: RecapitulationOnline = {
    prix,
    quantite,
    produits,
  };

  console.log('===== FIN DE L’EXTRACTION =====');

  return recapOnline;
}

export { extraireRecapitulation };
