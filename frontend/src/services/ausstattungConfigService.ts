import { ausstattungConfigApi } from "@/api/ausstattungConfigApi";
import type { AusstattungConfig } from "@/types/kuvertiertesMailing/ausstattungPreisTranche";

export const ausstattungConfigService = {

  async getAll(): Promise<AusstattungConfig[]> {
    return await ausstattungConfigApi.getAll();
  },

  async getByKategorie(
    kategorie: string
  ): Promise<AusstattungConfig[]> {
    return await ausstattungConfigApi.getByKategorie(kategorie);
  },

  async getByProduktGruppe(
    produktGruppe: string
  ): Promise<AusstattungConfig[]> {
    return await ausstattungConfigApi.getByProduktGruppe(
      produktGruppe
    );
  },

  /**
   * Retourne toutes les catégories disponibles
   */
  async getKategorien(): Promise<string[]> {
    const data = await ausstattungConfigApi.getAll();

    return Array.from(
      new Set(
        data
          .map((item) => item.kategorie?.trim())
          .filter(
            (value): value is string => Boolean(value)
          )
      )
    );
  },

  /**
   * Retourne les groupes produits d'une catégorie
   */
  async getProduktGruppen(
    kategorie: string
  ): Promise<string[]> {

    const data =
      await ausstattungConfigApi.getByKategorie(kategorie);

    return Array.from(
      new Set(
        data
          .map((item) => item.produkt_gruppe?.trim())
          .filter(
            (value): value is string => Boolean(value)
          )
      )
    );
  },

  /**
   * Retourne les produits d'un groupe
   */
  async getProdukte(
    produktGruppe: string
  ): Promise<AusstattungConfig[]> {

    return await ausstattungConfigApi.getByProduktGruppe(
      produktGruppe
    );
  },
};