# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inspect-compare.spec.ts >> Comparer les configurateurs : 500 Stück – Broschüre – Umfang 24(4+20)Seiten
- Location: inspect-compare.spec.ts:19:5

# Error details

```
Error: Les configurations ou les prix des deux configurateurs sont différents.

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 6
```

# Test source

```ts
  46  |   const clesConfiguration: (keyof ConfigurationComparee)[] = [
  47  |     'huellentyp',
  48  |     'ausstattung',
  49  |     'auflage',
  50  |     'farbigkeitHuelle',
  51  |     'grammaturAnschreiben',
  52  |     'farbigkeitAnschreiben',
  53  |     'anzahlFlyer',
  54  |     'farbigkeitBrochure',
  55  |     'umfangBrochure',
  56  |     'grammaturBrochure',
  57  |     'oberflaecheBrochure'
  58  |   ];
  59  | 
  60  |   let differences = 0;
  61  | 
  62  |   const comparer = (nom: string, local: string, online: string) => {
  63  |     console.log(`\n${nom}:`);
  64  |     console.log(`  Local  : ${local}`);
  65  |     console.log(`  Online : ${online}`);
  66  | 
  67  |     const identique = local === online;
  68  | 
  69  |     console.log(identique ? '✓ Identique' : '✗ Différent');
  70  |     rapport.push(`| ${nom} | ${local} | ${online} | - | ${identique ? '✅' : '❌'} |`);
  71  | 
  72  |     if (!identique) differences++;
  73  |   };
  74  | 
  75  |   for (const cle of clesConfiguration) {
  76  |     comparer(cle, configurationLocale[cle], configurationOnline[cle]);
  77  |   }
  78  | 
  79  |   // Chaque Flyer est comparé séparément (valeurs séparées par " | ").
  80  |   const flyersLocal = configurationLocale.flyers ? configurationLocale.flyers.split(' | ') : [];
  81  |   const flyersOnline = configurationOnline.flyers ? configurationOnline.flyers.split(' | ') : [];
  82  |   const nombreFlyers = Math.max(flyersLocal.length, flyersOnline.length);
  83  | 
  84  |   for (let i = 0; i < nombreFlyers; i++) {
  85  |     comparer(`Flyer ${i + 1}`, flyersLocal[i] ?? '(absent)', flyersOnline[i] ?? '(absent)');
  86  |   }
  87  | 
  88  |   console.log('\n========== COMPARAISON DES PRIX ==========');
  89  |   rapport.push('', '## Prix et poids', '', ...enTete);
  90  | 
  91  |   const clesPrix: (keyof PrixCompare)[] = [
  92  |     'produit',
  93  |     'porto',
  94  |     'express',
  95  |     'totalNet',
  96  |     'tva',
  97  |     'totalBrut',
  98  |     'gewichtProSendung',
  99  |     'gesamtgewicht',
  100 |   ];
  101 | 
  102 |   for (const cle of clesPrix) {
  103 |     const local = prixLocal[cle];
  104 |     const online = prixOnline[cle];
  105 | 
  106 |     const valeurLocale = convertirValeurEnNombre(local, cle, 'local');
  107 |     const valeurOnline = convertirValeurEnNombre(online, cle, 'en ligne');
  108 | 
  109 |     const ecart = Math.round((valeurLocale - valeurOnline) * 100) / 100;
  110 |     const identique = ecart === 0;
  111 | 
  112 |     console.log(`\n${cle}:`);
  113 |     console.log(`  Local  : ${local}`);
  114 |     console.log(`  Online : ${online}`);
  115 |     const unite = cle === 'gewichtProSendung'
  116 |       ? ' g'
  117 |       : cle === 'gesamtgewicht'
  118 |         ? ' kg'
  119 |         : ' €';
  120 |     console.log(`  Écart  : ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite}`);
  121 | 
  122 |     console.log(identique ? '✓ Identique' : '✗ Différent');
  123 |     rapport.push(
  124 |       `| ${cle} | ${local} | ${online} | ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite} | ${identique ? '✅' : '❌'} |`
  125 |     );
  126 | 
  127 |     if (!identique) differences++;
  128 |   }
  129 | 
  130 |   console.log('\n========== RÉSULTAT FINAL ==========');
  131 |   console.log(`Nombre de différences : ${differences}`);
  132 | 
  133 |   rapport.push('', `**Nombre de différences : ${differences}**`, '');
  134 | 
  135 |   const nomFichier = nomScenario
  136 |     .toLowerCase()
  137 |     .replace(/[^a-z0-9]+/g, '-')
  138 |     .replace(/^-|-$/g, '');
  139 |   await mkdir('./resultats', { recursive: true });
  140 |   await writeFile(`./resultats/${nomFichier}.md`, rapport.join('\n'), 'utf-8');
  141 |   console.log(`[MD] Résultat sauvegardé dans tests/resultats/${nomFichier}.md`);
  142 | 
  143 |   expect(
  144 |     differences,
  145 |     'Les configurations ou les prix des deux configurateurs sont différents.'
> 146 |   ).toBe(0);
      |     ^ Error: Les configurations ou les prix des deux configurateurs sont différents.
  147 | }
```