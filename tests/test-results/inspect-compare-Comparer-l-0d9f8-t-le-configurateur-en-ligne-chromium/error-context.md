# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inspect-compare.spec.ts >> Comparer le configurateur local et le configurateur en ligne
- Location: inspect-compare.spec.ts:22:5

# Error details

```
Error: Les configurations ou les prix des deux configurateurs sont différents.

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 4
```

# Test source

```ts
  1   | import { expect } from '@playwright/test';
  2   | 
  3   | import type {
  4   |   ConfigurationComparee,
  5   |   PrixCompare,
  6   | } from '../../types/typeExtraction';
  7   | 
  8   | /**
  9   |  * Convertit un prix au format allemand (ex. 1.250,50 €)
  10  |  * en nombre (1250.50).
  11  |  */
  12  | function convertirPrixEnNombre(prix: string): number {
  13  |   const valeur = Number(
  14  |     prix
  15  |       .replace(/[^\d,.-]/g, '')
  16  |       .replace(/\./g, '')
  17  |       .replace(',', '.')
  18  |   );
  19  | 
  20  |   if (!Number.isFinite(valeur)) {
  21  |     throw new Error(`Format de prix invalide : ${prix}`);
  22  |   }
  23  | 
  24  |   return valeur;
  25  | }
  26  | 
  27  | export function comparerConfigurateurs(
  28  |   configurationLocale: ConfigurationComparee,
  29  |   configurationOnline: ConfigurationComparee,
  30  |   prixLocal: PrixCompare,
  31  |   prixOnline: PrixCompare
  32  | ) {
  33  |   console.log('\n========== COMPARAISON DES CONFIGURATIONS ==========');
  34  | 
  35  |   const clesConfiguration: (keyof ConfigurationComparee)[] = [
  36  |     'huellentyp',
  37  |     'ausstattung',
  38  |     'auflage',
  39  |     'farbigkeitHuelle',
  40  |     'grammaturAnschreiben',
  41  |     'farbigkeitAnschreiben',
  42  |     'anzahlFlyer',
  43  |     'flyer1',
  44  |   ];
  45  | 
  46  |   let differences = 0;
  47  | 
  48  |   for (const cle of clesConfiguration) {
  49  |     const local = configurationLocale[cle];
  50  |     const online = configurationOnline[cle];
  51  | 
  52  |     console.log(`\n${cle}:`);
  53  |     console.log(`  Local  : ${local}`);
  54  |     console.log(`  Online : ${online}`);
  55  | 
  56  |     const identique = local === online;
  57  | 
  58  |     console.log(identique ? '✓ Identique' : '✗ Différent');
  59  | 
  60  |     if (!identique) differences++;
  61  |   }
  62  | 
  63  |   console.log('\n========== COMPARAISON DES PRIX ==========');
  64  | 
  65  |   const clesPrix: (keyof PrixCompare)[] = [
  66  |     'produit',
  67  |     'porto',
  68  |     'totalNet',
  69  |     'tva',
  70  |     'totalBrut',
  71  |   ];
  72  | 
  73  |   for (const cle of clesPrix) {
  74  |     const local = prixLocal[cle];
  75  |     const online = prixOnline[cle];
  76  | 
  77  |     const valeurLocale = convertirPrixEnNombre(local);
  78  |     const valeurOnline = convertirPrixEnNombre(online);
  79  | 
  80  |     const ecart = Math.round((valeurLocale - valeurOnline) * 100) / 100;
  81  |     const identique = ecart === 0;
  82  | 
  83  |     console.log(`\n${cle}:`);
  84  |     console.log(`  Local  : ${local}`);
  85  |     console.log(`  Online : ${online}`);
  86  |     console.log(`  Écart  : ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')} €`);
  87  | 
  88  |     console.log(identique ? '✓ Identique' : '✗ Différent');
  89  | 
  90  |     if (!identique) differences++;
  91  |   }
  92  | 
  93  |   console.log('\n========== RÉSULTAT FINAL ==========');
  94  |   console.log(`Nombre de différences : ${differences}`);
  95  | 
  96  |   expect(
  97  |     differences,
  98  |     'Les configurations ou les prix des deux configurateurs sont différents.'
> 99  |   ).toBe(0);
      |     ^ Error: Les configurations ou les prix des deux configurateurs sont différents.
  100 | }
```