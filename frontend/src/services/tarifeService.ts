import { tarifeApi } from "@/api/tarifeApi";
import type { ArtikelTarifDetails } from "@/types/kuvertiertesMailing/artikelTarifDetails";
import { FlyerConfig } from "@/types/kuvertiertesMailing/kuvertiertesMailing";
import type { MailingPackage } from "@/types/kuvertiertesMailing/mailingPackage";
import type { HuellenTyp } from "@/types/kuvertiertesMailing/types";
import type {AnschreibenPreiseMap} from "@/types/kuvertiertesMailing/anschreibenPreiseMap";

// Garde de type (Type Guard)
function isHuellenTyp(value: string): value is HuellenTyp {
  return [
    "Fensterhülle",
    "Panorama-Fensterhülle",
    "Hülle ohne Fenster",
  ].includes(value);
}


export const tarifeService = {
  // --- Récupération globale ---
  async getAll(): Promise<ArtikelTarifDetails[]> {
    return await tarifeApi.getAll();
  },
  // --- Hülle ---
  async getHuellentypen(): Promise<HuellenTyp[]> {
    const data = await tarifeApi.getAll();

    const categories = data
      .map((item) => item.kategorie?.trim())
      .filter((kat): kat is string => Boolean(kat));

    const validHuellentypen = categories.filter(isHuellenTyp);

    return Array.from(new Set(validHuellentypen));
  },

  async getFarbigkeitenFuerHuelle(huellentyp: string): Promise<string[]> {
    const data = await tarifeApi.getByKategorie(huellentyp);
    return Array.from(new Set(data.map((item) => item.farbigkeit).filter((v): v is string => Boolean(v))));
  },

  // --- Anschreiben ---
  async getAnschreibenOptions(produktGruppe?: string) {
    const map: AnschreibenPreiseMap = await tarifeApi.getAnschreibenMap(produktGruppe);
    const grammaturen = Object.keys(map);
    const farbigkeiten = Array.from(
      new Set(Object.values(map).flatMap((farbObj) => Object.keys(farbObj)))
    );
    return { map, grammaturen, farbigkeiten };
  },

  // --- Flyer ---
  async getFlyerOptions(produktGruppe?: string) {
    const map = await tarifeApi.getFlyerMap(produktGruppe);
    const umfaenge = Object.keys(map); // ex: ["2 Seiten", "4 Seiten", ...]
    return { map, umfaenge };
  },

  // --- Broschüre ---
  async getBroschuereOptions(produktGruppe?: string) {
    const map = await tarifeApi.getBroschuereMap(produktGruppe);
    const umfaenge = Object.keys(map);
    return { map, umfaenge };
  },

  // --- Antwortkarte ---
  async getAntwortkarteOptions(produktGruppe?: string) {
    const map = await tarifeApi.getAntwortkarteMap(produktGruppe);
    const endformate = Object.keys(map);
    const grammaturen = Array.from(
      new Set(
        Object.values(map)
          .flatMap((papierMap) => Object.keys(papierMap))
          .map((papierKey) => papierKey.split(" ")[0] + " g/m²")
      )
    );
    console.log("Antwortkarte map:", map);
    console.log("Antwortkarte endformate:", endformate);
    console.log("Antwortkarte grammaturen:", grammaturen);
    return { map, endformate, grammaturen };
  },

  buildSelectedMailingPackage(
    allTarife: ArtikelTarifDetails[],
    cfg: {
      huellentyp: string;
      ausstattung: string;
      anschreibenGrammatur: string;
      antwortkarteEndformat: string;
      broschuereUmfang: string;
      flyerConfigs: FlyerConfig[];
    }
  ): MailingPackage | null {
    const huelleArticle = allTarife.find(
      (a) => a.kategorie === cfg.huellentyp && (a.produkt_gruppe || a.produkt_name) === cfg.ausstattung
    );

    if (!huelleArticle) return null;

    const anschreibenArticle = allTarife.find(
      (a) => a.kategorie === "Anschreiben" && a.grammatur === cfg.anschreibenGrammatur
    );

    const antwortkarteArticle = allTarife.find(
      (a) => a.kategorie === "Antwortkarte" && a.endformat === cfg.antwortkarteEndformat
    );

    const broschuereArticle = allTarife.find(
      (a) => a.kategorie === "Broschüre" && a.umfang === cfg.broschuereUmfang
    );

    const flyerArticles: ArtikelTarifDetails[] = cfg.flyerConfigs
      .map((fCfg) =>
        allTarife.find((a) => a.kategorie === "Flyer" && a.umfang === fCfg.umfang)
      )
      .filter((a): a is ArtikelTarifDetails => Boolean(a));

    return {
      huelle: huelleArticle,
      anschreiben: anschreibenArticle || null,
      antwortkarte: antwortkarteArticle || null,
      broschuere: broschuereArticle || null,
      flyers: flyerArticles,
    };
  },
};