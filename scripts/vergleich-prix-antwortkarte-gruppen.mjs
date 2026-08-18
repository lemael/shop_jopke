/**
 * Vergleich der 8 Antwortkarte-Gruppen:
 *  - Preis berechnet mit der Logik des Projekts (berechnePreis, src/lib/mailingPreis.ts)
 *  - Preis wirklich auf jopke.de abgefragt (tmp/jopke-fensterhuelle-antwortkarte-gruppen.json)
 *
 * Nutzung:  node scripts/vergleich-prix-antwortkarte-gruppen.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const JOPKE_JSON = path.resolve('tmp/jopke-fensterhuelle-antwortkarte-gruppen.json');

// ---------------------------------------------------------------------------
// Logik von src/lib/mailingPreis.ts (berechnePreis) — nur die für diese Konfig
// (Fensterhülle | Anschreiben + Antwortkarte) relevanten Konstanten.
// ---------------------------------------------------------------------------

const AUFLAGE_STAFFEL = [500, 1000, 2000, 3000, 5000, 10000, 20000, 50000, 100000];

const AUSSTATTUNG_CONFIG = {
  'Fensterhülle|Anschreiben + Antwortkarte': {
    hatBroschuere: false,
    staffeln: [
      { maxAuflage: 5000, fixpreis: 240.03, preisPro1000: 157.36, expressProzent: 0.29 },
      { maxAuflage: 10000, fixpreis: 274.824, preisPro1000: 135.696, expressProzent: 0.21 },
      { maxAuflage: 50000, fixpreis: 259.209, preisPro1000: 127.986, expressProzent: 0.19 },
      { maxAuflage: 100000, fixpreis: 243.594, preisPro1000: 120.276, expressProzent: 0.175 },
    ],
  },
};

const HUELLEN_FARBIGKEIT_DELTA_KURVEN = {
  'Fensterhülle': {
    '1/0-farbig Schwarz': { 500: 75.36, 1000: 88.32, 5000: 192, 10000: 232.48, 50000: 664.16, 100000: 1111.04 },
    '1/1-farbig Schwarz': { 500: 84, 1000: 99.36, 5000: 222.24, 10000: 278.4, 50000: 845.28, 100000: 1449.28 },
    '4/0-farbig Euroskala': { 500: 79.6, 1000: 98.56, 5000: 250.24, 10000: 358.72, 50000: 1240.8, 100000: 1895.84 },
    '4/4-farbig Euroskala': { 500: 79.6, 1000: 98.56, 5000: 250.24, 10000: 358.72, 50000: 1360, 100000: 2688 },
  },
};

const ANSCHREIBEN_VARIANTEN_DELTA_KURVEN = {
  '80 g/m²|4/4-farbig Euroskala': { 500: 12.4, 1000: 15.52, 5000: 40.48, 10000: 50.4, 50000: 191.36, 100000: 370.24 },
  '80 g/m²|4/1-farbig Euroskala/Schwarz': { 500: 13.68, 1000: 16.64, 5000: 40.32, 10000: 88, 50000: 278.24, 100000: 465.92 },
  '80 g/m²|1/0-farbig Schwarz': { 500: 0.4, 1000: -0.16, 5000: -4.64, 10000: 13.92, 50000: -20.64, 100000: -32.16 },
  '80 g/m²|1/1-farbig Schwarz': { 500: 8.48, 1000: 12, 5000: 40.16, 10000: 86.72, 50000: 280.64, 100000: 484.8 },
  '90 g/m²|4/0-farbig Euroskala': { 500: 0.72, 1000: 0.96, 5000: 2.88, 10000: 4.96, 50000: 20.32, 100000: 45.76 },
  '90 g/m²|4/4-farbig Euroskala': { 500: 13.44, 1000: 16.8, 5000: 43.68, 10000: 56.16, 50000: 217.12, 100000: 420.8 },
  '90 g/m²|4/1-farbig Euroskala/Schwarz': { 500: 14.56, 1000: 17.76, 5000: 43.36, 10000: 94.88, 50000: 308.32, 100000: 517.92 },
  '90 g/m²|1/1-farbig Schwarz': { 500: 9.28, 1000: 13.12, 5000: 43.84, 10000: 93.12, 50000: 310.88, 100000: 537.12 },
};

const ANTWORTKARTE_ENDFORMAT_DELTA_KURVEN = {
  '210 x 99 mm': { 500: 4.48, 1000: 7.2, 5000: 28.96, 10000: 56.16, 50000: 273.76, 100000: 545.76 },
  '210 x 105 mm': { 500: 6.4, 1000: 9.76, 5000: 36.64, 10000: 70.24, 50000: 339.04, 100000: 675.04 },
};

const PORTO_RATE_STAFFEL = {
  500: 0.56, 1000: 0.56, 2000: 0.56, 3000: 0.56,
  5000: 0.38, 10000: 0.38, 20000: 0.38, 50000: 0.38, 100000: 0.38,
};


function runden(wert) {
  return Math.round(wert * 100) / 100;
}

function getStaffelpreis(staffeln, auflage) {
  return staffeln.find((s) => auflage <= s.maxAuflage) ?? null;
}

function berechneDruckPreis(staffel, auflage) {
  return runden(staffel.fixpreis + (auflage / 1000) * staffel.preisPro1000);
}

function berechneDetailDelta(kurve, auflage) {
  if (!kurve) return 0;

  if (auflage <= 5000 && kurve[500] !== undefined && kurve[1000] !== undefined) {
    const preisPro1000 = 2 * (kurve[1000] - kurve[500]);
    const fixpreis = 2 * kurve[500] - kurve[1000];
    return runden(fixpreis + (auflage / 1000) * preisPro1000);
  }
  return 0;
}

function stufenwert(tabelle, auflage) {
  let ergebnis = tabelle[AUFLAGE_STAFFEL[0]];
  for (const stufe of AUFLAGE_STAFFEL) {
    if (auflage >= stufe) ergebnis = tabelle[stufe];
  }
  return ergebnis;
}

/**
 * Reproduction de berechnePreis() de mailingPreis.ts.
 * Paramètres utilisés par le projet (l'Antwortkarte n'y figure pas :
 * le projet ne différencie PAS endformat/grammatur/oberfläche de l'Antwortkarte).
 */
