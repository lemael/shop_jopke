import { PRODUKTKATALOG, type Produkt } from "@/data/produktkatalog";

export interface SelfmailerFamilie {
  slug: SelfmailerSlug;
  name: string;
  beschreibung?: string;
  varianten: Produkt[];
}

const FAMILIEN_KENNUNGEN = {
  levi: "LEVI",
  inata: "INATA",
  klappe_alba: "ALBA",
  mikro: "MIKRO",
  megalo: "MEGALO",
  andigo: "ANDIGO",
  afisa: "AFISA",
  alvaro: "ALVARO",
} as const;

export type SelfmailerSlug = keyof typeof FAMILIEN_KENNUNGEN;

function letzteKategorie(p: Produkt) {
  return p.kategorien[p.kategorien.length - 1];
}

/**
 * Gruppiert PRODUKTKATALOG nach Selfmailer-Produktlinie.
 * Die Namen in der Quelldatei enthalten teils Unicode-Leerzeichen (z.B. INATA) -
 * daher Abgleich per Kennung statt exaktem Namensvergleich.
 */
export function getSelfmailerFamilie(slug: SelfmailerSlug): SelfmailerFamilie | null {
  const kennung = FAMILIEN_KENNUNGEN[slug];
  const varianten = PRODUKTKATALOG.filter((p) => {
    const oberkategorie = p.kategorien[0];
    const unterkategorie = letzteKategorie(p);
    return oberkategorie?.name === "Selfmailer" && unterkategorie?.name.includes(kennung);
  });
  if (varianten.length === 0) return null;

  const unterkategorie = letzteKategorie(varianten[0]);
  return {
    slug,
    name: unterkategorie.name.replace(/\s+/g, " ").trim(),
    beschreibung: unterkategorie.beschreibung,
    varianten,
  };
}
