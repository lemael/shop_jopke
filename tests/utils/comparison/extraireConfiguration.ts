import { type Page } from '@playwright/test';

export async function extraireConfiguration(page: Page) {
  const lignes = await page.locator('p').evaluateAll(paragraphes => {
    return paragraphes.map(p => {
      const span = p.querySelector(':scope > span');

      if (!span) return null;

      const libelle = span.textContent?.trim().replace(/:$/, '') ?? '';

      const valeur = p.textContent
        ?.replace(span.textContent ?? '', '')
        .trim() ?? '';

      if (!libelle || !valeur) return null;

      return { libelle, valeur };
    }).filter(
      (ligne): ligne is { libelle: string; valeur: string } => ligne !== null
    );
  });

  const configuration: Record<string, string> = {};

  for (const ligne of lignes) {
    configuration[ligne.libelle] = ligne.valeur;
  }

  return configuration;
}