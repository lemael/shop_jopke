import {  type Page } from '@playwright/test';
import type { Selfmailer } from '../../../types/Selfmailer';

async function configureUmfang(
    page: Page,
  selfmailer: Selfmailer
): Promise<void> {
  console.log('===== UMFANG =====');

  // Côté local le bouton affiche le libellé complet ("4 Seiten 210 x 105 mm"),
  // côté online seul le nombre de pages est sélectionnable ("4 Seiten"),
  // le format étant fixé automatiquement pour ce type de produit.
  const nombreDePages = selfmailer.umfang.match(/\d+\s*Seiten/)?.[0] ?? selfmailer.umfang;

  const umfangFlyer = page.getByRole('button', {
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
  await umfangFlyer.waitFor({ state: 'visible' });
  await umfangFlyer.click();

  console.log(`${selfmailer.umfang} sélectionné pour Umfang`);
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

  await boutonGrammatur.waitFor({ state: 'visible' });
  await boutonGrammatur.click();

  console.log('Grammatur sélectionnée :', selfmailer.grammatur);
  console.log(
    'URL après le choix de Grammatur :',
    page.url()
  );

  console.log('===== FIN DE L’ÉTAPE GRAMMATUR =====');
}
async function configurePerforation(
    page: Page,
    selfmailer: Selfmailer
  ): Promise<void> {
    console.log('===== PERFORATION =====');

    // Pour certains produits, la Perforation n'a qu'une seule valeur possible et
    // n'est pas une étape séparée : le choix de Grammatur mène directement à l'Übersicht.
    if (page.url().includes('order-overview')) {
      console.log('Aucune étape Perforation pour ce produit, déjà sur l’Übersicht.');
      return;
    }

    const boutonOberfläche = page.getByRole('button', {
      name: selfmailer.perforation,
      exact: true,
    });

    await boutonOberfläche.waitFor({ state: 'visible' });
    await boutonOberfläche.click();

    console.log('Perforation sélectionnée :', selfmailer.perforation);
    console.log(
      'URL après le choix de :',
      page.url()
    );

    console.log('===== FIN DE L’ÉTAPE PERFORATION =====');
  }


export {configureUmfang, configureGrammatur, configurePerforation };