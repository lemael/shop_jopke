# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inspect-compare.spec.ts >> Comparer les configurateurs : 10001 Stück – Postkarte DIN A4 297x210 350.101 – 260 g/m² Chromokarton – Ohne
- Location: inspect-compare.spec.ts:36:5

# Error details

```
Error: Les configurations ou les prix des deux configurateurs sont différents.

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 6
```

# Test source

```ts
  26  |     nettoye.includes(',')
  27  |       ? nettoye.replace(/\./g, '').replace(',', '.')
  28  |       : nettoye
  29  |   );
  30  | 
  31  |   if (!Number.isFinite(valeur)) {
  32  |     throw new Error(`Format de valeur invalide pour "${champ}" : ${valeurTexte}`);
  33  |   }
  34  | 
  35  |   return valeur;
  36  | }
  37  | 
  38  | export async function comparerConfigurateurs(
  39  |   configurationLocale: ConfigurationCompareeKartenmailing,
  40  |   configurationOnline: ConfigurationCompareeKartenmailing,
  41  |   prixLocal: PrixCompare,
  42  |   prixOnline: PrixCompare,
  43  |   nomScenario = 'scenario'
  44  | ) {
  45  |   const rapport: string[] = [`# Comparaison : ${nomScenario}`, ''];
  46  |   console.log('\n========== COMPARAISON DES CONFIGURATIONS ==========');
  47  |   const enTete = ['| Champ | Local | Online | Écart | Résultat |', '|---|---|---|---|---|'];
  48  |   rapport.push('## Configuration', '', ...enTete);
  49  | 
  50  |   const clesConfiguration: (keyof ConfigurationCompareeKartenmailing)[] = [
  51  |     'auflage',
  52  |     'endformat',
  53  |     'papier',
  54  |     'veredelung',
  55  |   ];
  56  | 
  57  |   let differences = 0;
  58  | 
  59  |   for (const cle of clesConfiguration) {
  60  |     const local = configurationLocale[cle];
  61  |     const online = configurationOnline[cle];
  62  |     const identique = local === online;
  63  | 
  64  |     console.log(`\n${cle}:`);
  65  |     console.log(`  Local  : ${local}`);
  66  |     console.log(`  Online : ${online}`);
  67  |     console.log(identique ? '✓ Identique' : '✗ Différent');
  68  |     rapport.push(`| ${cle} | ${local} | ${online} | - | ${identique ? '✅' : '❌'} |`);
  69  | 
  70  |     if (!identique) differences++;
  71  |   }
  72  | 
  73  |   console.log('\n========== COMPARAISON DES PRIX ==========');
  74  |   rapport.push('', '## Prix et poids', '', ...enTete);
  75  | 
  76  |   const clesPrix: (keyof PrixCompare)[] = [
  77  |     'produit',
  78  |     'porto',
  79  |     'express',
  80  |     'totalNet',
  81  |     'tva',
  82  |     'totalBrut',
  83  |     'gewichtProSendung',
  84  |     'gesamtgewicht',
  85  |   ];
  86  | 
  87  |   for (const cle of clesPrix) {
  88  |     const local = prixLocal[cle];
  89  |     const online = prixOnline[cle];
  90  | 
  91  |     const valeurLocale = convertirValeurEnNombre(local, cle, 'local');
  92  |     const valeurOnline = convertirValeurEnNombre(online, cle, 'en ligne');
  93  | 
  94  |     const ecart = Math.round((valeurLocale - valeurOnline) * 100) / 100;
  95  |     const identique = ecart === 0;
  96  |     const unite = cle === 'gewichtProSendung' ? ' g' : cle === 'gesamtgewicht' ? ' kg' : ' €';
  97  |     const ecartTexte = `${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite}`;
  98  | 
  99  |     console.log(`\n${cle}:`);
  100 |     console.log(`  Local  : ${local}`);
  101 |     console.log(`  Online : ${online}`);
  102 |     console.log(`  Écart  : ${ecartTexte}`);
  103 |     console.log(identique ? '✓ Identique' : '✗ Différent');
  104 |     rapport.push(`| ${cle} | ${local} | ${online} | ${ecartTexte} | ${identique ? '✅' : '❌'} |`);
  105 | 
  106 |     if (!identique) differences++;
  107 |   }
  108 | 
  109 |   console.log('\n========== RÉSULTAT FINAL ==========');
  110 |   console.log(`Nombre de différences : ${differences}`);
  111 | 
  112 |   rapport.push('', `**Nombre de différences : ${differences}**`, '');
  113 | 
  114 |   const nomFichier = nomScenario
  115 |     .toLowerCase()
  116 |     .replace(/[^a-z0-9]+/g, '-')
  117 |     .replace(/^-|-$/g, '');
  118 |   await mkdir(DOSSIER_RESULTATS, { recursive: true });
  119 |   const fichier = path.join(DOSSIER_RESULTATS, `${nomFichier}.md`);
  120 |   await writeFile(fichier, rapport.join('\n'), 'utf-8');
  121 |   console.log(`[MD] Résultat sauvegardé dans ${path.relative(process.cwd(), fichier)}`);
  122 | 
  123 |   expect(
  124 |     differences,
  125 |     'Les configurations ou les prix des deux configurateurs sont différents.'
> 126 |   ).toBe(0);
      |     ^ Error: Les configurations ou les prix des deux configurateurs sont différents.
  127 | }
  128 | 
```