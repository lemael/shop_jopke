# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inspect-compare-dinC4-HuelleOhneFenster/zz-localdev.spec.ts >> Comparer les configurateurs : 10001 Stück – Staffel – Broschüre 8(4+4)Seiten
- Location: inspect-compare-dinC4-HuelleOhneFenster/zz-localdev.spec.ts:19:5

# Error details

```
Error: Les configurations ou les prix des deux configurateurs sont différents.

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Test source

```ts
  65  |   ];
  66  | 
  67  |   let differences = 0;
  68  | 
  69  |   const comparer = (nom: string, local: string, online: string) => {
  70  |     console.log(`\n${nom}:`);
  71  |     console.log(`  Local  : ${local}`);
  72  |     console.log(`  Online : ${online}`);
  73  | 
  74  |     const identique = local === online;
  75  | 
  76  |     console.log(identique ? '✓ Identique' : '✗ Différent');
  77  |     rapport.push(`| ${nom} | ${local} | ${online} | - | ${identique ? '✅' : '❌'} |`);
  78  | 
  79  |     if (!identique) differences++;
  80  |   };
  81  | 
  82  |   for (const cle of clesConfiguration) {
  83  |     comparer(cle, configurationLocale[cle], configurationOnline[cle]);
  84  |   }
  85  | 
  86  |   // Chaque Flyer est comparé séparément (valeurs séparées par " | ").
  87  |   const flyersLocal = configurationLocale.flyers ? configurationLocale.flyers.split(' | ') : [];
  88  |   const flyersOnline = configurationOnline.flyers ? configurationOnline.flyers.split(' | ') : [];
  89  |   const nombreFlyers = Math.max(flyersLocal.length, flyersOnline.length);
  90  | 
  91  |   for (let i = 0; i < nombreFlyers; i++) {
  92  |     comparer(`Flyer ${i + 1}`, flyersLocal[i] ?? '(absent)', flyersOnline[i] ?? '(absent)');
  93  |   }
  94  | 
  95  |   console.log('\n========== COMPARAISON DES PRIX ==========');
  96  |   rapport.push('', '## Prix et poids', '', ...enTete);
  97  | 
  98  |   const clesPrix: (keyof PrixCompare)[] = [
  99  |     'produit',
  100 |     'porto',
  101 |     'express',
  102 |     'totalNet',
  103 |     'tva',
  104 |     'totalBrut',
  105 |     'gewichtProSendung',
  106 |     'gesamtgewicht',
  107 |   ];
  108 | 
  109 |   for (const cle of clesPrix) {
  110 |     const local = prixLocal[cle];
  111 |     const online = prixOnline[cle];
  112 | 
  113 |     // Option proposée d'un seul côté : comparaison textuelle, sans écart chiffré.
  114 |     if (local === PRIX_NON_DISPONIBLE || online === PRIX_NON_DISPONIBLE) {
  115 |       const identique = local === online;
  116 |       console.log(`\n${cle}:`);
  117 |       console.log(`  Local  : ${local}`);
  118 |       console.log(`  Online : ${online}`);
  119 |       console.log(identique ? '✓ Identique' : '✗ Différent (option proposée d’un seul côté)');
  120 |       rapport.push(`| ${cle} | ${local} | ${online} | - | ${identique ? '✅' : '❌'} |`);
  121 |       if (!identique) differences++;
  122 |       continue;
  123 |     }
  124 | 
  125 |     const valeurLocale = convertirValeurEnNombre(local, cle, 'local');
  126 |     const valeurOnline = convertirValeurEnNombre(online, cle, 'en ligne');
  127 | 
  128 |     const ecart = Math.round((valeurLocale - valeurOnline) * 100) / 100;
  129 |     const identique = ecart === 0;
  130 | 
  131 |     console.log(`\n${cle}:`);
  132 |     console.log(`  Local  : ${local}`);
  133 |     console.log(`  Online : ${online}`);
  134 |     const unite = cle === 'gewichtProSendung'
  135 |       ? ' g'
  136 |       : cle === 'gesamtgewicht'
  137 |         ? ' kg'
  138 |         : ' €';
  139 |     console.log(`  Écart  : ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite}`);
  140 | 
  141 |     console.log(identique ? '✓ Identique' : '✗ Différent');
  142 |     rapport.push(
  143 |       `| ${cle} | ${local} | ${online} | ${ecart > 0 ? '+' : ''}${ecart.toFixed(2).replace('.', ',')}${unite} | ${identique ? '✅' : '❌'} |`
  144 |     );
  145 | 
  146 |     if (!identique) differences++;
  147 |   }
  148 | 
  149 |   console.log('\n========== RÉSULTAT FINAL ==========');
  150 |   console.log(`Nombre de différences : ${differences}`);
  151 | 
  152 |   rapport.push('', `**Nombre de différences : ${differences}**`, '');
  153 | 
  154 |   const nomFichier = nomScenario
  155 |     .toLowerCase()
  156 |     .replace(/[^a-z0-9]+/g, '-')
  157 |     .replace(/^-|-$/g, '');
  158 |   await mkdir('./resultats', { recursive: true });
  159 |   await writeFile(`./resultats/${nomFichier}.md`, rapport.join('\n'), 'utf-8');
  160 |   console.log(`[MD] Résultat sauvegardé dans tests/resultats/${nomFichier}.md`);
  161 | 
  162 |   expect(
  163 |     differences,
  164 |     'Les configurations ou les prix des deux configurateurs sont différents.'
> 165 |   ).toBe(0);
      |     ^ Error: Les configurations ou les prix des deux configurateurs sont différents.
  166 | }
```