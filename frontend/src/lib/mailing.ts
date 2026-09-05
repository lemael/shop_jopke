import { PRODUKTKATALOG, type Produkt } from "@/data/produktkatalog";
import type { MailingSlug } from "@/types/kuvertiertesMailing/mailingSlug";
import { FAMILIEN_KENNUNGEN } from "@/types/kuvertiertesMailing/mailingSlug";

export interface MailingFamilie {
  slug: MailingSlug;
  name: string;
  beschreibung?: string;
  varianten: Produkt[];
}



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
