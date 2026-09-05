import { apiClient } from "./client";
import type { ArtikelTarifDetails } from "@/types/artikelTarifDetails";
import type { AnschreibenPreiseMap } from "@/types/anschreibenPreiseMap";
import type { BroschuerePreiseMap } from "@/types/kuvertiertesMailing/broschuerePreiseMap";
import type { FlyerPreiseMap } from "@/types/kuvertiertesMailing/flyerPreiseMap";
import type { AntwortkartePreiseMap } from "@/types/kuvertiertesMailing/antwortkartePreiseMap";

export const tarifeApi = {
  getAll: () => apiClient<ArtikelTarifDetails[]>("/tarife/all"),

  getByKategorie: (kat: string) =>
    apiClient<ArtikelTarifDetails[]>(`/tarife/kategorie/${encodeURIComponent(kat)}`),

  getAnschreibenMap: (produktGruppe?: string) => {
    const query = produktGruppe ? `?produkt_gruppe=${encodeURIComponent(produktGruppe)}` : "";
    return apiClient<AnschreibenPreiseMap>(`/tarife/map/anschreiben${query}`);
  },

  getFlyerMap: (produktGruppe?: string) => {
    const query = produktGruppe ? `?produkt_gruppe=${encodeURIComponent(produktGruppe)}` : "";
    return apiClient<FlyerPreiseMap>(`/tarife/map/flyer${query}`);
  },

  getAntwortkarteMap: (produktGruppe?: string) => {
    const query = produktGruppe ? `?produkt_gruppe=${encodeURIComponent(produktGruppe)}` : "";
    return apiClient<AntwortkartePreiseMap>(`/tarife/map/antwortkarte${query}`);
  },

  getBroschuereMap: (produktGruppe?: string) => {
    const query = produktGruppe ? `?produkt_gruppe=${encodeURIComponent(produktGruppe)}` : "";
    return apiClient<BroschuerePreiseMap>(`/tarife/map/broschuere${query}`);
  },
};