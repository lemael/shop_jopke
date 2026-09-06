import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const START_URL = 'https://www.jopke.de/shop/din-lang-mailing';
const OUTPUT_JSON = path.resolve('tmp/jopke-fensterhuelle-combinations.json');
const OUTPUT_CSV = path.resolve('tmp/jopke-fensterhuelle-combinations.csv');

const CONFIGURATOR_FORM_SELECTOR = 'form[action^="/konfigurator/"], form[action^="/shop/loadArticleByAttachments"]';
const TARGET_ATTACHMENT_IDS = ['toggle-FH1000', 'toggle-A1000'];
const TARGET_FENSTERHUELLE_COLORS = ['unbedruckt', '1/0-farbig Schwarz', '1/1-farbig Schwarz', '4/0-farbig Euroskala', '4/4-farbig Euroskala'];
const TARGET_ANSCHREIBEN_GRAMMATURES = ['80 g/m²', '90 g/m²'];
const TARGET_ANSCHREIBEN_COLORS = ['4/0-farbig Euroskala', '4/4-farbig Euroskala', '4/1-farbig Euroskala/Schwarz', '1/0-farbig Schwarz', '1/1-farbig Schwarz'];
const TARGET_AMOUNT = '500';

function csvEscape(value) {
  const text = String(value ?? '');
  if (/["\n,;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

async function getConfiguratorForm(page) {
  const form = page.locator(CONFIGURATOR_FORM_SELECTOR).first();
  if ((await form.count()) === 0) {
    return null;
  }
  return form;
}

function getChoiceId(choice) {
  if (choice.kind === 'checkbox-set') {
    return choice.selectedIds.join('+') || '__empty__';
  }
  if (choice.kind === 'submit-button') {
    const name = choice.control.name || 'submit';
    const value = choice.control.value || choice.control.label || 'continue';
    return `${name}=${value}`;
  }
  return choice.control.id || choice.control.name || `${choice.control.type}:${choice.control.value || ''}`;
}

async function readStep(page) {
  const form = await getConfiguratorForm(page);
  if (!form) {
    return null;
  }

  return form.evaluate((currentForm) => {
    const fieldControls = Array.from(currentForm.querySelectorAll('input, select'))
      .map((element) => {
        const type = element.getAttribute('type') || element.tagName.toLowerCase();
        const disabled = 'disabled' in element ? element.disabled : false;
        const checked = 'checked' in element ? element.checked : false;
        const hidden = type === 'hidden';
        const label = element.closest('label')?.innerText || element.closest('p, div')?.innerText || '';

        const options = element.tagName === 'SELECT'
          ? Array.from(element.options).map((option) => ({
              value: option.value,
              text: option.textContent || '',
              disabled: option.disabled,
              selected: option.selected,
            }))
          : [];

        return {
          id: element.id || '',
          name: element.getAttribute('name') || '',
          tag: element.tagName.toLowerCase(),
          type,
          value: element.getAttribute('value') || '',
          checked,
          disabled,
          hidden,
          label: label.replace(/\s+/g, ' ').trim(),
          placeholder: element.getAttribute('placeholder') || '',
          min: element.getAttribute('min') || '',
          max: element.getAttribute('max') || '',
          options,
        };
      })
      .filter((control) => !control.hidden && !control.disabled && control.type !== 'hidden');

    const submitButtons = Array.from(currentForm.querySelectorAll('button[type="submit"]'))
      .map((button) => ({
        id: button.id || '',
        name: button.getAttribute('name') || '',
        tag: 'button',
        type: 'submit',
        value: button.getAttribute('value') || '',
        checked: false,
        disabled: button.disabled,
        hidden: false,
        label: (button.textContent || '').replace(/\s+/g, ' ').trim(),
        placeholder: '',
        min: '',
        max: '',
        options: [],
      }))
      .filter((button) => !button.disabled);

    const controls = [...fieldControls, ...submitButtons];

    const heading = currentForm.querySelector('h2, h1, h3')?.textContent || '';

    return {
      action: currentForm.getAttribute('action') || '',
      method: currentForm.getAttribute('method') || '',
      heading: heading.replace(/\s+/g, ' ').trim(),
      controls,
      signature: [
        currentForm.getAttribute('action') || '',
        heading,
        controls
          .map((control) => [
            control.id,
            control.name,
            control.tag,
            control.type,
            control.value,
            control.checked ? '1' : '0',
            control.label,
            control.options.map((option) => `${option.value}:${option.selected ? '1' : '0'}:${option.disabled ? '1' : '0'}`).join(','),
          ].join('|'))
          .join('||'),
      ].join('::'),
    };
  });
}

async function isErrorPage(page) {
  const title = normalizeText(await page.title());
  if (title.startsWith('500')) {
    return true;
  }

  const body = normalizeText(await page.locator('body').innerText());
  return body.includes('500 - Server Fehler') || body.includes('Es ist ein Fehler aufgetreten.');
}

async function isFinalOverviewStep(page) {
  const url = page.url();
  if (url.includes('/order-overview')) {
    return true;
  }

  const title = normalizeText(await page.title()).toLowerCase();
  if (title.includes('bestellübersicht') || title.includes('preisübersicht')) {
    return true;
  }

  const body = normalizeText(await page.locator('body').innerText()).toLowerCase();
  return body.includes('bestellübersicht') || body.includes('preisübersicht');
}

async function followConfiguratorLink(page) {
  const targetProductLink = page
    .locator('a[href="/shop/fensterhulle/attachments"]')
    .filter({ hasText: /Fensterhülle/i })
    .first();
  if ((await targetProductLink.count()) > 0) {
    await targetProductLink.click({ force: true });
    await page.waitForLoadState('networkidle');
    return true;
  }

  const link = page
    .locator('a[href^="/konfigurator/"]')
    .filter({ hasText: /Produkt konfigurieren|Weiter/i })
    .first();
  if ((await link.count()) === 0) {
    return false;
  }

  const href = await link.getAttribute('href');
  if (!href) {
    return false;
  }

  await page.goto(new URL(href, page.url()).toString(), { waitUntil: 'networkidle' });
  return true;
}

async function advanceToInteractiveState(page) {
  while (true) {
    if (await isErrorPage(page)) {
      return 'error';
    }

    if (await isFinalOverviewStep(page)) {
      return 'final';
    }

    const step = await readStep(page);
    if (step) {
      return 'step';
    }

    const progressed = await followConfiguratorLink(page);
    if (!progressed) {
      return 'none';
    }
  }
}


async function waitForStepChange(page, previousSignature) {
  const changed = await page.waitForFunction(
    (signature) => {
      const form = Array.from(document.querySelectorAll('form')).find((candidate) => {
        const action = candidate.getAttribute('action') || '';
        return action.startsWith('/konfigurator/') || action.startsWith('/shop/loadArticleByAttachments');
      });

      if (!form) {
        return true;
      }

      const heading = form.querySelector('h2, h1, h3')?.textContent || '';
      const fieldControls = Array.from(form.querySelectorAll('input, select'))
        .filter((element) => {
          const type = element.getAttribute('type') || element.tagName.toLowerCase();
          return type !== 'hidden' && !('disabled' in element && element.disabled);
        })
        .map((element) => {
          const options = element.tagName === 'SELECT'
            ? Array.from(element.options).map((option) => `${option.value}:${option.selected ? '1' : '0'}`)
            : [];

          return [
            element.id || '',
            element.getAttribute('name') || '',
            element.tagName.toLowerCase(),
            element.getAttribute('type') || '',
            'checked' in element ? (element.checked ? '1' : '0') : '',
            element.getAttribute('value') || '',
            options.join(','),
          ].join('|');
        })
        .join('||');

      const submitButtons = Array.from(form.querySelectorAll('button[type="submit"]'))
        .filter((button) => !button.disabled)
        .map((button) => [
          button.id || '',
          button.getAttribute('name') || '',
          button.getAttribute('value') || '',
          (button.textContent || '').replace(/\s+/g, ' ').trim(),
        ].join('|'))
        .join('||');

      const nextSignature = [form.getAttribute('action') || '', heading, fieldControls, submitButtons].join('::');
      return nextSignature !== signature;
    },
    previousSignature,
    { timeout: 10000 },
  ).then(() => true).catch(() => false);

  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(150);

  if (changed) {
    return true;
  }

  const current = await readStep(page);
  return current?.signature !== previousSignature;
}

function isAbgeschlossenContinueStep(step) {
  if (!step) {
    return false;
  }

  const heading = normalizeText(step.heading).toLowerCase();
  if (!heading.includes('abgeschlossen')) {
    return false;
  }

  return step.controls.some((control) =>
    control.tag === 'button'
    && control.type === 'submit'
    && !control.name
    && normalizeText(control.label).toLowerCase().includes('weiter'),
  );
}

async function resolveAbgeschlossenBlockage(page, previousSignature) {
  const step = await readStep(page);
  if (!isAbgeschlossenContinueStep(step)) {
    return false;
  }

  const button = page.locator('button[type="submit"]').filter({ hasText: 'Weiter' }).first();
  if ((await button.count()) === 0) {
    return false;
  }

  await button.click({ force: true });
  return waitForStepChange(page, previousSignature);
}

async function submitConfiguratorForm(page) {
  const form = await getConfiguratorForm(page);
  if (!form) {
    return;
  }

  const signatureBefore = await readStep(page).then((step) => step?.signature || '');
  const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
  if ((await submitButton.count()) > 0) {
      await form.evaluate((element) => {
        const submitButton = element.querySelector('button[type="submit"], input[type="submit"]');
        if (typeof element.requestSubmit === 'function') {
          element.requestSubmit(submitButton || undefined);
          return;
        }

        if (submitButton) {
          submitButton.click();
          return;
        }

        element.submit();
      });
  } else {
    await form.evaluate((element) => {
      if (typeof element.requestSubmit === 'function') {
        element.requestSubmit();
      } else {
        element.submit();
      }
    });
  }
  const progressed = await waitForStepChange(page, signatureBefore);

  if (!progressed) {
    const resolved = await resolveAbgeschlossenBlockage(page, signatureBefore);
    if (!resolved) {
      throw new Error('Form submission did not progress and no abgeschlossen->Weiter blockage was detected.');
    }
  }
}

function getStepChoices(step) {
  const controls = step?.controls || [];
  const submitButtons = controls.filter((control) => control.tag === 'button' && control.type === 'submit');
  const numberControls = controls.filter((control) => control.tag === 'input' && control.type === 'number');
  const heading = normalizeText(step?.heading).toLowerCase();
  const action = String(step?.action || '').toLowerCase();

  if (action.includes('/shop/loadarticlebyattachments') || heading.includes('wählen sie ihren inhalt')) {
    return [{ kind: 'checkbox-set', selectedIds: TARGET_ATTACHMENT_IDS }];
  }

  if (numberControls.length > 0 && heading.includes('auflage')) {
    return [{ kind: 'number', control: numberControls[0], value: TARGET_AMOUNT }];
  }

  if (submitButtons.length > 0 && heading.includes('fensterhülle') && heading.includes('farbigkeit')) {
    return TARGET_FENSTERHUELLE_COLORS
      .map((value) => submitButtons.find((control) => control.name === 'color' && control.value === value))
      .filter(Boolean)
      .map((control) => ({ kind: 'submit-button', control, label: control.label }));
  }

  if (submitButtons.length > 0 && heading.includes('anschreiben') && heading.includes('grammatur')) {
    return TARGET_ANSCHREIBEN_GRAMMATURES
      .map((value) => submitButtons.find((control) => control.name === 'grammage' && control.value === value))
      .filter(Boolean)
      .map((control) => ({ kind: 'submit-button', control, label: control.label }));
  }

  if (submitButtons.length > 0 && heading.includes('anschreiben') && heading.includes('farbigkeit')) {
    return TARGET_ANSCHREIBEN_COLORS
      .map((value) => submitButtons.find((control) => control.name === 'color' && control.value === value))
      .filter(Boolean)
      .map((control) => ({ kind: 'submit-button', control, label: control.label }));
  }

  return [];
}

async function advancePastAbgeschlossen(page) {
  while (true) {
    const step = await readStep(page);
    if (!isAbgeschlossenContinueStep(step)) {
      return;
    }

    await submitConfiguratorForm(page);
    const state = await advanceToInteractiveState(page);
    if (state !== 'step' && state !== 'final') {
      return;
    }
  }
}

async function applyChoice(page, choice) {
  if (choice.kind === 'submit-button') {
    const form = await getConfiguratorForm(page);
    if (!form) {
      throw new Error('Configurator form is missing for submit-button choice.');
    }

    const signatureBefore = await readStep(page).then((step) => step?.signature || '');
    let button;
    if (choice.control.name) {
      button = page.locator(`button[type="submit"][name="${choice.control.name}"][value="${choice.control.value}"]`).first();
    } else if (choice.control.value) {
      button = page.locator(`button[type="submit"][value="${choice.control.value}"]`).first();
    } else {
      button = form.locator('button[type="submit"]').first();
    }

    if ((await button.count()) === 0) {
      button = form.locator('button[type="submit"]').first();
    }

      await form.evaluate((element, submitSelector) => {
        const submitButton = submitSelector ? element.querySelector(submitSelector) : null;
        if (typeof element.requestSubmit === 'function') {
          element.requestSubmit(submitButton || undefined);
          return;
        }

        if (submitButton) {
          submitButton.click();
          return;
        }

        element.submit();
      }, await button.evaluate((element) => {
        const name = element.getAttribute('name') || '';
        const value = element.getAttribute('value') || '';
        if (name && value) {
          return `button[type="submit"][name="${name}"][value="${value}"]`;
        }
        if (value) {
          return `button[type="submit"][value="${value}"]`;
        }
        return '';
      }));
    const progressed = await waitForStepChange(page, signatureBefore);
    if (!progressed) {
      const resolved = await resolveAbgeschlossenBlockage(page, signatureBefore);
      if (!resolved) {
        throw new Error(`Submit-button choice did not progress: ${choice.control.name || 'submit'}=${choice.control.value || choice.control.label || ''}`);
      }
    }
    return true;
  }

  if (choice.kind === 'checkbox-set') {
    const wanted = new Set(choice.selectedIds);
    const controls = await readStep(page).then((step) => step?.controls || []);
    for (const control of controls.filter((item) => item.tag === 'input' && item.type === 'checkbox')) {
      const locator = page.locator(`[id="${control.id}"]`);
      const shouldBeChecked = wanted.has(control.id || control.name || control.value);
      await locator.evaluate((element, desiredChecked) => {
        if (element.checked !== desiredChecked) {
          element.click();
        }
      }, shouldBeChecked);
    }
    return;
  }

  if (choice.kind === 'radio') {
    await page.locator(`[id="${choice.control.id}"]`).evaluate((element) => {
      element.click();
    });
    return;
  }

  if (choice.kind === 'select') {
    await page.locator(`[id="${choice.control.id}"]`).selectOption(choice.value);
    return;
  }

  if (choice.kind === 'number') {
    await page.locator(`[id="${choice.control.id}"]`).evaluate((element, value) => {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }, choice.value);
  }

  return false;
}

async function openStart(page) {
  await page.goto(START_URL, { waitUntil: 'networkidle' });
}

async function collectLeaf(page, pathChoices) {
  const title = await page.title();
  const body = await page.locator('body').innerText();
  const url = page.url();
  return {
    pathChoices: pathChoices.map((choice) => ({
      kind: choice.kind,
      id: getChoiceId(choice),
      label: choice.label || choice.control?.label || '',
      value: choice.value || '',
    })),
    url,
    title,
    body,
  };
}

async function submitFormInContext(page) {
  const form = await getConfiguratorForm(page);
  if (!form) {
    throw new Error('Expected configurator form is missing.');
  }

  await form.evaluate((element) => {
    const submitButton = element.querySelector('button[type="submit"], input[type="submit"]');
    if (typeof element.requestSubmit === 'function') {
      element.requestSubmit(submitButton || undefined);
      return;
    }

    if (submitButton) {
      submitButton.click();
      return;
    }

    element.submit();
  });

  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(120);
}

async function reachAuflageStep(page) {
  await page.goto(START_URL, { waitUntil: 'networkidle' });

  await page
    .locator('a[href="/shop/fensterhulle/attachments"]')
    .filter({ hasText: /Fensterhülle/i })
    .first()
    .click({ force: true });
  await page.waitForLoadState('networkidle');

  await page.locator('#toggle-FH1000').check();
  await page.locator('#toggle-A1000').check();
  await submitFormInContext(page);

  await page
    .locator('a[href="/konfigurator/fensterhulle/anschreiben"]')
    .first()
    .click({ force: true });
  await page.waitForLoadState('networkidle');

  const amountInput = page.locator('#amount').first();
  if ((await amountInput.count()) === 0) {
    throw new Error('Auflage input #amount was not found.');
  }
}

async function continueIfAbgeschlossen(page) {
  const step = await readStep(page);
  if (!isAbgeschlossenContinueStep(step)) {
    return;
  }

  const weiterButton = page.locator('button[type="submit"]').filter({ hasText: 'Weiter' }).first();
  if ((await weiterButton.count()) === 0) {
    return;
  }

  await weiterButton.click({ force: true });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(120);
}

async function exploreTargetFlow(page, results) {
  for (const fensterhuelleColor of TARGET_FENSTERHUELLE_COLORS) {
    for (const grammatur of TARGET_ANSCHREIBEN_GRAMMATURES) {
      for (const anschreibenColor of TARGET_ANSCHREIBEN_COLORS) {
        await reachAuflageStep(page);

        await page.locator('#amount').fill(TARGET_AMOUNT);
        await submitFormInContext(page);

        await page.locator(`button[type="submit"][name="color"][value="${fensterhuelleColor}"]`).first().click({ force: true });
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);
        await page.waitForTimeout(120);

        await continueIfAbgeschlossen(page);

        await page.locator(`button[type="submit"][name="grammage"][value="${grammatur}"]`).first().click({ force: true });
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);
        await page.waitForTimeout(120);

        await page.locator(`button[type="submit"][name="color"][value="${anschreibenColor}"]`).first().click({ force: true });
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);
        await page.waitForTimeout(150);

        if (!(await isFinalOverviewStep(page))) {
          continue;
        }

        results.push(await collectLeaf(page, [
          { kind: 'checkbox-set', selectedIds: TARGET_ATTACHMENT_IDS },
          { kind: 'number', control: { id: 'amount', name: 'amount', type: 'number', value: TARGET_AMOUNT }, value: TARGET_AMOUNT },
          { kind: 'submit-button', control: { id: '', name: 'color', value: fensterhuelleColor, label: fensterhuelleColor }, label: fensterhuelleColor },
          { kind: 'submit-button', control: { id: '', name: 'grammage', value: grammatur, label: grammatur }, label: grammatur },
          { kind: 'submit-button', control: { id: '', name: 'color', value: anschreibenColor, label: anschreibenColor }, label: anschreibenColor },
        ]));
      }
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });
  const results = [];

  try {
    await openStart(page);
    await exploreTargetFlow(page, results);

    await fs.mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
    await fs.writeFile(OUTPUT_JSON, `${JSON.stringify(results, null, 2)}\n`, 'utf8');

    const rows = [
      ['path', 'title', 'body'],
      ...results.map((entry) => [
        JSON.stringify(entry.pathChoices ?? []),
        entry.title ?? '',
        normalizeText(entry.body ?? ''),
      ]),
    ];

    await fs.writeFile(
      OUTPUT_CSV,
      `${rows.map((row) => row.map(csvEscape).join(';')).join('\n')}\n`,
      'utf8',
    );

    console.log(JSON.stringify({ count: results.length, json: OUTPUT_JSON, csv: OUTPUT_CSV }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
