import { PRODUKTKATALOG, type Produkt } from "@/data/produktkatalog";

export interface KartenmailingFamilie {
  slug: KartenmailingSlug;
  name: string;
  beschreibung?: string;
  varianten: Produkt[];
}

const FAMILIEN_KENNUNGEN = {
  post_din_lan_98: "(210x98)",
  post_din_lan_105: "(210x105)",
  post_maxi: "(235x125)",
  post_din_a6: "(148x105)",
  post_din_a5: "(210x148)",
  post_din_a4: "(297x210)",
} as const;

export type KartenmailingSlug = keyof typeof FAMILIEN_KENNUNGEN;

/**
 * Gruppiert PRODUKTKATALOG nach Postkarten-Format.
 * Kategorien-Ebenen: [0] Kartenmailing, [1] Format (z.B. "Postkarte DIN-Lang (210x98)").
 * Konfigurationsdimensionen je Familie: Papier (inhalt.papier) x Veredelung.
 */
export function getKartenmailingFamilie(slug: KartenmailingSlug): KartenmailingFamilie | null {
  const kennung = FAMILIEN_KENNUNGEN[slug];
  const varianten = PRODUKTKATALOG.filter((p) => {
    const oberkategorie = p.kategorien[0];
    const format = p.kategorien[1];
    return oberkategorie?.name === "Kartenmailing" && format?.name.includes(kennung);
  });
  if (varianten.length === 0) return null;

  const format = varianten[0].kategorien[1];
  return {
    slug,
    name: format.name.replace(/\s+/g, " ").trim(),
    beschreibung: format.beschreibung,
    varianten,
  };
}
