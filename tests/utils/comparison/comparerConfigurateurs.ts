import { expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

import type {
  ConfigurationComparee,
  PrixCompare,
} from '../../types/typeExtraction';

/**
 * Convertit un prix au format allemand (ex. 1.250,50 €)
 * en nombre (1250.50).
 */
function convertirValeurEnNombre(valeurTexte: string | undefined, champ: string, source: string): number {
  if (valeurTexte === undefined || valeurTexte.trim() === '') {
    throw new Error(`Valeur manquante pour "${champ}" dans le configurateur ${source}.`);
  }

  const nettoye = valeurTexte.replace(/[^\d,.-]/g, '');

  // Format allemand (virgule) ou décimal avec point (poids local : "40.5 g").
  const valeur = Number(
    nettoye.includes(',')
      ? nettoye.replace(/\./g, '').replace(',', '.')
      : nettoye
  );

  if (!Number.isFinite(valeur)) {
    throw new Error(`Format de valeur invalide pour "${champ}" : ${valeurTexte}`);
  }

  return valeur;
}

export async function comparerConfigurateurs(
  configurationLocale: ConfigurationComparee,
  configurationOnline: ConfigurationComparee,
  prixLocal: PrixCompare,
  prixOnline: PrixCompare,
  nomScenario = 'scenario'
) {
  const rapport: string[] = [`# Comparaison : ${nomScenario}`, ''];
  console.log('\n========== COMPARAISON DES CONFIGURATIONS ==========');
  const enTete = ['| Champ | Local | Online | Écart | Résultat |', '|---|---|---|---|---|'];
  rapport.push('## Configuration', '', ...enTete);

  const clesConfiguration: (keyof ConfigurationComparee)[] = [
    'huellentyp',
    'ausstattung',
    'auflage',
    'farbigkeitHuelle',
    'grammaturAnschreiben',
    'farbigkeitAnschreiben',
    'anzahlFlyer',
  ];

  let differences = 0;

  const comparer = (nom: string, local: string, online: string) => {
    console.log(`\n${nom}:`);
    console.log(`  Local  : ${local}`);
    console.log(`  Online : ${online}`);

    const identique = local === online;

    console.log(identique ? '✓ Identique' : '✗ Différent');
    rapport.push(`| ${nom} | ${local} | ${online} | - | ${identique ? '✅' : '❌'} |`);

    if (!identique) differences++;
  };

  for (const cle of clesConfiguration) {
    comparer(cle, configurationLocale[cle], configurationOnline[cle]);
  }

  // Chaque Flyer est comparé séparément (valeurs séparées par " | ").
  const flyersLocal = configurationLocale.flyers ? configurationLocale.flyers.split(' | ') : [];
  const flyersOnline = configurationOnline.flyers ? configurationOnline.flyers.split(' | ') : [];
  const nombreFlyers = Math.max(flyersLocal.length, flyersOnline.length);

  for (let i = 0; i < nombreFlyers; i++) {
    comparer(`Flyer ${i + 1}`, flyersLocal[i] ?? '(absent)', flyersOnline[i] ?? '(absent)');
  }

  console.log('\n========== COMPARAISON DES PRIX ==========');
  rapport.push('', '## Prix et poids', '', ...enTete);

  const clesPrix: (keyof PrixCompare)[] = [
    'produit',
    'porto',
    'express',
    'totalNet',
    'tva',
    'totalBrut',
    'gewichtProSendung',
    'gesamtgewicht',
  ];

  for (const cle of clesPrix) {
    const local = prixLocal[cle];
    const online = prixOnline[cle];

    const valeurLocale = convertirValeurEnNombre(local, cle, 'local');
    const valeurOnline = convertirValeurEnNombre(online, cle, 'en ligne');

    const ecart = Math.round((valeurLocale - valeurOnline) * 100) / 100;
    const identique = ecart === 0;

    console.log(`\n${cle}:`);
    console.log(`  Local  : ${local}`);
    console.log(`  Online : ${online}`);
    const unite = cle === 'gewichtProSendung'
      ? ' g'
      : cle === 'gesamtgewicht'
        ? ' kg'
        : ' €';
    console.log(`  Écart  : ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite}`);

    console.log(identique ? '✓ Identique' : '✗ Différent');
    rapport.push(
      `| ${cle} | ${local} | ${online} | ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite} | ${identique ? '✅' : '❌'} |`
    );

    if (!identique) differences++;
  }

  console.log('\n========== RÉSULTAT FINAL ==========');
  console.log(`Nombre de différences : ${differences}`);

  rapport.push('', `**Nombre de différences : ${differences}**`, '');

  const nomFichier = nomScenario
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  await mkdir('./resultats', { recursive: true });
  await writeFile(`./resultats/${nomFichier}.md`, rapport.join('\n'), 'utf-8');
  console.log(`[MD] Résultat sauvegardé dans tests/resultats/${nomFichier}.md`);

  expect(
    differences,
    'Les configurations ou les prix des deux configurateurs sont différents.'
  ).toBe(0);
}