function berechnePreisProjet(params) {
  const { huellentyp, ausstattung, auflage, fensterhuelleFarbigkeit, anschreibenGrammatur, anschreibenFarbigkeit, antwortkarteEndformat } = params;
  const config = AUSSTATTUNG_CONFIG[`${huellentyp}|${ausstattung}`];
  if (!config) return null;
  const staffel = getStaffelpreis(config.staffeln, auflage);
  if (!staffel) return null;

  const huellenDelta = berechneDetailDelta(HUELLEN_FARBIGKEIT_DELTA_KURVEN[huellentyp]?.[fensterhuelleFarbigkeit ?? ''], auflage);
  const anschreibenVariante = anschreibenGrammatur && anschreibenFarbigkeit
    ? `${anschreibenGrammatur}|${anschreibenFarbigkeit}`
    : null;
  const anschreibenVarianteDelta = berechneDetailDelta(
    anschreibenVariante ? ANSCHREIBEN_VARIANTEN_DELTA_KURVEN[anschreibenVariante] : undefined,
    auflage,
  );
  const antwortkarteEndformatDelta = berechneDetailDelta(
    antwortkarteEndformat ? ANTWORTKARTE_ENDFORMAT_DELTA_KURVEN[antwortkarteEndformat] : undefined,
    auflage,
  );

  const druck = runden(berechneDruckPreis(staffel, auflage) + huellenDelta + anschreibenVarianteDelta + antwortkarteEndformatDelta);
  const portoRate = stufenwert(PORTO_RATE_STAFFEL, auflage);
  const porto = runden(auflage * portoRate);
  const expressProzent = staffel.expressProzent ?? 0;
  const expressAufpreis = runden(druck * expressProzent);

  const gesamtNettoStandard = runden(druck + porto);
  const gesamtNettoExpress = runden(gesamtNettoStandard + expressAufpreis);
  const mwstStandard = runden(gesamtNettoStandard * 0.19);
  const gesamtBruttoStandard = runden(gesamtNettoStandard + mwstStandard);

  return { druck, porto, expressAufpreis, gesamtNettoStandard, gesamtNettoExpress, mwstStandard, gesamtBruttoStandard };
}

// ---------------------------------------------------------------------------
// Les 8 groupes (config complète sur les 6 attributs), valeur de référence :
//   Fensterhülle: auflage=500, farbigkeit=1/1-farbig Schwarz
//   Anschreiben:  farbigkeit=1/1-farbig Schwarz
//   Antwortkarte: grammatur=250 g/m²
// ---------------------------------------------------------------------------
const GRUPPEN = [
  { nr: 1, anschreibenGrammatur: '80 g/m²', antwortkarteSize: '210 x 99 mm', antwortkarteFinish: 'matt' },
  { nr: 2, anschreibenGrammatur: '80 g/m²', antwortkarteSize: '210 x 99 mm', antwortkarteFinish: 'glänzend' },
  { nr: 3, anschreibenGrammatur: '80 g/m²', antwortkarteSize: '210 x 105 mm', antwortkarteFinish: 'matt' },
  { nr: 4, anschreibenGrammatur: '80 g/m²', antwortkarteSize: '210 x 105 mm', antwortkarteFinish: 'glänzend' },
  { nr: 5, anschreibenGrammatur: '90 g/m²', antwortkarteSize: '210 x 99 mm', antwortkarteFinish: 'matt' },
  { nr: 6, anschreibenGrammatur: '90 g/m²', antwortkarteSize: '210 x 99 mm', antwortkarteFinish: 'glänzend' },
  { nr: 7, anschreibenGrammatur: '90 g/m²', antwortkarteSize: '210 x 105 mm', antwortkarteFinish: 'matt' },
  { nr: 8, anschreibenGrammatur: '90 g/m²', antwortkarteSize: '210 x 105 mm', antwortkarteFinish: 'glänzend' },
];

