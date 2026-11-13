import { expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type {
  ConfigurationCompareeKartenmailing,
  PrixCompare,
} from '../../../types/typeExtractionKartenmailing';

// Les rapports sont rangés à côté du spec, comme pour le Selfmailer.
const DOSSIER_RESULTATS = path.join(__dirname, '../../../inspect-compare-kartenmailing/resultats');

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
  configurationLocale: ConfigurationCompareeKartenmailing,
  configurationOnline: ConfigurationCompareeKartenmailing,
  prixLocal: PrixCompare,
  prixOnline: PrixCompare,
  nomScenario = 'scenario'
) {
  const rapport: string[] = [`# Comparaison : ${nomScenario}`, ''];
  console.log('\n========== COMPARAISON DES CONFIGURATIONS ==========');
  const enTete = ['| Champ | Local | Online | Écart | Résultat |', '|---|---|---|---|---|'];
  rapport.push('## Configuration', '', ...enTete);

  const clesConfiguration: (keyof ConfigurationCompareeKartenmailing)[] = [
    'auflage',
    'endformat',
    'papier',
    'veredelung',
  ];

  let differences = 0;

  for (const cle of clesConfiguration) {
    const local = configurationLocale[cle];
    const online = configurationOnline[cle];
    const identique = local === online;

    console.log(`\n${cle}:`);
    console.log(`  Local  : ${local}`);
    console.log(`  Online : ${online}`);
    console.log(identique ? '✓ Identique' : '✗ Différent');
    rapport.push(`| ${cle} | ${local} | ${online} | - | ${identique ? '✅' : '❌'} |`);

    if (!identique) differences++;
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
    const unite = cle === 'gewichtProSendung' ? ' g' : cle === 'gesamtgewicht' ? ' kg' : ' €';
    const ecartTexte = `${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite}`;

    console.log(`\n${cle}:`);
    console.log(`  Local  : ${local}`);
    console.log(`  Online : ${online}`);
    console.log(`  Écart  : ${ecartTexte}`);
    console.log(identique ? '✓ Identique' : '✗ Différent');
    rapport.push(`| ${cle} | ${local} | ${online} | ${ecartTexte} | ${identique ? '✅' : '❌'} |`);

    if (!identique) differences++;
  }

  console.log('\n========== RÉSULTAT FINAL ==========');
  console.log(`Nombre de différences : ${differences}`);

  rapport.push('', `**Nombre de différences : ${differences}**`, '');

  const nomFichier = nomScenario
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  await mkdir(DOSSIER_RESULTATS, { recursive: true });
  const fichier = path.join(DOSSIER_RESULTATS, `${nomFichier}.md`);
  await writeFile(fichier, rapport.join('\n'), 'utf-8');
  console.log(`[MD] Résultat sauvegardé dans ${path.relative(process.cwd(), fichier)}`);

  expect(
    differences,
    'Les configurations ou les prix des deux configurateurs sont différents.'
  ).toBe(0);
}
