import { expect, type Locator, type Page } from '@playwright/test';
import type { Selfmailer } from '../../../types/Selfmailer';

/**
 * Sur jopke.de, une étape qui n'a qu'une seule option possible est sautée :
 *   - ANDIGO (un seul Umfang)        : Auflage → Grammatur
 *   - INATA 8 Seiten (une Grammatur) : Umfang → Übersicht
 *   - Bestseller LEVI (tout fixé)    : Auflage → Übersicht
 * On lit donc l'étape réellement affichée avant d'agir.
 */
type Etape = 'Auflage' | 'Umfang' | 'Grammatur' | 'Perforation' | 'Übersicht' | 'inconnue';

async function etapeActuelle(page: Page): Promise<Etape> {
  if (page.url().includes('order-overview')) return 'Übersicht';

  // Le titre de l'étape vaut "<Produit><Étape>", ex. "DIN-Lang-Poster-Selfmailer ANDIGOGrammatur".
  const titres = await page
    .locator('h1, h2, h3')
    .evaluateAll(elements => elements.map(e => (e.textContent ?? '').replace(/\s+/g, ' ').trim()));

  for (const titre of titres) {
    const match = titre.match(/(Auflage|Umfang|Grammatur|Perforation)$/);
    if (match) return match[1] as Etape;
  }
  return 'inconnue';
}

/** Attend que jopke.de ait quitté l'étape `ancienne` (navigation après un clic). */
async function attendreChangementEtape(page: Page, ancienne: Etape): Promise<void> {
  await expect
    .poll(() => etapeActuelle(page), {
      message: `jopke.de reste bloqué sur l'étape ${ancienne}`,
      timeout: 30_000,
    })
    .not.toBe(ancienne);
}

/**
 * Choisit `bouton` si jopke.de affiche bien l'étape `etape`, sinon ne fait rien.
 * Renvoie true si une option a été choisie.
 */
async function choisirSiEtapePresente(page: Page, etape: Etape, bouton: Locator): Promise<boolean> {
  // L'étape précédente vient d'être validée : on attend d'en être sorti.
  await expect
    .poll(() => etapeActuelle(page), { timeout: 30_000 })
    .not.toBe('inconnue');
  await attendreChangementEtape(page, 'Auflage');

  const actuelle = await etapeActuelle(page);
  if (actuelle !== etape) {
    console.log(`Aucune étape ${etape} pour cette variante (jopke.de affiche : ${actuelle}).`);
    return false;
  }

  await bouton.waitFor({ state: 'visible' });
  await bouton.click();
  await attendreChangementEtape(page, etape);
  return true;
}

async function configureUmfang(
    page: Page,
  selfmailer: Selfmailer
): Promise<void> {
  console.log('===== UMFANG =====');

  // Côté local le bouton affiche le libellé complet ("4 Seiten 210 x 105 mm"),
  // côté online le bouton n'affiche que l'Umfang ("4 Seiten", "6 Seiten + Klappe"),
  // le format étant fixé automatiquement : on retire donc l'Endformat final.
  const nombreDePages = selfmailer.umfang.replace(/\s*\d+\s*x\s*\d+\s*mm\s*$/, '').trim();

  const boutonUmfang = page.getByRole('button', {
    name: new RegExp(
      '^' +
        nombreDePages
          .replace(/\s+/g, '')
          .split('')
          .map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('\\s*') +
        '$'
    ),
  });

  if (await choisirSiEtapePresente(page, 'Umfang', boutonUmfang)) {
    console.log(`${selfmailer.umfang} sélectionné pour Umfang`);
  }
  console.log('URL après le choix de Umfang :', page.url());
  console.log('===== FIN DE L’ÉTAPE UMFANG =====');
}

async function configureGrammatur(
  page: Page,
  selfmailer: Selfmailer
): Promise<void> {
  console.log('===== GRAMMATUR =====');

  // Côté local le bouton inclut le type de papier ("170 g/m² Bilderdruck"),
  // côté online seul le grammage est sélectionnable ("170 g/m²"),
  // le papier étant fixé automatiquement pour ce type de produit.
  const grammage = selfmailer.grammatur.match(/^[\d,.]+\s*g\/m²/)?.[0] ?? selfmailer.grammatur;

  const boutonGrammatur = page.getByRole('button', {
    name: grammage,
    exact: true,
  });

  if (await choisirSiEtapePresente(page, 'Grammatur', boutonGrammatur)) {
    console.log('Grammatur sélectionnée :', selfmailer.grammatur);
  }
  console.log('URL après le choix de Grammatur :', page.url());
  console.log('===== FIN DE L’ÉTAPE GRAMMATUR =====');
}

async function configurePerforation(
    page: Page,
    selfmailer: Selfmailer
  ): Promise<void> {
    console.log('===== PERFORATION =====');

    const boutonPerforation = page.getByRole('button', {
      name: selfmailer.perforation,
      exact: true,
    });

    if (await choisirSiEtapePresente(page, 'Perforation', boutonPerforation)) {
      console.log('Perforation sélectionnée :', selfmailer.perforation);
    }
    console.log('URL après le choix de Perforation :', page.url());
    console.log('===== FIN DE L’ÉTAPE PERFORATION =====');
  }


export {configureUmfang, configureGrammatur, configurePerforation };