const FIXED_FENSTERHUELLE_COLOR = '1/1-farbig Schwarz';
const FIXED_ANSCHREIBEN_COLOR = '1/1-farbig Schwarz';
const FIXED_ANTWORTKARTE_GRAMMARTUR = '250 g/m²';

function parseEuro(text) {
  return parseFloat(text.replace(/\./g, '').replace(',', '.'));
}

/** Extrait les prix du texte du body jopke. */
function extraitPrixJopke(body) {
  const druck = body.match(/DIN-Lang-Mailing\s+([\d.,]+)\s*€/);
  const netto = body.match(/Gesamt \(netto\):\s*([\d.,]+)\s*€/);
  const brutto = body.match(/Gesamt \(brutto\):\s*([\d.,]+)\s*€/);
  return {
    druck: druck ? parseEuro(druck[1]) : null,
    netto: netto ? parseEuro(netto[1]) : null,
    brutto: brutto ? parseEuro(brutto[1]) : null,
  };
}

function main() {
  if (!fs.existsSync(JOPKE_JSON)) {
    console.error(`Fichier introuvable: ${JOPKE_JSON}`);
    process.exit(1);
  }
  const jopkeData = JSON.parse(fs.readFileSync(JOPKE_JSON, 'utf8'));

  // Index des prix jopke par clé de groupe (auflage=500 uniquement).
  const jopkeParGroupe = new Map();
  for (const entry of jopkeData) {
    const g = entry.groupKey;
    const amount = entry.amount ?? '500';
    if (amount !== '500') continue;
    const cle = `${g.anschreibenGrammatur}|${g.antwortkarteSize}|${g.antwortkarteFinish}`;
    jopkeParGroupe.set(cle, extraitPrixJopke(entry.body ?? ''));
  }

  const lignes = [];
  for (const gr of GRUPPEN) {
    const params = {
      huellentyp: 'Fensterhülle',
      ausstattung: 'Anschreiben + Antwortkarte',
      auflage: 500,
      fensterhuelleFarbigkeit: FIXED_FENSTERHUELLE_COLOR,
      anschreibenGrammatur: gr.anschreibenGrammatur,
      anschreibenFarbigkeit: FIXED_ANSCHREIBEN_COLOR,
      antwortkarteEndformat: gr.antwortkarteSize,
    };
    const proj = berechnePreisProjet(params);
    const cle = `${gr.anschreibenGrammatur}|${gr.antwortkarteSize}|${gr.antwortkarteFinish}`;
    const jp = jopkeParGroupe.get(cle) ?? { druck: null, netto: null, brutto: null };

    const diffDruck = proj && jp.druck !== null ? runden(proj.druck - jp.druck) : null;
    const diffNetto = proj && jp.netto !== null ? runden(proj.gesamtNettoStandard - jp.netto) : null;
    const diffBrutto = proj && jp.brutto !== null ? runden(proj.gesamtBruttoStandard - jp.brutto) : null;

    lignes.push({ gr, proj, jp, diffDruck, diffNetto, diffBrutto });
  }

  console.log('Comparaison des 8 groupes : Prix projet (berechnePreis) vs Prix jopke.de\n');
  console.log('Nr | Gramm.Anschr | Antwortkarte   | Finition  | Projet netto | Jopke netto | Δ netto | Projet brutto | Jopke brutto | Δ brutto');
  console.log('-'.repeat(122));
  for (const l of lignes) {
    const pn = l.proj ? l.proj.gesamtNettoStandard.toFixed(2) : '—';
    const jn = l.jp.netto !== null ? l.jp.netto.toFixed(2) : '—';
    const dn = l.diffNetto !== null ? l.diffNetto.toFixed(2) : '—';
    const pb = l.proj ? l.proj.gesamtBruttoStandard.toFixed(2) : '—';
    const jb = l.jp.brutto !== null ? l.jp.brutto.toFixed(2) : '—';
    const db = l.diffBrutto !== null ? l.diffBrutto.toFixed(2) : '—';
    console.log(
      `${String(l.gr.nr).padEnd(2)} | ${l.gr.anschreibenGrammatur.padEnd(11)} | ${l.gr.antwortkarteSize.padEnd(14)} | ${l.gr.antwortkarteFinish.padEnd(9)} |` +
      ` ${pn.padStart(10)} | ${jn.padStart(10)} | ${dn.padStart(8)} |` +
      ` ${pb.padStart(10)} | ${jb.padStart(10)} | ${db.padStart(8)}`,
    );
  }

  const ecarts = lignes.filter((l) => l.diffDruck !== null && Math.abs(l.diffDruck) > 0.01);
  console.log('\n--- Synthèse ---');
  console.log(`Groupes analysés : ${lignes.length}`);
  console.log(`Écarts de prix "druck" non nuls : ${ecarts.length}`);
  if (ecarts.length > 0) {
    const min = Math.min(...ecarts.map((l) => l.diffDruck));
    const max = Math.max(...ecarts.map((l) => l.diffDruck));
    console.log(`Écart druck : min ${min.toFixed(2)} €, max ${max.toFixed(2)} €`);
  }
}

main();

