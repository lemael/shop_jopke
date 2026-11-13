import type { PortoKonfiguration, PortoRegel } from "@/types/porto";

/**
 * Calcul du Porto à partir des règles livrées par le backend (GET /api/porto/regeln).
 * Les tarifs viennent de la feuille « Porto » de tarife.xlsx ; la formule est la même
 * que celle de PortoService (backend/app/services/porto_service.py) :
 *
 * - à partir de 5.000 Sendungen : Dialogpost, auflage × tarif ;
 * - en dessous, si c'est moins cher : « Aufzahlung auf 5.000 Sdg. », 5.000 × tarif ;
 * - sinon Dialogpost Easy : auflage × tarif_easy.
 */

function runden(wert: number): number {
  return Math.round(wert * 100) / 100;
}

/**
 * Classe selon le poids, sans jamais descendre sous la Mindest-Versandklasse de l'article.
 */
export function bestimmeVersandklasse(
  regeln: PortoRegel[],
  gewichtG: number,
  mindestVersandklasse?: string
): PortoRegel {
  const nachGewicht = regeln.find((regel) => gewichtG <= regel.gewicht_max_g);
  if (!nachGewicht) {
    throw new Error(`Keine Versandklasse für ${gewichtG} g`);
  }

  const mindest = mindestVersandklasse?.trim().toUpperCase();
  const indexMindest = regeln.findIndex((regel) => regel.versandklasse === mindest);

  return indexMindest > regeln.indexOf(nachGewicht) ? regeln[indexMindest] : nachGewicht;
}

export function berechnePortoAusKonfiguration(
  konfiguration: PortoKonfiguration,
  auflage: number,
  gewichtG: number,
  mindestVersandklasse?: string
): number {
  const regel = bestimmeVersandklasse(konfiguration.regeln, gewichtG, mindestVersandklasse);

  if (auflage >= konfiguration.mindestauflage_dialogpost) {
    return runden(auflage * regel.tarif);
  }

  if (auflage >= regel.ab_auflage_aufzahlung) {
    return runden(konfiguration.mindestauflage_dialogpost * regel.tarif);
  }

  return runden(auflage * regel.tarif_easy);
}
