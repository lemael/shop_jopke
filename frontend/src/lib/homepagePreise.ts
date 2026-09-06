
import type { SelfmailerSlug } from "@/lib/selfmailerPreis";
import type { KartenmailingSlug } from "@/lib/kartenmailingPreis";

import type { KuvertiertesMailingSlug } from "@/types/kuvertiertesMailing/mailingSlug";




function formatHomepagePrice(value: number) {
  return `ab ${value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}




export function getMailingHomepagePrice(slug: KuvertiertesMailingSlug): string {
  if (slug === "c4_mailing") {
    
    return  formatHomepagePrice(20);
  } else if (slug === "lang_mailing") {
    return formatHomepagePrice(20);
  } else {
    return "Preis nicht verfügbar";
  }


  
}
export function getSelfmailerHomepagePrice(slug: SelfmailerSlug): string {
  return formatHomepagePrice(20);
}
export function getKartenmailingHomepagePrice(slug: KartenmailingSlug): string {
 
  return "2";
}
