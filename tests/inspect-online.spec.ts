
import { test } from '@playwright/test';

test('Inspecter le configurateur en ligne', async ({ page }) => {
  await page.goto('https://www.jopke.de/shop/din-c4-mailing');

  await page.waitForLoadState('domcontentloaded');

  // Afficher le titre et l'URL
  console.log('URL :', page.url());
  console.log('Titre :', await page.title());

  // Récupérer le HTML de la page
  const html = await page.locator('body').evaluate(
    element => element.outerHTML
  );

  console.log('HTML récupéré :', html);

  // Inspecter les boutons
  const buttons = page.locator('button:visible');
  const buttonCount = await buttons.count();

  console.log('Nombre de boutons visibles :', buttonCount);

  for (let i = 0; i < buttonCount; i++) {
    const button = buttons.nth(i);

    console.log({
      index: i,
      text: (await button.innerText()).trim(),
      type: await button.getAttribute('type'),
      ariaLabel: await button.getAttribute('aria-label'),
      className: await button.getAttribute('class'),
      disabled: await button.isDisabled(),
    });
  }

  // Inspecter les champs de formulaire
  const fields = page.locator(
    'input:visible, select:visible, textarea:visible'
  );

  for (let i = 0; i < await fields.count(); i++) {
    const field = fields.nth(i);

    console.log({
      tag: await field.evaluate(element => element.tagName),
      type: await field.getAttribute('type'),
      name: await field.getAttribute('name'),
      id: await field.getAttribute('id'),
      placeholder: await field.getAttribute('placeholder'),
      value: await field.inputValue().catch(() => ''),
    });
  }

  // Enregistrer une copie du HTML pour analyse
  await page.locator('body').evaluate(element => {
    const blob = new Blob(
      [element.outerHTML],
      { type: 'text/html' }
    );

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'online-configurator.html';
    link.click();

    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });
});
