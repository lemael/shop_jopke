
import { Config, StepName, ALL_STEPS } from '@/types/kartenmailer/kartenmailer';
import { create } from 'zustand'
import { ausstattungConfigService } from '@/services/ausstattungConfigService';
import { AusstattungConfig } from '@/types/kuvertiertesMailing/ausstattungPreisTranche';


const initialConfig: Config = {
    papier: '',
    veredelung: '',
    auflage: 0,

}
interface KartenmailingConfiguratorState {
    loading: boolean;
    error: string | null;
    cfg: Config;
    currentStep: string; // Replace 'string' with the actual type of your step name
    ausstattungConfigs: AusstattungConfig[];
    STEPS: () => StepName[];
    goTo: (step: StepName) => void; // Replace 'string' with the actual type of your step name
    isStepValid: (step: StepName) => boolean; // Replace 'string' with the actual type of your step name
    next: () => void;
    reset: () => void;
    bestellOpen: boolean;
    stepIndex: () => number;
    setBestellOpen: (open: boolean) => void;
    loadOptions: () => Promise<void>;
    selectPapier: (p: string) => void;
    selectVeredelung: (v: string) => void;
    selectAuflage: (a: number) => void;
}

export const useKartenmailingConfiguratorStore = create<KartenmailingConfiguratorState>((set, get) => ({
    loading: false,
    error: null,
    cfg: initialConfig,
    currentStep: 'Auflage',
    ausstattungConfigs: [],
    bestellOpen: false,
    STEPS: () => ALL_STEPS,
    stepIndex: () => {
        const steps = get().STEPS();
        return steps.indexOf(get().currentStep);
    },
    setBestellOpen: (open: boolean) => set({ bestellOpen: open }),
    goTo :(step: StepName) => set({ currentStep: step }),
        
    
    selectPapier: (p: string)  => {
        set((state) => ({
            cfg: { ...state.cfg, papier: p, veredelung: ''},
            currentStep: "Veredelung",
        }));
    },
  
    selectVeredelung: (v: string) => {
        set((state) => ({
            cfg: { ...state.cfg, veredelung: v},
            currentStep: "Übersicht",
        }));
    },
    selectAuflage: (a: number) => {
   
        set((state) => ({
            cfg: { ...state.cfg, auflage: a, papier: '', veredelung: '' },
            currentStep: "Papier",
        }));
       
    },
    
    isStepValid :(step: StepName)=> {
        const {ausstattungConfigs, cfg } = get();
        if (step === "Auflage") {
        return cfg.auflage !== 0 && cfg.auflage >= ausstattungConfigs[0].mindestmenge! && cfg.auflage <= ausstattungConfigs[0].maximalmenge!;
        }
        if (step === "Papier") return cfg.papier !== '';
        if (step === "Veredelung") return cfg.veredelung !== '';
        
        return true;
    },
    
    next:() =>{
    const { currentStep } = get();
    const steps = get().STEPS();
    const idx = steps.indexOf(currentStep);
    set({ currentStep: steps[Math.min(idx + 1, steps.length - 1)] });
    },
    
    reset: () => set({
        loading: false,
        error: null,
        cfg: initialConfig,
        currentStep: 'Auflage',
    }),

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
}));