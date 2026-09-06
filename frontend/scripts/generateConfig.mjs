import fs from "fs/promises";
import path from "path";

// --- Configuration ---
const DATA_DIR = "tmp";
const OUTPUT_FILE = "src/lib/mailingPreis.ts";
const CONFIG_VAR_NAME = "AUSSTATTUNG_CONFIG";

const DATA_FILES = {
  "Fensterhülle|Anschreiben": "jopke-fensterhuelle-combinations.json",
  "Fensterhülle|Anschreiben + Antwortkarte": "jopke-fensterhuelle-antwortkarte-project-bibliotek.json",
  // Ajoutez d'autres fichiers de données ici si nécessaire
};

const BASE_CONFIG = {
  huelleFarbigkeit: "unbedruckt",
  anschreibenGrammatur: "80 g/m²",
  anschreibenFarbigkeit: "4/0-farbig Euroskala",
  antwortkarteSize: "210 x 99 mm",
  antwortkarteFinish: "matt",
  antwortkarteGrammatur: "170 g/m²",
};

// --- Fonctions utilitaires ---

function parsePrice(priceStr) {
  if (!priceStr) return null;
  return parseFloat(priceStr.replace(" €", "").replace(".", "").replace(",", "."));
}

function findPriceInData(data, auflage, huelleFarbigkeit, anschreibenGrammatur, anschreibenFarbigkeit) {
  const entry = data.find((item) => {
    const amount = item.pathChoices.find((c) => c.id === "amount")?.value;
    if (parseInt(amount, 10) !== auflage) return false;

    const choices = item.pathChoices.filter((c) => c.kind === "submit-button").map((c) => c.id);
    const huelleColorMatch = choices.includes(`color=${huelleFarbigkeit}`);
    const anschreibenGrammaturMatch = choices.includes(`grammage=${anschreibenGrammatur}`);
    const anschreibenColorMatch = choices.includes(`color=${anschreibenFarbigkeit}`);

    return huelleColorMatch && anschreibenGrammaturMatch && anschreibenColorMatch;
  });

  if (!entry) {
    return null;
  }

  // Extrait le prix du corps du texte
  const priceMatch = entry.body.match(/DIN-Lang-Mailing ([\d,.]+) €/);
  return priceMatch ? parsePrice(priceMatch[1]) : null;
}

function calculateStaffel(price500, price1000) {
  if (price500 === null || price1000 === null) {
    return { fixpreis: 0, preisPro1000: 0 };
  }
  // Formule: Preis = fixpreis + (auflage / 1000) * preisPro1000
  // On a deux équations avec deux inconnues (fixpreis, preisPro1000)
  // price500 = fixpreis + 0.5 * preisPro1000
  // price1000 = fixpreis + 1.0 * preisPro1000
  // En soustrayant les deux, on obtient:
  // price1000 - price500 = 0.5 * preisPro1000
  const preisPro1000 = (price1000 - price500) / 0.5;
  const fixpreis = price1000 - preisPro1000;

  return {
    fixpreis: parseFloat(fixpreis.toFixed(2)),
    preisPro1000: parseFloat(preisPro1000.toFixed(2)),
  };
}

function getAusstattungConfig(key, data) {
  const hatBroschuere = key.includes("Broschüre");

  const price500 = findPriceInData(data, 500, BASE_CONFIG.huelleFarbigkeit, BASE_CONFIG.anschreibenGrammatur, BASE_CONFIG.anschreibenFarbigkeit);
  const price1000 = findPriceInData(data, 1000, BASE_CONFIG.huelleFarbigkeit, BASE_CONFIG.anschreibenGrammatur, BASE_CONFIG.anschreibenFarbigkeit);

  const { fixpreis, preisPro1000 } = calculateStaffel(price500, price1000);

  // NOTE: Les valeurs pour les Auflagen > 5000 semblent provenir d'une autre source (Excel)
  // et ne peuvent pas être calculées à partir des données JSON.
  // Nous les laissons en dur pour le moment, comme dans le fichier original.
  return {
    hatBroschuere,
    staffeln: [{ maxAuflage: 5000, fixpreis, preisPro1000 }],
  };
}

// --- Script principal ---

async function main() {
  const ausstattungConfig = {};

  for (const [key, filename] of Object.entries(DATA_FILES)) {
    try {
      const filePath = path.join(process.cwd(), DATA_DIR, filename);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      ausstattungConfig[key] = getAusstattungConfig(key, data);
      console.log(`✅ Traitement de ${key} à partir de ${filename}`);
    } catch (error) {
      console.error(`❌ Erreur lors du traitement de ${filename}:`, error.message);
    }
  }

  // Formattage de l'objet pour l'écriture dans le fichier
  const configString = JSON.stringify(ausstattungConfig, null, 2);

  console.log("\n--- CONFIGURATION GÉNÉRÉE (copier/coller dans mailingPreis.ts) ---");
  console.log(`const ${CONFIG_VAR_NAME}: Record<string, AusstattungConfig> = ${configString};`);
  console.log("------------------------------------------------------------------\n");
}

main().catch(console.error);
