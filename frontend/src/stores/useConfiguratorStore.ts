import { create } from "zustand";
import type { StepName, Config } from "@/types/kuvertiertesMailing/kuvertiertesMailing";
import type { MailingSlug } from "@/types/kuvertiertesMailing/mailingSlug";
import type { HuellenTyp } from "@/types/kuvertiertesMailing/types";
import type { ArtikelTarifDetails } from "@/types/kuvertiertesMailing/artikelTarifDetails";
import { tarifeService } from "@/services/tarifeService";
import { berechnePreis } from "@/lib/kuvertiertesmailingPreis";
import { auflagenFuer } from "@/lib/auflage";
import type { AusstattungConfig } from "@/types/kuvertiertesMailing/ausstattungPreisTranche";
import { ausstattungConfigService } from "@/services/ausstattungConfigService";
import {
  ALL_STEPS,
  FLYER_STEPS,
  BROSCHUERE_STEPS,
  ANTWORTKARTE_STEPS,
} from "@/data/kuvertiertesMailing";
import { HUELLE_FARBIGKEITEN_MAP } from "@/types/kuvertiertesMailing/hUELLE_FARBIGKEITEN_MAP";

interface ConfiguratorState {
  // --- Allgemeine Daten ---
  familieSlug: MailingSlug;
  name: string;
  beschreibung: string;
  cfg: Config;
  currentStep: StepName;
  bestellOpen: boolean;

  // --- Ausstattung-Konfiguration & API-Daten --- 
  ausstattungConfigs: AusstattungConfig[];
  artikelTarife: ArtikelTarifDetails[];
  loading: boolean;
  error: string | null;

  // --- Berechnete/geladene Optionen ---
  huellentypen: HuellenTyp[];
  anschreibenGrammaturen: string[];
  anschreibenFarbigkeiten: string[];
  flyerUmfaenge: string[];
  flyerGrammaturenMapped: Record<string, string[]>;
  flyerOberflaechen: string[];
  broschuereUmfaenge: string[];
  broschuereOberflaechen: string[];
  antwortkarteEndformate: string[];
  antwortkarteGrammaturen: string[];
  antwortkarteOberflaechen: string[];

  // --- Getter / Abgeleitete Werte ---
  selectedAusstattungConfig: () => AusstattungConfig | undefined;
  ausstattungen: () => string[];
  huelleFarbigkeiten: () => string[];
  ausgewaehlterArtikel: () => ArtikelTarifDetails | undefined;
  hatAnschreiben: () => boolean;
  hatFlyer: () => boolean;
  hatBroschuere: () => boolean;
  hatAntwortkarte: () => boolean;
  STEPS: () => StepName[];
  stepIndex: () => number;
  auflagen: () => number[];
  preis: () => ReturnType<typeof berechnePreis>;
  isStepValid: (step: StepName) => boolean;
  versandklasse: () => string;

  // --- Aktionen ---
  loadOptions: () => Promise<void>;
  selectHuellentyp: (huellentyp: HuellenTyp) => void;
  selectAusstattung: (ausstattung: string) => void;
  selectAuflage: (auflage: number) => void;
  setCustomAuflage: (auflage: number) => void;
  selectHuelleFarbigkeit: (farbigkeit: string) => void;
  selectAnschreibenGrammatur: (grammatur: string) => void;
  selectAnschreibenFarbigkeit: (farbigkeit: string) => void;
  selectAnzahlFlyer: (n: number) => void;
  selectFlyerUmfang: (index: number, umfang: string) => void;
  selectFlyerGrammatur: (index: number, grammatur: string) => void;
  selectFlyerOberflaeche: (index: number, oberflaeche: string) => void;
  selectBroschuereUmfang: (umfang: string) => void;
  selectBroschuereOberflaeche: (oberflaeche: string) => void;
  selectAntwortkarteEndformat: (endformat: string) => void;
  selectAntwortkarteGrammatur: (grammatur: string) => void;
  selectAntwortkarteOberflaeche: (oberflaeche: string) => void;
  setVerarbeitungszeit: (zeit: "Standard" | "Express") => void;
  setBestellOpen: (open: boolean) => void;
  getMailingPackage: () => ReturnType<typeof tarifeService.buildSelectedMailingPackage> | null;
  goTo: (step: StepName) => void;
  next: () => void;
  reset: () => void;
}

