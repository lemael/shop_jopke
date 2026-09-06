import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const START_URL = 'https://www.jopke.de/shop/din-lang-mailing';
const OUTPUT_JSON = path.resolve('tmp/jopke-fensterhuelle-antwortkarte-combinations.json');
const OUTPUT_CSV = path.resolve('tmp/jopke-fensterhuelle-antwortkarte-combinations.csv');

const TARGET_ATTACHMENT_IDS = ['toggle-FH1000', 'toggle-A1000', 'toggle-AK1000'];
const TARGET_AMOUNTS = ['500'];
const TARGET_FENSTERHUELLE_COLORS = ['unbedruckt', '1/0-farbig Schwarz', '1/1-farbig Schwarz', '4/0-farbig Euroskala', '4/4-farbig Euroskala'];
const TARGET_ANSCHREIBEN_GRAMMATURES = ['80 g/m²', '90 g/m²'];
const TARGET_ANSCHREIBEN_COLORS = ['4/0-farbig Euroskala', '4/4-farbig Euroskala', '4/1-farbig Euroskala/Schwarz', '1/0-farbig Schwarz', '1/1-farbig Schwarz'];
const TARGET_ANTWORTKARTE_SIZES = ['210 x 99 mm', '210 x 105 mm'];
const TARGET_ANTWORTKARTE_GRAMMATURES = ['170 g/m²', '250 g/m²'];
const TARGET_ANTWORTKARTE_FINISHES = ['matt', 'glänzend'];

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/["\n,;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

async function waitReady(page) {
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(120);
}

async function waitForConfiguratorForm(page, timeout = 15000) {
  await page.waitForSelector('form[action^="/konfigurator/"]', { timeout });
}

async function submitCurrentForm(page) {
  const form = page.locator('form[action^="/konfigurator/"], form[action^="/shop/loadArticleByAttachments"]').first();
  if ((await form.count()) === 0) {
    throw new Error('Expected form was not found before submit.');
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

  await waitReady(page);
}

async function setCheckbox(page, id, checked) {
  await page.locator(`#${id}`).evaluate((element, desiredChecked) => {
    if (element.checked !== desiredChecked) {
      element.click();
    }
  }, checked);
}

async function clickSubmitValue(page, name, value) {
  const normalize = (text) => normalizeText(text).toLowerCase();
  const expectedValue = normalize(value);

  await waitForConfiguratorForm(page);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    let button = page.locator(`button[type="submit"][name="${name}"][value="${value}"]`).first();
    if ((await button.count()) === 0) {
      const allButtons = page.locator(`form[action^="/konfigurator/"] button[type="submit"][name="${name}"]`);
      const count = await allButtons.count();
      for (let i = 0; i < count; i += 1) {
        const candidate = allButtons.nth(i);
        const candidateValue = normalize(await candidate.getAttribute('value'));
        if (candidateValue === expectedValue) {
          button = candidate;
          break;
        }
      }
    }

    if ((await button.count()) > 0) {
      await button.click({ force: true });
      await waitReady(page);
      return;
    }

    await waitReady(page);
  }

  throw new Error(`Submit button not found: ${name}=${value}`);
}

async function continueIfAbgeschlossen(page) {
  while (true) {
    await waitForConfiguratorForm(page, 10000).catch(() => null);

    const heading = normalizeText(
      await page
        .locator('form[action^="/konfigurator/"] h1, form[action^="/konfigurator/"] h2, form[action^="/konfigurator/"] h3')
        .first()
        .textContent()
        .catch(() => ''),
    ).toLowerCase();

    if (!heading.includes('abgeschlossen')) {
      return;
    }

    const weiterButton = page.locator('form[action^="/konfigurator/"] button[type="submit"]').filter({ hasText: 'Weiter' }).first();
    if ((await weiterButton.count()) === 0) {
      return;
    }

    await weiterButton.click({ force: true });
    await waitReady(page);
  }
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

async function collectLeaf(page, pathChoices) {
  return {
    pathChoices,
    url: page.url(),
    title: await page.title(),
    body: await page.locator('body').innerText(),
  };
}

async function reachConfigurator(page) {
  await page.goto(START_URL, { waitUntil: 'networkidle' });

  await page
    .locator('a[href="/shop/fensterhulle/attachments"]')
    .filter({ hasText: /Fensterhülle/i })
    .first()
    .click({ force: true });
  await waitReady(page);

  await setCheckbox(page, 'toggle-FH1000', true);
  await setCheckbox(page, 'toggle-A1000', true);
  await setCheckbox(page, 'toggle-AK1000', true);
  await submitCurrentForm(page);

  // The site can briefly show a loading title/URL before reaching the overview.
  await page
    .waitForURL((url) => !url.toString().includes('/shop/fensterhulle/attachments'), { timeout: 15000 })
    .catch(() => null);
  await waitReady(page);
  await page.waitForSelector('a[href^="/konfigurator/"]', { timeout: 15000 }).catch(() => null);

  let configLink = page
    .locator('a[href^="/konfigurator/fensterhulle/anschreiben-antwortkarte"]')
    .first();
  if ((await configLink.count()) === 0) {
    configLink = page.locator('a[href^="/konfigurator/"]').filter({ hasText: /Produkt konfigurieren/i }).first();
  }
  if ((await configLink.count()) === 0) {
    throw new Error('Configurator link for anschreiben-antwortkarte was not found.');
  }

  await configLink.click({ force: true });
  await waitReady(page);
  await waitForConfiguratorForm(page);

  if ((await page.locator('#amount').count()) === 0) {
    throw new Error('Amount input was not found in the configurator.');
  }
}

async function runOneCombination(page, combination) {
  await reachConfigurator(page);

  await page.locator('#amount').fill(combination.amount);
  await submitCurrentForm(page);

  await clickSubmitValue(page, 'color', combination.fensterhuelleColor);
  await continueIfAbgeschlossen(page);

  await clickSubmitValue(page, 'grammage', combination.anschreibenGrammatur);
  await clickSubmitValue(page, 'color', combination.anschreibenColor);
  await continueIfAbgeschlossen(page);

  await clickSubmitValue(page, 'size', combination.antwortkarteSize);
  await clickSubmitValue(page, 'grammage', combination.antwortkarteGrammatur);
  await clickSubmitValue(page, 'finish', combination.antwortkarteFinish);

  if (!(await isFinalOverviewStep(page))) {
    throw new Error('Preisübersicht was not reached for this combination.');
  }

  return collectLeaf(page, [
    { kind: 'checkbox-set', id: TARGET_ATTACHMENT_IDS.join('+'), label: '', value: '' },
    { kind: 'number', id: 'amount', label: '', value: combination.amount },
    { kind: 'submit-button', id: `color=${combination.fensterhuelleColor}`, label: combination.fensterhuelleColor, value: '' },
    { kind: 'submit-button', id: `grammage=${combination.anschreibenGrammatur}`, label: combination.anschreibenGrammatur, value: '' },
    { kind: 'submit-button', id: `color=${combination.anschreibenColor}`, label: combination.anschreibenColor, value: '' },
    { kind: 'submit-button', id: `size=${combination.antwortkarteSize}`, label: combination.antwortkarteSize, value: '' },
    { kind: 'submit-button', id: `grammage=${combination.antwortkarteGrammatur}`, label: combination.antwortkarteGrammatur, value: '' },
    { kind: 'submit-button', id: `finish=${combination.antwortkarteFinish}`, label: combination.antwortkarteFinish, value: '' },
  ]);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });
  const results = [];

  try {
    for (const amount of TARGET_AMOUNTS) {
      for (const fensterhuelleColor of TARGET_FENSTERHUELLE_COLORS) {
        for (const anschreibenGrammatur of TARGET_ANSCHREIBEN_GRAMMATURES) {
          for (const anschreibenColor of TARGET_ANSCHREIBEN_COLORS) {
            for (const antwortkarteSize of TARGET_ANTWORTKARTE_SIZES) {
              for (const antwortkarteGrammatur of TARGET_ANTWORTKARTE_GRAMMATURES) {
                for (const antwortkarteFinish of TARGET_ANTWORTKARTE_FINISHES) {
                  const combination = {
                    amount,
                    fensterhuelleColor,
                    anschreibenGrammatur,
                    anschreibenColor,
                    antwortkarteSize,
                    antwortkarteGrammatur,
                    antwortkarteFinish,
                  };

                  const leaf = await runOneCombination(page, combination);
                  results.push(leaf);
                }
              }
            }
          }
        }
      }
    }

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
