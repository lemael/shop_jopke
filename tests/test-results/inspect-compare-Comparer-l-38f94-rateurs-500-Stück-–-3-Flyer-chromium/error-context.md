# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inspect-compare.spec.ts >> Comparer les configurateurs : 500 Stück – 3 Flyer
- Location: inspect-compare.spec.ts:19:5

# Error details

```
Error: Les configurations ou les prix des deux configurateurs sont différents.

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 4
```

# Test source

```ts
  42  |   console.log('\n========== COMPARAISON DES CONFIGURATIONS ==========');
  43  |   const enTete = ['| Champ | Local | Online | Écart | Résultat |', '|---|---|---|---|---|'];
  44  |   rapport.push('## Configuration', '', ...enTete);
  45  | 
  46  |   const clesConfiguration: (keyof ConfigurationComparee)[] = [
  47  |     'huellentyp',
  48  |     'ausstattung',
  49  |     'auflage',
  50  |     'farbigkeitHuelle',
  51  |     'grammaturAnschreiben',
  52  |     'farbigkeitAnschreiben',
  53  |     'anzahlFlyer',
  54  |   ];
  55  | 
  56  |   let differences = 0;
  57  | 
  58  |   const comparer = (nom: string, local: string, online: string) => {
  59  |     console.log(`\n${nom}:`);
  60  |     console.log(`  Local  : ${local}`);
  61  |     console.log(`  Online : ${online}`);
  62  | 
  63  |     const identique = local === online;
  64  | 
  65  |     console.log(identique ? '✓ Identique' : '✗ Différent');
  66  |     rapport.push(`| ${nom} | ${local} | ${online} | - | ${identique ? '✅' : '❌'} |`);
  67  | 
  68  |     if (!identique) differences++;
  69  |   };
  70  | 
  71  |   for (const cle of clesConfiguration) {
  72  |     comparer(cle, configurationLocale[cle], configurationOnline[cle]);
  73  |   }
  74  | 
  75  |   // Chaque Flyer est comparé séparément (valeurs séparées par " | ").
  76  |   const flyersLocal = configurationLocale.flyers ? configurationLocale.flyers.split(' | ') : [];
  77  |   const flyersOnline = configurationOnline.flyers ? configurationOnline.flyers.split(' | ') : [];
  78  |   const nombreFlyers = Math.max(flyersLocal.length, flyersOnline.length);
  79  | 
  80  |   for (let i = 0; i < nombreFlyers; i++) {
  81  |     comparer(`Flyer ${i + 1}`, flyersLocal[i] ?? '(absent)', flyersOnline[i] ?? '(absent)');
  82  |   }
  83  | 
  84  |   console.log('\n========== COMPARAISON DES PRIX ==========');
  85  |   rapport.push('', '## Prix et poids', '', ...enTete);
  86  | 
  87  |   const clesPrix: (keyof PrixCompare)[] = [
  88  |     'produit',
  89  |     'porto',
  90  |     'express',
  91  |     'totalNet',
  92  |     'tva',
  93  |     'totalBrut',
  94  |     'gewichtProSendung',
  95  |     'gesamtgewicht',
  96  |   ];
  97  | 
  98  |   for (const cle of clesPrix) {
  99  |     const local = prixLocal[cle];
  100 |     const online = prixOnline[cle];
  101 | 
  102 |     const valeurLocale = convertirValeurEnNombre(local, cle, 'local');
  103 |     const valeurOnline = convertirValeurEnNombre(online, cle, 'en ligne');
  104 | 
  105 |     const ecart = Math.round((valeurLocale - valeurOnline) * 100) / 100;
  106 |     const identique = ecart === 0;
  107 | 
  108 |     console.log(`\n${cle}:`);
  109 |     console.log(`  Local  : ${local}`);
  110 |     console.log(`  Online : ${online}`);
  111 |     const unite = cle === 'gewichtProSendung'
  112 |       ? ' g'
  113 |       : cle === 'gesamtgewicht'
  114 |         ? ' kg'
  115 |         : ' €';
  116 |     console.log(`  Écart  : ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite}`);
  117 | 
  118 |     console.log(identique ? '✓ Identique' : '✗ Différent');
  119 |     rapport.push(
  120 |       `| ${cle} | ${local} | ${online} | ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite} | ${identique ? '✅' : '❌'} |`
  121 |     );
  122 | 
  123 |     if (!identique) differences++;
  124 |   }
  125 | 
  126 |   console.log('\n========== RÉSULTAT FINAL ==========');
  127 |   console.log(`Nombre de différences : ${differences}`);
  128 | 
  129 |   rapport.push('', `**Nombre de différences : ${differences}**`, '');
  130 | 
  131 |   const nomFichier = nomScenario
  132 |     .toLowerCase()
  133 |     .replace(/[^a-z0-9]+/g, '-')
  134 |     .replace(/^-|-$/g, '');
  135 |   await mkdir('./resultats', { recursive: true });
  136 |   await writeFile(`./resultats/${nomFichier}.md`, rapport.join('\n'), 'utf-8');
  137 |   console.log(`[MD] Résultat sauvegardé dans tests/resultats/${nomFichier}.md`);
  138 | 
  139 |   expect(
  140 |     differences,
  141 |     'Les configurations ou les prix des deux configurateurs sont différents.'
> 142 |   ).toBe(0);
      |     ^ Error: Les configurations ou les prix des deux configurateurs sont différents.
  143 | }
```