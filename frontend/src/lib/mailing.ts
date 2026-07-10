import { PRODUKTKATALOG, type Produkt } from "@/data/produktkatalog";

export interface MailingFamilie {
  slug: MailingSlug;
  name: string;
  beschreibung?: string;
  varianten: Produkt[];
}

const FAMILIEN_KENNUNGEN = {
  lang_mailing: "DIN-Lang-Mailing",
  c4_mailing: "DIN-C4-Mailing",
} as const;

export type MailingSlug = keyof typeof FAMILIEN_KENNUNGEN;

/**
 * Gruppiert PRODUKTKATALOG nach Kuvertiertes-Mailing-Produktlinie.
 * Kategorien-Ebenen: [0] Kuvertiertes Mailing, [1] Produktlinie (z.B. DIN-Lang-Mailing),
 * [2] Huellentyp (z.B. Fensterhuelle), [3] Ausstattung (z.B. Anschreiben + bis zu 3 Flyer).
 */
export function getMailingFamilie(slug: MailingSlug): MailingFamilie | null {
  const kennung = FAMILIEN_KENNUNGEN[slug];
  const varianten = PRODUKTKATALOG.filter((p) => {
    const oberkategorie = p.kategorien[0];
    const produktlinie = p.kategorien[1];
    return oberkategorie?.name === "Kuvertiertes Mailing" && produktlinie?.name === kennung;
  });
  if (varianten.length === 0) return null;

  const produktlinie = varianten[0].kategorien[1];
  return {
    slug,
    name: produktlinie.name,
    beschreibung: produktlinie.beschreibung,
    varianten,
  };
}
