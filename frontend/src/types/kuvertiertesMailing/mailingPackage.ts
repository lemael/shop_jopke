import { ArtikelTarifDetails } from "@/types/artikelTarifDetails";

export interface MailingPackage {
  // 1. L'enveloppe est le seul élément TOUJOURS présent (obligatoire)
  huelle: ArtikelTarifDetails;

  // 2. Les éléments d'accompagnement (optionnels selon la configuration)
  anschreiben?: ArtikelTarifDetails | null;
  antwortkarte?: ArtikelTarifDetails | null;
  broschuere?: ArtikelTarifDetails | null;

  // 3. Les flyers (il peut y en avoir de 0 à 3)
  flyers: ArtikelTarifDetails[];
}