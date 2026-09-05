
import { create } from 'zustand'



interface KartenmailingConfiguratorState {
    loading: boolean;
    error: string | null;
    cfg: any; // Replace 'any' with the actual type of your configuration
    currentStep: string; // Replace 'string' with the actual type of your step name
    goTo: (step: string) => void; // Replace 'string' with the actual type of your step name
    selectOption: (option: any) => void; // Replace 'any' with the actual type of your option
    isStepValid: (step: string) => boolean; // Replace 'string' with the actual type of your step name
    next: () => void;
    reset: () => void;

}

export const useKartenmailingConfiguratorStore = create<KartenmailingConfiguratorState>((set, get) => ({
    loading: false,
    error: null,
    cfg: null,
    currentStep: '',
    goTo: (step: string) => set({ currentStep: step }),
    selectOption: (option: any) => {
        const cfg = { ...get().cfg, ...option };
        set({ cfg });
    },
    isStepValid: (step: string) => {
        // Implement your step validation logic here
        return true;
    },
    next: () => {
        // Implement your logic to go to the next step here
    },
    reset: () => set({
        loading: false,
        error: null,
        cfg: null,
        currentStep: '',
    }),
}));