const initialConfig: Config = {
  huellentyp: "",
  ausstattung: "",
  auflage: 0,
  huelleFarbigkeit: "",
  anschreibenGrammatur: "",
  anschreibenFarbigkeit: "",
  flyerUmfang: "",
  flyerGrammatur: "",
  flyerOberflaeche: "",
  broschuereUmfang: "",
  broschuereOberflaeche: "",
  antwortkarteEndformat: "",
  antwortkarteGrammatur: "",
  antwortkarteOberflaeche: "",
  anzahlFlyer: 0,
  flyerConfigs: [],
  verarbeitungszeit: "Standard"
};

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  familieSlug: "lang_mailing",
  name: "Kuvertiertes Mailing DIN lang",
  beschreibung: "Konfigurieren Sie Ihr Mailing mit individuellen Beilagen und Formaten.",
  cfg: initialConfig,
  currentStep: "Hüllentyp",
  bestellOpen: false,

  artikelTarife: [],
  ausstattungConfigs: [],
  loading: true,
  error: null,

  huellentypen: [],
  anschreibenGrammaturen: [],
  anschreibenFarbigkeiten: [],
  flyerUmfaenge: [],
  flyerGrammaturenMapped: {},
  flyerOberflaechen: ["matt", "glänzend"],
  broschuereUmfaenge: [],
  broschuereOberflaechen: ["matt", "glänzend"],
  antwortkarteEndformate: [],
  antwortkarteGrammaturen: [],
  antwortkarteOberflaechen: ["matt", "glänzend"],

  
  // --- Ausgewählte Konfiguration abrufen ---
  // --- Ausgewählte Konfiguration abrufen ---
  selectedAusstattungConfig: () => {
    const { ausstattungConfigs, cfg } = get();
    if (!cfg.huellentyp || !cfg.ausstattung) return undefined;

    const targetHuellentyp = cfg.huellentyp.trim().toLowerCase();
    const targetAusstattung = cfg.ausstattung.trim().toLowerCase();

    return ausstattungConfigs.find((item) => {
      // Priorité 1: Match sur kategorie_3 | Priorité 2: Match sur kategorie_2/kategorie/name
      const matchHuellentyp =
        item.kategorie_3?.trim().toLowerCase() === targetHuellentyp ||
        item.kategorie_2?.trim().toLowerCase() === targetHuellentyp ||
        item.kategorie?.trim().toLowerCase() === targetHuellentyp ||
        item.kategorie_4?.trim().toLowerCase() === targetHuellentyp;

      // Match sur kategorie_4
      const matchAusstattung =
        item.kategorie_4?.trim().toLowerCase() === targetAusstattung;

      return matchHuellentyp && matchAusstattung;
    });
  },

  // --- Verfügbare Ausstattung für den ausgewählten Umschlag abrufen ---
  ausstattungen: () => {
    const { ausstattungConfigs, cfg } = get();
    if (!cfg.huellentyp) return [];

    const targetHuellentyp = cfg.huellentyp.trim().toLowerCase();

    // 1. Prioritär auf kategorie_3 filtern
    let configs = ausstattungConfigs.filter(
      (item) => item.kategorie_3?.trim().toLowerCase() === targetHuellentyp
    );

    // Wenn keine direkten Ergebnisse auf kategorie_3, überprüfen Sie kategorie / kategorie_2 / name
    if (configs.length === 0) {
      configs = ausstattungConfigs.filter((item) => {
        const kat1 = item.kategorie?.trim().toLowerCase();
        const kat2 = item.kategorie_2?.trim().toLowerCase();
        const kat4 = item.kategorie_4?.trim().toLowerCase();

        return (
          kat2 === targetHuellentyp ||
          kat1 === targetHuellentyp ||
          kat4 === targetHuellentyp ||
          (kat4 && kat4.includes(targetHuellentyp))
        );
      });
    }
    console.log("configs", configs);
    // 2. Optionen von kategorie_4 extrahieren (oder fallback auf name)
    const groups = configs
      .map((item) => item.kategorie_4?.trim())
      .filter(Boolean) as string[];

    // 3. Duplikate entfernen
    return Array.from(new Set(groups));
  },
  versandklasse: () => {
  const { ausstattungConfigs, cfg } = get();

  // Recherche de la config correspondant à l'ausstattung sélectionnée
  const selectedConfig = ausstattungConfigs.find(
    (item) => item.kategorie_4 === cfg.ausstattung // ou item.produkt_nummer
  );
 
  console.log("ausstattungConfigs:", ausstattungConfigs,"selectedConfig:", selectedConfig, "cfg.ausstattung:", cfg.ausstattung);

  return selectedConfig?.mindest_versandklasse ?? "";
},
  huelleFarbigkeiten: () => {
    const { cfg } = get();
    return HUELLE_FARBIGKEITEN_MAP[cfg.huellentyp] || [
      "4/0-farbig",
      "1/0-farbig",
      "unbedruckt"
    ];
  },

  ausgewaehlterArtikel: () => {
    const { artikelTarife, cfg } = get();
    return artikelTarife.find(
      (a) =>
        (a.kategorie === cfg.huellentyp || a.produkt_gruppe === cfg.huellentyp) &&
        (a.produkt_gruppe || a.produkt_name) === cfg.ausstattung
    );
  },

  // Dynamische Erkennung basierend auf dem aktiven Artikel im Excel
  hatAnschreiben: () => {
    const activeItem = get().selectedAusstattungConfig();
    return activeItem ? Boolean(activeItem.anschreiben) : true;
  },

  hatFlyer: () => {
    const activeItem = get().selectedAusstattungConfig();
    return activeItem ? Boolean(activeItem.flyer) : true;
  },

  hatBroschuere: () => {
    const activeItem = get().selectedAusstattungConfig();
    return activeItem ? Boolean(activeItem.broschuere) : true;
  },

  hatAntwortkarte: () => {
    const activeItem = get().selectedAusstattungConfig();
    return activeItem ? Boolean(activeItem.antwortkarte) : true;
  },

  STEPS: () => {
  const { hatAnschreiben, hatBroschuere, hatAntwortkarte, hatFlyer, cfg } = get();

  const baseSteps = ALL_STEPS.filter((step) => {
    // 1. Grundlegende Schritte sind immer vorhanden
    if (["Hüllentyp", "Ausstattung", "Auflage", "Farbigkeit Hülle", "Übersicht"].includes(step)) return true;

    // 2. Bedingte Schritte basierend auf dem Vorhandensein von Elementen
    if (step === "Grammatur Anschreiben" || step === "Farbigkeit Anschreiben") return hatAnschreiben();
    if (BROSCHUERE_STEPS.has(step)) return hatBroschuere();
    if (ANTWORTKARTE_STEPS.has(step)) return hatAntwortkarte();

    // 3. Einstiegsschritt für Flyer
    if (step === "Anzahl Flyer") return hatFlyer();

    // 4. Einzelne Flyer-Schritte standardmäßig ausschließen (werden unten dynamisch eingefügt)
    if (FLYER_STEPS.has(step)) return false;

    return true;
  });

  // 5. Dynamische Injektion von Unter-Schritten für jeden Flyer, wenn anzahlFlyer > 0
  if (hatFlyer() && cfg.anzahlFlyer && cfg.anzahlFlyer > 0) {
    const dynamicSteps: StepName[] = [];
    for (let i = 1; i <= cfg.anzahlFlyer; i++) {
      dynamicSteps.push(`Flyer ${i} - Umfang` as StepName);
      dynamicSteps.push(`Flyer ${i} - Grammatur` as StepName);
      dynamicSteps.push(`Flyer ${i} - Oberfläche` as StepName);
    }
    const idx = baseSteps.indexOf("Anzahl Flyer");
    if (idx !== -1) {
      baseSteps.splice(idx + 1, 0, ...dynamicSteps);
    }
  }

  return baseSteps;
},

  stepIndex: () => {
    const steps = get().STEPS();
    return steps.indexOf(get().currentStep);
  },

  auflagen: () => {
    const configItem = get().selectedAusstattungConfig();
    return auflagenFuer(configItem?.mindestmenge ?? null, configItem?.maximalmenge ?? null);
  },

  preis: () => {
    const { cfg, familieSlug } = get();
    return berechnePreis({
      slug: familieSlug,
      huellentyp: cfg.huellentyp,
      ausstattung: cfg.ausstattung,
      auflage: cfg.auflage,
      huellenFarbigkeit: cfg.huelleFarbigkeit,
      anschreibenGrammatur: cfg.anschreibenGrammatur,
      anschreibenFarbigkeit: cfg.anschreibenFarbigkeit,
      flyerUmfang: cfg.flyerUmfang,
      flyerGrammatur: cfg.flyerGrammatur,
      flyerConfigs: cfg.flyerConfigs,
      broschuereUmfang: cfg.broschuereUmfang,
      antwortkarteEndformat: cfg.antwortkarteEndformat,
      antwortkarteGrammatur: cfg.antwortkarteGrammatur,
      antwortkarteOberflaeche: cfg.antwortkarteOberflaeche,
      broschuereInhaltOberflaeche: cfg.broschuereOberflaeche,
      broschuereUmschlagOberflaeche: cfg.broschuereOberflaeche,
      broschuereInhaltGrammatur: "90 g/m²",
      broschuereUmschlagGrammatur: "170 g/m²",
      artikelTarife: get().artikelTarife,
      ausstattungConfig: get().selectedAusstattungConfig(),
    });
  },

  isStepValid: (step) => {
    const { cfg } = get();
    if (step === "Hüllentyp") return Boolean(cfg.huellentyp && cfg.huellentyp !== "");
    if (step === "Ausstattung") return Boolean(cfg.ausstattung && cfg.ausstattung !== "");
    if (step === "Auflage") return Boolean(cfg.auflage && cfg.auflage > 0);
    if (step === "Farbigkeit Hülle") return Boolean(cfg.huelleFarbigkeit && cfg.huelleFarbigkeit !== "");
    if (step === "Grammatur Anschreiben") return Boolean(cfg.anschreibenGrammatur && cfg.anschreibenGrammatur !== "");
    if (step === "Farbigkeit Anschreiben") return Boolean(cfg.anschreibenFarbigkeit && cfg.anschreibenFarbigkeit !== "");
    if (step === "Anzahl Flyer") return Boolean(cfg.anzahlFlyer && cfg.anzahlFlyer > 0);
    return true;
  },

  // --- API-Laden ---
  loadOptions: async () => {
    set({ loading: true, error: null });
    try {
      const ausstattungConfigs = await ausstattungConfigService.getAll();
      console.log("Ausstattung Configs geladen:", ausstattungConfigs);
      const artikelTarife = await tarifeService.getAll();
      console.log("Artikel Tarife geladen:", artikelTarife);
      const huellentypen = await tarifeService.getHuellentypen();
      const anschreiben = await tarifeService.getAnschreibenOptions("A1000");
      const flyer = await tarifeService.getFlyerOptions("F1000");
      const broschuere = await tarifeService.getBroschuereOptions("B1000");
      const antwortkarte = await tarifeService.getAntwortkarteOptions("AK1000");

      // --- Konstruktion der dynamischen Grammatur-Zuordnung ---
      // --- Dynamische Extraktion der Grammaturen aus flyer.map ---
    const flyerGrammaturenMapped: Record<string, string[]> = {};

    if (flyer.map) {
      // 1. Durchlauf jeden Umfang (z.B.: "2 Seiten", "4 Seiten")
      Object.entries(flyer.map).forEach(([umfang, papierMap]) => {
        const grammaturenSet = new Set<string>();

        // 2. Durchlauf jeden Papierkey (z.B.: "170 g/m² matt")
        Object.keys(papierMap).forEach((papierKey) => {
          // Nur den Grammatur-Teil vor dem Oberflächentyp extrahieren
          const match = papierKey.match(/^(\d+\s*g\/m²)/i);
          if (match) {
            grammaturenSet.add(match[1].trim());
          }
        });

        // 3. Einzigartige Grammaturen für diesen Umfang speichern
        flyerGrammaturenMapped[umfang] = Array.from(grammaturenSet);
      });
    }

      set({
        artikelTarife,
        huellentypen,
        anschreibenGrammaturen: anschreiben.grammaturen,
        anschreibenFarbigkeiten: anschreiben.farbigkeiten,
        flyerUmfaenge: flyer.umfaenge,
        flyerGrammaturenMapped, // <-- Hinzufügen der dynamischen Grammatur-Zuordnung für Flyer
        broschuereUmfaenge: broschuere.umfaenge,
        antwortkarteEndformate: antwortkarte.endformate,
        antwortkarteGrammaturen: antwortkarte.grammaturen,
        ausstattungConfigs,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "Fehler beim Laden der Optionen", loading: false });
    }
  },

  // --- Aktionen ---
  selectHuellentyp: (huellentyp: HuellenTyp) => {
    set((state) => ({
      cfg: { ...state.cfg, huellentyp, ausstattung: "", auflage: 0 },
      currentStep: "Ausstattung",
    }));
  },

  selectAusstattung: (ausstattung: string) => {
    set((state) => ({
      cfg: {
        ...state.cfg,
        ausstattung,
        auflage: 0,
        anzahlFlyer: 0,
        flyerConfigs: [],
        broschuereUmfang: "",
        broschuereOberflaeche: "",
        antwortkarteEndformat: "",
        antwortkarteGrammatur: "",
        antwortkarteOberflaeche: "",
        
      },
      currentStep: "Auflage",
    }));
  },

  selectAuflage: (auflage: number) => {
    set((state) => ({ cfg: { ...state.cfg, auflage } }));
    get().next();
  },

  setCustomAuflage: (auflage: number) => set((state) => ({ cfg: { ...state.cfg, auflage } })),

  selectHuelleFarbigkeit: (huelleFarbigkeit: string) => {
    set((state) => ({ cfg: { ...state.cfg, huelleFarbigkeit } }));
    get().next();
  },

  selectAnschreibenGrammatur: (anschreibenGrammatur: string) => {
    set((state) => ({ cfg: { ...state.cfg, anschreibenGrammatur } }));
    get().next();
  },

  selectAnschreibenFarbigkeit: (anschreibenFarbigkeit: string) => {
    set((state) => ({ cfg: { ...state.cfg, anschreibenFarbigkeit } }));
    get().next();
  },

  selectAnzahlFlyer: (n: number) => {
    set((state) => ({
      cfg: {
        ...state.cfg,
        anzahlFlyer: n,
        flyerConfigs: Array.from({ length: n }, () => ({ umfang: "", grammatur: "", oberflaeche: "" })),
      },
     
    }));
    get().next();
  },

  selectFlyerUmfang: (index, umfang) => {
    const newConfigs = [...get().cfg.flyerConfigs];
    newConfigs[index] = { ...newConfigs[index], umfang, grammatur: "", oberflaeche: "" };
    set((state) => ({ cfg: { ...state.cfg, flyerConfigs: newConfigs } }));
    get().next();
  },

  selectFlyerGrammatur: (index, grammatur) => {
    const newConfigs = [...get().cfg.flyerConfigs];
    newConfigs[index] = { ...newConfigs[index], grammatur, oberflaeche: "" };
    set((state) => ({ cfg: { ...state.cfg, flyerConfigs: newConfigs } }));
    get().next();
  },

  selectFlyerOberflaeche: (index, oberflaeche) => {
    const newConfigs = [...get().cfg.flyerConfigs];
    newConfigs[index] = { ...newConfigs[index], oberflaeche };
    set((state) => ({ cfg: { ...state.cfg, flyerConfigs: newConfigs } }));
    get().next();
  },

  selectBroschuereUmfang: (broschuereUmfang) => {
    set((state) => ({ cfg: { ...state.cfg, broschuereUmfang } }));
    get().next();
  },

  selectBroschuereOberflaeche: (broschuereOberflaeche) => {
    set((state) => ({ cfg: { ...state.cfg, broschuereOberflaeche } }));
    get().next();
  },

  selectAntwortkarteEndformat: (antwortkarteEndformat) => {
    set((state) => ({ cfg: { ...state.cfg, antwortkarteEndformat } }));
    get().next();
  },

  selectAntwortkarteGrammatur: (antwortkarteGrammatur) => {
    set((state) => ({ cfg: { ...state.cfg, antwortkarteGrammatur } }));
    get().next();
  },

  selectAntwortkarteOberflaeche: (antwortkarteOberflaeche) => {
    set((state) => ({ cfg: { ...state.cfg, antwortkarteOberflaeche } }));
    get().next();
  },

  setVerarbeitungszeit: (verarbeitungszeit) =>
    set((state) => ({ cfg: { ...state.cfg, verarbeitungszeit } })),

  setBestellOpen: (bestellOpen) => set({ bestellOpen }),

  getMailingPackage: () => {
    const { artikelTarife, cfg } = get();
    return tarifeService.buildSelectedMailingPackage(artikelTarife, cfg);
  },

  goTo: (step) => set({ currentStep: step }),

  next: () => {
    const steps = get().STEPS();
    const idx = steps.indexOf(get().currentStep);
    if (idx !== -1 && idx < steps.length - 1) {
      set({ currentStep: steps[idx + 1] });
    }
  },

  reset: () => set({ cfg: initialConfig, currentStep: "Hüllentyp" }),
}));