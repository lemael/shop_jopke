import { apiClient } from "./client"; // Ajustez le chemin d'import de votre apiClient si nécessaire
import type { AusstattungConfig } from "@/types/kuvertiertesMailing/ausstattungPreisTranche";

export const ausstattungConfigApi = {
  async getAll(): Promise<AusstattungConfig[]> {
    return apiClient<AusstattungConfig[]>("/ausstattung-config/all");
  },

  async getByKategorie(kategorie: string): Promise<AusstattungConfig[]> {
    return apiClient<AusstattungConfig[]>(
      `/ausstattung-config/kategorie/${encodeURIComponent(kategorie)}`
    );
  },

  async getByProduktGruppe(produktGruppe: string): Promise<AusstattungConfig[]> {
    return apiClient<AusstattungConfig[]>(
      `/ausstattung-config/gruppe/${encodeURIComponent(produktGruppe)}`
    );
  },
};