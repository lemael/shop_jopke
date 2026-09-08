import type { AusstattungConfig } from "@/types/kuvertiertesMailing/ausstattungPreisTranche";
import { create } from "zustand";
import { ausstattungConfigService } from "@/services/ausstattungConfigService";
import { ALL_STEPS, type Config, type StepName } from "@/types/selfmailer/selfmailer";
import type { SelfmailerFamilie } from "@/lib/selfmailerPreis";

const initialConfig: Config = {
  auflage: 0,
  umfang: "",
  grammatur: "",
  perforation: [""],
};

interface SeflmailerConfiguratorState {
  familieSlug: SelfmailerFamilie["slug"];
  ausstattungConfigs: AusstattungConfig[];
  loading: boolean;
  cfg: Config;
  currentStep: StepName;
  
  // --- Getters & Abgeleitete Werte ---
  perforationen: () => string[];
  STEPS: () => StepName[];
  stepIndex: () => number;
  isStepValid: (step: StepName) => boolean;

  // --- Configuration Selectors ---
  ausstattungSelfmailerLeviConfig: () => AusstattungConfig[];
  ausstattungMaxiSelfmailerINATAConfig: () => AusstattungConfig[];
  ausstattungMaxiSelfmailerKlappeALBAConfig: () => AusstattungConfig[];
  ausstattungDINA6SelfmailerMIKROConfig: () => AusstattungConfig[];
  ausstattungDINA5SelfmailerMEGALOConfig: () => AusstattungConfig[];
  ausstattungDINLangPosterSelfmailerANDIGOConfig: () => AusstattungConfig[];
  ausstattungDINA5PosterSelfmailerAFISAConfig: () => AusstattungConfig[];
  ausstattungDINLangMinikatalogALVAROConfig: () => AusstattungConfig[];
  ausstattungUnserBestsellerLEVIConfig: () => AusstattungConfig[];

  // --- Actions ---
  goTo: (step: StepName) => void;
  selectAuflage: (a: number) => void;
  selectUmfang: (u: string) => void;
  selectGrammatur: (g: string) => void;
  selectPerforation: (p: string) => void;
  next: () => void;
  reset: () => void;
  loadOptions: () => Promise<void>;
  
  bestellOpen: boolean;
  setBestellOpen: (open: boolean) => void;
  error: string | null;
}

export const useSelfmailerConfiguratorStore = create<SeflmailerConfiguratorState>((set, get) => ({
  familieSlug: "levi",
  ausstattungConfigs: [],
  cfg: initialConfig,
  currentStep: "Auflage",
  loading: false,
  error: null,
  bestellOpen: false,

  // --- 1. Getter pour extraire les perforations disponibles ---
  perforationen: () => {
    const { ausstattungConfigs } = get();
    const options = ausstattungConfigs
      .map((item) => item.perforation?.trim())
      .filter((p): p is string => Boolean(p && p !== "nan" && p !== ""));

    return Array.from(new Set(options));
  },

  // --- 2. Conditionner les étapes en fonction des perforations ---
  STEPS: () => {
    const availablePerforationen = get().perforationen();

    return ALL_STEPS.filter((step) => {
      // Exclure l'étape "Perforation" si le tableau de perforations est vide
      if (step === "Perforation" && availablePerforationen.length === 0) {
        return false;
      }
      return true;
    });
  },

  stepIndex: () => {
    const steps = get().STEPS();
    return steps.indexOf(get().currentStep);
  },

  // --- Configurations filtrées ---
  ausstattungSelfmailerLeviConfig: () => {
    return get().ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-Lang-Selfmailer LEVI");
  },
  ausstattungMaxiSelfmailerINATAConfig: () => {
    return get().ausstattungConfigs.filter(config => config.kategorie_2 === "Maxi-Selfmailer INATA");
  },
  ausstattungMaxiSelfmailerKlappeALBAConfig: () => {
    return get().ausstattungConfigs.filter(config => config.kategorie_2 === "Maxi-Selfmailer mit Klappe ALBA");
  },
  ausstattungDINA6SelfmailerMIKROConfig: () => {
    return get().ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-A6-Selfmailer MIKRO");
  },
  ausstattungDINA5SelfmailerMEGALOConfig: () => {
    return get().ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-A5-Selfmailer MEGALO");
  },
  ausstattungDINLangPosterSelfmailerANDIGOConfig: () => {
    return get().ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-Lang-Poster-Selfmailer ANDIGO");
  },
  ausstattungDINA5PosterSelfmailerAFISAConfig: () => {
    return get().ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-A5-Poster-Selfmailer AFISA");
  },
  ausstattungDINLangMinikatalogALVAROConfig: () => {
    return get().ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-Lang-Minikatalog ALVARO");
  },
  ausstattungUnserBestsellerLEVIConfig: () => {
    return get().ausstattungConfigs.filter(config => config.kategorie_2 === "Unser Bestseller ! LEVI");
  },

  setBestellOpen: (open: boolean) => set({ bestellOpen: open }),

  // --- API-Laden ---
  loadOptions: async () => {
    set({ loading: true, error: null });
    try {
      const ausstattungConfigs = await ausstattungConfigService.getAll();
      set({ ausstattungConfigs, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Fehler beim Laden der Optionen", loading: false });
    }
  },

  // --- Actions & Navigation ---
  goTo: (step) => set({ currentStep: step }),

  selectAuflage: (a: number) => {
    set((state) => ({
      cfg: { ...state.cfg, auflage: a, grammatur: "", perforation: [""] },
    }));
    get().next();
  },

  selectUmfang: (u: string) => {
    set((state) => ({
      cfg: { ...state.cfg, umfang: u, grammatur: "", perforation: [""] },
    }));
    get().next();
  },

  // --- 3. Adaptation de selectGrammatur ---
  selectGrammatur: (g: string) => {
    const availablePerforationen = get().perforationen();
    
    // Si aucune perforation n'est disponible, passer directement à "Übersicht"
    const nextStep: StepName = availablePerforationen.length > 0 ? "Perforation" : "Übersicht";

    set((state) => ({
      cfg: { ...state.cfg, grammatur: g, perforation: [""] },
      currentStep: nextStep,
    }));
  },

  selectPerforation: (p: string) => {
    set((state) => ({
      cfg: { ...state.cfg, perforation: [p] },
      currentStep: "Übersicht",
    }));
  },

  isStepValid: (step: StepName): boolean => {
    const { ausstattungConfigs, cfg } = get();
    if (step === "Auflage") {
      const min = ausstattungConfigs[0]?.mindestmenge ?? 0;
      const max = ausstattungConfigs[0]?.maximalmenge ?? Infinity;
      return cfg.auflage !== 0 && cfg.auflage >= min && cfg.auflage <= max;
    }
    if (step === "Umfang") return cfg.umfang !== null && cfg.umfang !== "";
    if (step === "Grammatur") return cfg.grammatur !== "";
    if (step === "Perforation") return cfg.perforation[0] !== "";
    return true;
  },

  next: () => {
    const steps = get().STEPS();
    const idx = steps.indexOf(get().currentStep);
    if (idx !== -1 && idx < steps.length - 1) {
      set({ currentStep: steps[idx + 1] });
    }
  },

  reset: () => {
    set({ cfg: initialConfig, currentStep: "Auflage" });
  },
}));