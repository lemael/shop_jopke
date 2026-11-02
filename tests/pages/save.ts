
import { expect, type Page } from '@playwright/test';

type ChoixPiecesJointes = 'flyer' | 'brochure' | 'les-deux';

class OnlineConfiguratorPage {
  constructor(private page: Page) {}

  async ouvrirPage(url: string) {
    await this.page.goto(url);
    await this.page.locator('body').waitFor();
    console.log('Page ouverte :', this.page.url());
  }

  async choisirTypeHuelle(
    type: 'Fensterhülle' | 'Hülle ohne Fenster'
  ) {
    const chemins = {
      'Fensterhülle': '/shop/fensterhulle-1/attachments',
      'Hülle ohne Fenster': '/shop/hulle-ohne-fenster-1/attachments'
    };

    const chemin = chemins[type];
    const lien = this.page.locator(`a[href="${chemin}"]`);

    await expect(lien).toBeVisible();

    console.log(`Clic sur : ${type}`);
    console.log('URL avant clic :', this.page.url());

    // Cliquer sans attendre obligatoirement un événement de navigation.
    await lien.click();

    // Attendre que l'URL change vers le chemin attendu.
    try {
        await expect(this.page).toHaveURL(
        new RegExp(chemin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        );
    } catch {
        console.log('URL après clic :', this.page.url());
        console.log(
        'Le clic n’a pas conduit à l’URL attendue. Vérifie le lien et la navigation.'
        );
        throw new Error(`Navigation échouée pour ${type}`);
    }

    console.log('Nouvelle URL :', this.page.url());
  }


  async inspecterPage(nom: string) {
    const body = await this.page.locator('body').innerText();
    const html = await this.page.locator('body').innerHTML();

    console.log(`\n===== ${nom} =====`);
    console.log(body);

    console.log(html);
  }


    async accepterCookiesNecessaires() {
        const bouton = this.page.getByText(
            'Nur notwendige akzeptieren',
            { exact: true }
        );

        if (await bouton.isVisible().catch(() => false)) {
            await bouton.click();
            await this.page.locator('#cookieNotice').waitFor({
            state: 'hidden'
            });
        }
    }

async configurerAuflage(quantite: number): Promise<void> {
  console.log('===== AUFLAGE =====');

  const amount = this.page.locator('#amount');

  await amount.fill(String(quantite));

  console.log(
    'Quantité saisie :',
    await amount.inputValue()
  );

  // Cliquer sur Weiter
  await this.page.locator('button.button.next').click();

  await this.page.waitForLoadState('domcontentloaded').catch(() => {});

  console.log(
    'URL après la quantité :',
    this.page.url()
  );
}
    
async testerCombinaisonsPiecesJointes(
  choix: ChoixPiecesJointes
) {
  const combinaisons = {
    flyer: {
      nom: 'Flyer seul',
      flyer: true,
      brochure: false,
    },
    brochure: {
      nom: 'Brochure seule',
      flyer: false,
      brochure: true,
    },
    'les-deux': {
      nom: 'Flyer et brochure',
      flyer: true,
      brochure: true,
    },
  };

  const combinaison = combinaisons[choix];

  console.log(`Scénario : ${combinaison.nom}`);

  const anschreiben = this.page.locator('#toggle-A1400');
  const flyer = this.page.locator('#toggle-F1400');
  const brochure = this.page.locator('#toggle-B1400');

  // 1. Garantir la sélection de l'Anschreiben
  if (!(await anschreiben.isChecked())) {
    if (await anschreiben.isDisabled()) {
      throw new Error(
        'Anschreiben est désactivé et n’est pas sélectionné.'
      );
    }

    await this.page.locator('label[for="toggle-A1400"]').click();
  }

  // 2. Configurer le Flyer
  if (combinaison.flyer) {
    if (!(await flyer.isChecked())) {
      await this.page.locator('label[for="toggle-F1400"]').click();
    }

    const flyer1 = this.page.locator('#F1400x1');
    const labelFlyer1 = this.page.locator('label[for="F1400x1"]');

    await labelFlyer1.waitFor({ state: 'visible' });
    await labelFlyer1.click();

    await this.page.waitForFunction(() => {
      const input = document.querySelector(
        '#F1400x1'
      ) as HTMLInputElement | null;

      return input?.checked === true;
    });

    console.log('Flyer 1 sélectionné.');
  } else if (await flyer.isChecked()) {
    await this.page.locator('label[for="toggle-F1400"]').click();
  }

  // 3. Configurer la Broschüre
  if (combinaison.brochure) {
    if (!(await brochure.isChecked())) {
      await this.page.locator('label[for="toggle-B1400"]').click();
    }

    console.log('Broschüre activée.');
  } else if (await brochure.isChecked()) {
    await this.page.locator('label[for="toggle-B1400"]').click();
  }

  // 4. Vérifier les options sélectionnées
  const selectionFinale = {
    anschreiben: await anschreiben.isChecked(),
    flyer: await flyer.isChecked(),
    brochure: await brochure.isChecked(),
  };

  console.log('Sélection finale :', selectionFinale);

  if (
    !selectionFinale.anschreiben ||
    selectionFinale.flyer !== combinaison.flyer ||
    selectionFinale.brochure !== combinaison.brochure
  ) {
    throw new Error(
      `La sélection ne correspond pas au scénario "${combinaison.nom}".`
    );
  }

  // 5. Passer à la page récapitulative des pièces jointes
  console.log('Clic sur Weiter...');

  await this.page.locator('#configurator-form button.next').click();

  await this.page.waitForLoadState('domcontentloaded').catch(() => {});

  console.log('URL après Weiter :', this.page.url());
  console.log('===== PAGE RÉCAPITULATIVE =====');
 // console.log(await this.page.locator('body').innerText());

  // 6. Cliquer sur Produkt konfigurieren
  console.log('Clic sur Produkt konfigurieren...');

  const boutonKonfigurieren = this.page.locator(
    'a.button.next[href="/konfigurator/fensterhulle-1/anschreiben-bis-zu-3-flyer-2"]'
  );

  await boutonKonfigurieren.waitFor({ state: 'visible' });
  await boutonKonfigurieren.click();

  await this.page.waitForURL(
    '**/konfigurator/fensterhulle-1/anschreiben-bis-zu-3-flyer-2'
  );

  console.log('URL après Produkt konfigurieren :', this.page.url());
  console.log('===== Auflage =====');
  // 7. Saisir la quantité
  const amount = this.page.locator('#amount');

  await amount.fill('500');

  console.log('Quantité saisie :', await amount.inputValue());

  // 8. Cliquer sur Weiter pour accéder aux options d'impression
  await this.page.locator('button.button.next').click();

  await this.page.waitForLoadState('domcontentloaded').catch(() => {});

  console.log('URL après la quantité :', this.page.url());

  console.log('===== Farbigkeit Hülle =====');
  // 9. Choisir la couleur d'impression
  const couleur = this.page.locator(
    'button[name="color"][value="1/1-farbig Schwarz"]'
  );

  await couleur.waitFor({ state: 'visible' });
  await couleur.click();

  console.log('Couleur sélectionnée : 1/1-farbig Schwarz');
  console.log('URL après le choix de couleur :', this.page.url());
 console.log('===== FIN DE L’ÉTAPE COULEUR HÜLLE =====');
  // 10. Cliquer sur Weiter sur l'étape suivante
  const boutonWeiterFinal = this.page.locator('button.button.next');

  await boutonWeiterFinal.waitFor({ state: 'visible' });
  await boutonWeiterFinal.click();

  await this.page.waitForLoadState('domcontentloaded').catch(() => {});

  console.log('URL après le dernier Weiter :', this.page.url());
  console.log('===== CONTENU DE LA PAGE SUIVANTE =====');
//  console.log(await this.page.locator('body').innerText());
  console.log('===== Grammatur Hülle =====');
  // 11. cliquer sur 80 g/m²
  const bouton80g = this.page.locator('button[name="grammage"][value="80 g/m²"]');
  await bouton80g.waitFor({ state: 'visible' });
  await bouton80g.click();
  console.log('80 g/m² sélectionné');
  console.log('URL après le dernier Weiter :', this.page.url());
  console.log('===== Farbigkeit Anschreiben=====');
  // 12. Choisir la Farbigkeit pour Anschreiben
  const farbigkeitAnschreiben = this.page.locator(
    'button[name="color"][value="4/0-farbig Euroskala"]'
  );

  await farbigkeitAnschreiben.waitFor({ state: 'visible' });
  await farbigkeitAnschreiben.click();

  console.log('Farbigkeit pour Anschreiben sélectionnée : 4/0-farbig Euroskala');
  console.log('URL après le choix de Farbigkeit pour Anschreiben :', this.page.url());
  console.log('===== Anschreiben DIN A4 abgeschlossen =====');
  const boutonWeiterFinalAn = this.page.locator('button.button.next');

  await boutonWeiterFinalAn.waitFor({ state: 'visible' });
  await boutonWeiterFinalAn.click();

  await this.page.waitForLoadState('domcontentloaded').catch(() => {});

  console.log('URL après le dernier Weiter :', this.page.url());
  console.log('contenu actuel de la page :');
  console.log(await this.page.locator('body').innerText());

  console.log('===== Umfang Flyer =====');
  const umfangFlyer = this.page.locator('button[name="pages"][value="2 Seiten"]');
  await umfangFlyer.waitFor({ state: 'visible' });
  await umfangFlyer.click();
  console.log('2 Seiten sélectionné pour Umfang Flyer');
  console.log('URL après le choix de Umfang Flyer :', this.page.url());

  console.log('===== Grammatur Flyer =====');
  const grammaturFlyer = this.page.locator('button[name="grammage"][value="135 g/m²"]');
  await grammaturFlyer.waitFor({ state: 'visible' });
  await grammaturFlyer.click();
  console.log('135 g/m² sélectionné pour Grammatur Flyer');
  console.log('URL après le choix de Grammatur Flyer :', this.page.url());
  console.log('===== Oberfläche Flyer =====');
  const oberflächeFlyer = this.page.locator('button[name="finish"][value="matt"]');
  await oberflächeFlyer.waitFor({ state: 'visible' });
  await oberflächeFlyer.click();
  console.log('Oberfläche Flyer sélectionnée : matt');
  console.log('URL après le choix de Oberfläche Flyer :', this.page.url());
  console.log('===== Flyer configuration terminée =====');
  console.log('=====Preisübersicht =====');

console.log('===== EXTRACTION DES PRIX ET DES PRODUITS =====');

// Récupérer tout le texte de la page
const textePage = await this.page.locator('body').innerText();

// 1. Extraire les prix
const prix = {
  produit: textePage.match(/DIN-C4-Mailing\s+([\d.]+,\d{2})\s*€/),
  porto: textePage.match(/Porto:\s*([\d.]+,\d{2})\s*€/),
  totalNet: textePage.match(/Gesamt\s*\(netto\):\s*([\d.]+,\d{2})\s*€/),
  tva: textePage.match(/zzgl\.\s*19%\s*MwSt\.:\s*([\d.]+,\d{2})\s*€/),
  totalBrut: textePage.match(/Gesamt\s*\(brutto\):\s*([\d.]+,\d{2})\s*€/),
};

console.log('===== PRIX =====');
console.log('DIN-C4-Mailing :', prix.produit?.[1] + ' €');
console.log('Porto :', prix.porto?.[1] + ' €');
console.log('Gesamt (netto) :', prix.totalNet?.[1] + ' €');
console.log('zzgl. 19% MwSt:', prix.tva?.[1] + ' €');
console.log('Gesamt (brutto) :', prix.totalBrut?.[1] + ' €');

// 2. Extraire la quantité
const quantite = textePage.match(/Auflage:\s*(\d+)\s*Stück/);

console.log('Auflage :', quantite?.[1] ?? 'Non trouvée');

// 3. Extraire les produits de la configuration actuelle
const produits = [
  'Fensterhülle DIN C4',
  'Anschreiben DIN A4',
  'Flyer DIN A4',
  'Broschüre DIN A4',
];

const produitsTrouves = produits.filter(produit =>
  textePage.includes(produit)
);

console.log('===== PRODUITS CONFIGURÉS =====');

for (const produit of produitsTrouves) {
  console.log(`- ${produit}`);
}


const configuration = this.page.locator('.current .col.col-60');

const produitsp = await configuration.locator(':scope > h3').evaluateAll(
  (titres) => {
    return titres.map((titre) => {
      const nom = titre.textContent?.trim() ?? '';
      const caracteristiques: Record<string, string> = {};

      let element: Element | null = titre.nextElementSibling;

      while (element && element.tagName !== 'H3') {
        // Parcourir les lignes contenant les caractéristiques
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
  }
);

console.log('===== PRODUITS ET CARACTÉRISTIQUES =====');
console.log(JSON.stringify(produitsp, null, 2));


console.log('===== FIN DE L’EXTRACTION =====');

}


}

export { OnlineConfiguratorPage };