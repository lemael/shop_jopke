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

export function getMailingFamilie(slug: MailingSlug): MailingFamilie | null {
  const kennung = FAMILIEN_KENNUNGEN[slug];
  const varianten = PRODUKTKATALOG.filter((produkt) => {
    const oberkategorie = produkt.kategorien[0];
    const produktlinie = produkt.kategorien[1];
    return (
      oberkategorie?.name === "Kuvertiertes Mailing" &&
      produktlinie?.name === kennung
    );
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