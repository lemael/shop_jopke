import { PRODUKTKATALOG, type Produkt } from "@/data/produktkatalog";

export interface MailingFamilie {
  slug: MailingSlug;
}

const FAMILIEN_KENNUNGEN = {
  lang_mailing: "DIN-Lang-Mailing",
  c4_mailing: "DIN-C4-Mailing",
} as const;

export type MailingSlug = keyof typeof FAMILIEN_KENNUNGEN;

export function getMailingFamilie(slug: MailingSlug): string | null {
  const kennung = FAMILIEN_KENNUNGEN[slug];
 
  return kennung;
}