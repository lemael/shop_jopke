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
    goTo: (step: StepName) => void;
    selectAuflage: (a: number) => void;
    selectUmfang: (u: string) => void;
    selectGrammatur: (g: string) => void;
    selectPerforation: (p: string) => void;
    isStepValid: (step: StepName) => boolean;
    STEPS: () => StepName[];
    next: () => void;
    reset: () => void;
    stepIndex: () => number;
    ausstattungSelfmailerLeviConfig: () => AusstattungConfig[];
    ausstattungMaxiSelfmailerINATAConfig: () => AusstattungConfig[];
    ausstattungMaxiSelfmailerKlappeALBAConfig: () => AusstattungConfig[];
    ausstattungDINA6SelfmailerMIKROConfig: () => AusstattungConfig[];
    ausstattungDINA5SelfmailerMEGALOConfig: () => AusstattungConfig[];
    ausstattungDINLangPosterSelfmailerANDIGOConfig: () => AusstattungConfig[];
    ausstattungDINA5PosterSelfmailerAFISAConfig: () => AusstattungConfig[];
    ausstattungDINLangMinikatalogALVAROConfig: () => AusstattungConfig[];
    ausstattungUnserBestsellerLEVIConfig: () => AusstattungConfig[];
    bestellOpen: boolean;
    setBestellOpen: (open: boolean) => void;
    error: string | null;
    loadOptions: () => Promise<void>;
}

export const useSelfmailerConfiguratorStore = create<SeflmailerConfiguratorState>((set, get) => ({
    familieSlug: "levi",
    ausstattungConfigs: [],
    cfg: initialConfig,
    currentStep: "Auflage",
    STEPS: () => ALL_STEPS,
    stepIndex: () => {
    const steps = get().STEPS();
    return steps.indexOf(get().currentStep);
    },
    loading: false,
    error: null,
    ausstattungSelfmailerLeviConfig: () => {
        const { ausstattungConfigs } = get();
        return ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-Lang-Selfmailer LEVI");
    },
    ausstattungMaxiSelfmailerINATAConfig: () => {
        const { ausstattungConfigs } = get();
        return ausstattungConfigs.filter(config => config.kategorie_2 === "Maxi-Selfmailer INATA");
    },
    ausstattungMaxiSelfmailerKlappeALBAConfig: () => {
        const { ausstattungConfigs } = get();
        return ausstattungConfigs.filter(config => config.kategorie_2 === "Maxi-Selfmailer mit Klappe ALBA");
    },
    ausstattungDINA6SelfmailerMIKROConfig: () => {
        const { ausstattungConfigs } = get();
        return ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-A6-Selfmailer MIKRO");
    },
    ausstattungDINA5SelfmailerMEGALOConfig: () => {
        const { ausstattungConfigs } = get();
        return ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-A5-Selfmailer MEGALO");
    },
    ausstattungDINLangPosterSelfmailerANDIGOConfig: () => {
        const { ausstattungConfigs } = get();
        return ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-Lang-Poster-Selfmailer ANDIGO");
    },
    ausstattungDINA5PosterSelfmailerAFISAConfig: () => {
        const { ausstattungConfigs } = get();
        return ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-A5-Poster-Selfmailer AFISA");
    },
    ausstattungDINLangMinikatalogALVAROConfig: () => {
        const { ausstattungConfigs } = get();
        return ausstattungConfigs.filter(config => config.kategorie_2 === "DIN-Lang-Minikatalog ALVARO");
    },
    ausstattungUnserBestsellerLEVIConfig: () => {
        const { ausstattungConfigs } = get();
        return ausstattungConfigs.filter(config => config.kategorie_2 === "Unser Bestseller ! LEVI");
    },
    bestellOpen: false,
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

    // -- Actions --
   goTo: (step) => set({ currentStep: step }),

  selectAuflage:(a: number) => {
    set((state) => ({
        cfg: { ...state.cfg, auflage: a, grammatur: "", perforation: [""] }, 
        currentStep: "Umfang",
     }));
  },

  selectUmfang: (u: string) => {
    set((state) => ({
        cfg: { ...state.cfg, umfang: u, grammatur: "", perforation: [""] }, 
        currentStep: "Grammatur",
     }));
  },

  selectGrammatur: (g: string) => {

    set((state) => ({cfg: { ...state.cfg, grammatur: g, perforation: [""] }, currentStep: "Perforation" }));
  },
  
  selectPerforation: (p: string) => {
    set((state) => ({cfg: { ...state.cfg, perforation: [p] }, currentStep: "Übersicht" }));
  },
  
  isStepValid: (step: StepName): boolean => {
    const {ausstattungConfigs, cfg } = get();
    if (step === "Auflage") {
      return cfg.auflage !== 0 && cfg.auflage >= ausstattungConfigs[0].mindestmenge! && cfg.auflage <= ausstattungConfigs[0].maximalmenge!;
    }
    if (step === "Umfang") return cfg.umfang !== null;
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