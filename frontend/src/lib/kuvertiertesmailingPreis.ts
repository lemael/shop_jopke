import { berechnePorto, type Versandklasse } from "./porto";
import {
  berechneGesamtGewicht,
  ermittleVersandklasse,
  
} from "./gewicht";
import type { KuvertiertesMailingSlug} from "@/types/kuvertiertesMailing/mailingSlug";
import type { StaffelPreis } from "@/types/staffelPreis";
import { getTarifGewicht } from "./gewicht";
import type { AnschreibenGrammatur, AnschreibenFarbigkeit, FlyerUmfang, FlyerGrammatur, FlyerOberflaeche, BroschuereOberflaeche, BroschuereUmfang, AntwortkarteEndformat, AntwortkarteGrammatur, AntwortkarteOberflaeche } from "@/types/kuvertiertesMailing/types";
import {
  AUFLAGE_STAFFEL,
  EXPRESS_PROZENT_STAFFEL,
} from "@/data/constants";
import type { PreisDetails } from "@/types/preisDetails";
import { getAusstattungGewicht } from "./gewicht";
import {
  FENSTERHUELLE_DIN_C65_STAFFEL_PREISE,
  PANORAMA_FENSTERHUELLE_DIN_C65_STAFFEL_PREISE,
  HUELLE_OHNE_FENSTER_DIN_C65_STAFFEL_PREISE,
  ANSCHREIBEN_A1000_STAFFEL_PREISE,
  FLYER__STAFFEL_PREISE,
  BROSCHUERE_STAFFEL_PREISE,
  ANTWORTKARTE__STAFFEL_PREISE,

} from "@/data/staffelPreis";
import { AusstattungConfig, AusstattungPreisTranche } from "@/types/kuvertiertesMailing/ausstattungPreisTranche";
import { ArtikelTarifDetails } from "@/types/kuvertiertesMailing/artikelTarifDetails";
const SLUG_TO_FORMAT_TYPE: Record<KuvertiertesMailingSlug, "DIN_LANG" | "DIN_C4"> = {
  lang_mailing: "DIN_LANG",
  c4_mailing: "DIN_C4",
};



function getStaffelHauptartikelVorauswahlPreis(staffeln: StaffelPreis[], auflage: number): StaffelPreis | null {
  return staffeln.find((staffel) => auflage <= staffel.max) ?? null;
}

function getHuelleStaffelpreis(
  huellentyp: string | null,
  farbigkeit: string | null
): StaffelPreis[] | undefined {
  if (!huellentyp) return undefined;

  const key = farbigkeit;

  switch (huellentyp) {
    case "Fensterhülle":
    case "Fensterhülle DIN C6/5":
      return FENSTERHUELLE_DIN_C65_STAFFEL_PREISE[key as keyof typeof FENSTERHUELLE_DIN_C65_STAFFEL_PREISE];

    case "Panorama-Fensterhülle":
    case "Panorama-Fensterhülle DIN C6/5":
      return PANORAMA_FENSTERHUELLE_DIN_C65_STAFFEL_PREISE[key as keyof typeof PANORAMA_FENSTERHUELLE_DIN_C65_STAFFEL_PREISE];

    case "Hülle ohne Fenster":
    case "Hülle ohne Fenster DIN C6/5":
      return HUELLE_OHNE_FENSTER_DIN_C65_STAFFEL_PREISE[key as keyof typeof HUELLE_OHNE_FENSTER_DIN_C65_STAFFEL_PREISE];

    default:
      return undefined;
  }
}

function getAnschreibenStaffelpreis(
  grammatur: AnschreibenGrammatur | null,
  farbigkeit: AnschreibenFarbigkeit | null
): StaffelPreis[] | undefined {
  if (!grammatur || !farbigkeit) return undefined;

  return ANSCHREIBEN_A1000_STAFFEL_PREISE[grammatur]?.[farbigkeit];
}

function getFlyerStaffelpreis(
  umfang: FlyerUmfang | null,
  grammatur: FlyerGrammatur | null,
  oberflaeche: FlyerOberflaeche | null
): StaffelPreis[] | undefined {
  if (!umfang || !grammatur || !oberflaeche) return undefined;

  // 1. Accès au premier niveau (Umfang)
  const umfangMap = FLYER__STAFFEL_PREISE[umfang];
  console.log("umfangMap flyer :", umfangMap);
  if (!umfangMap) return undefined;

  // 2. Construction de la clé composite (ex: "170 g/m² matt")
  const papierKey = `${grammatur} ${oberflaeche}`;

  // 3. Récupération directe du tableau de tarifs
  console.log("papierKey flyer :", papierKey);
  const result = umfangMap[papierKey];
  console.log("result flyer :", result);
  return result;
}

function getBroschuereStaffelpreis(
  umfang: BroschuereUmfang | null,
  inhaltGrammatur?: string | null,
  inhaltOberflaeche?: BroschuereOberflaeche | null,
  umschlagGrammatur?: string | null,
  umschlagOberflaeche?: BroschuereOberflaeche | null
): StaffelPreis[] | undefined {

  if (!umfang) return undefined;

  // Accès sécurisé au premier niveau (Umfang)
  const umfangMap =
    BROSCHUERE_STAFFEL_PREISE[
      umfang as keyof typeof BROSCHUERE_STAFFEL_PREISE
    ];
  if (!umfangMap) return undefined;

  // Clé composite (ex: "90 g/m² matt | 170 g/m² matt")
  const inhaltKey = `${inhaltGrammatur} ${inhaltOberflaeche}`;
  const umschlagKey = `${umschlagGrammatur} ${umschlagOberflaeche}`;
  const comboKey = `${inhaltKey} | ${umschlagKey}`;

  // Accès au deuxième niveau
  return umfangMap[comboKey as keyof typeof umfangMap];
}

function getAntwortkarteStaffelpreis(
  endformat: AntwortkarteEndformat | string | null | undefined,
  grammatur: AntwortkarteGrammatur | string | null | undefined,
  oberflaeche: AntwortkarteOberflaeche | string | null | undefined = "matt"
): StaffelPreis[] | undefined {
  if (!endformat || !grammatur) return undefined;

  // Accès sécurisé au premier niveau (Endformat)
  const formatMap =
    ANTWORTKARTE__STAFFEL_PREISE[
      endformat as keyof typeof ANTWORTKARTE__STAFFEL_PREISE
    ];
  if (!formatMap) return undefined;

  // Clé composite pour la finition du papier (ex: "170 g/m² matt")
  const papierKey = `${grammatur} ${oberflaeche ?? "matt"}`;

  // Accès au deuxième niveau
  return formatMap[papierKey as keyof typeof formatMap];
}

/**
 * Hilfsfunktion zum Extrahieren der Zahl aus einem Grammatur-Text.
 * Beispiel: "80 g/m²" -> 80
 */
function parseGrammatur(val: string | null | undefined, fallback: number): number {
  if (!val) return fallback;
  const match = val.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : fallback;
}
function berechneArtikelPreis(
  tranche: StaffelPreis | undefined,
  auflage: number
): number {
  if (!tranche) return 0;
  
  return runden(tranche.fixpreis + (auflage / 1000) * tranche.preisPro1000);
}
/**
 * Hilfsfunktion zum Extrahieren der Seitenzahl aus einem Umfang-Text.
 * Beispiel: "12 Seiten" -> 12
 */
function parseSeiten(val: string | null | undefined, fallback: number): number {
  if (!val) return fallback;
  const match = val.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : fallback;
}

function stufenwert(tabelle: Record<number, number>, auflage: number): number {
  let ergebnis = tabelle[AUFLAGE_STAFFEL[0]];
  for (const stufe of AUFLAGE_STAFFEL) {
    if (auflage >= stufe) ergebnis = tabelle[stufe];
  }
  return ergebnis;
}

function runden(wert: number): number {
  return Math.round(wert * 100) / 100;
}





/**
 * Berechnet die Preisübersicht für eine Konfiguration des kuvertierten Mailings.
 * Gibt `null` zurück, wenn keine verifizierten Preisdaten von jopke.de vorliegen
 * (derzeit nur für DIN-Lang-Mailings mit allen drei Hüllentypen abgedeckt).
 */
export function berechnePreis(params: {
  slug: KuvertiertesMailingSlug;
  huellentyp: string | null;
  ausstattung: string | null;
  auflage: number | null;
  huellenFarbigkeit: string | null;
  anschreibenGrammatur?: string | null;
  anschreibenFarbigkeit?: string | null;
  flyerUmfang?: string | null;
  flyerGrammatur?: string | null;
  flyerConfigs?: Array<{
    umfang?: string | null;
    grammatur?: string | null;
    oberflaeche?: string | null;
  }>;
  broschuereUmfang?: string | null;
  antwortkarteEndformat?: string | null;
  antwortkarteGrammatur?: string | null;
  antwortkarteOberflaeche?: string | null;
  broschuereInhaltOberflaeche?: string | null;
  broschuereInhaltGrammatur?: string | null;
  broschuereUmschlagGrammatur?: string | null;
  broschuereUmschlagOberflaeche?: string | null;
  ausstattungConfig?: AusstattungConfig;
  artikelTarife: ArtikelTarifDetails[];
}): PreisDetails | null {
  const {
    slug,
    huellentyp,
    ausstattung,
    auflage,
    huellenFarbigkeit,
    anschreibenGrammatur,
    anschreibenFarbigkeit,
    flyerUmfang,
    flyerGrammatur,
    flyerConfigs,
    broschuereUmfang,
    antwortkarteEndformat,
    antwortkarteGrammatur,
    antwortkarteOberflaeche,
    broschuereInhaltOberflaeche,
    broschuereUmschlagOberflaeche,
    broschuereInhaltGrammatur,
    broschuereUmschlagGrammatur,
    ausstattungConfig,
    artikelTarife,
  } = params;

  if (slug !== "lang_mailing" || !huellentyp || !ausstattung || !auflage) return null;

  //const config = AUSSTATTUNG_CONFIG[`${huellentyp}|${ausstattung}`];
  // 1. On utilise le config dynamique du store à la place du hardcodé
  if (!ausstattungConfig) return null;
  console.log("ausstattungConfig :", ausstattungConfig);
  // On cherche la bonne tranche dans l'objet dynamique
  const staffelHauptartikelVorauswahl = ausstattungConfig.tranchen.find(
    (t) => auflage >= t.min && auflage <= t.max
  );

  //if (!config) return null;
 // const staffelHauptartikelVorauswahl = getStaffelHauptartikelVorauswahlPreis(config.staffeln, auflage);
  if (!staffelHauptartikelVorauswahl) return null;
  console.log("staffelHauptartikelVorauswahl :", staffelHauptartikelVorauswahl);
  // -------------------------------------------------------------
  // 1. BERECHNUNG DES DRUCKPREISES (BASIS + DELTAS)
  // -------------------------------------------------------------
  const huellenPreisListe = getHuelleStaffelpreis(huellentyp, huellenFarbigkeit);
  const huellenPreisTranche = huellenPreisListe?.find(t => auflage >= t.min && auflage <= t.max);
  const huellenPreis = berechneArtikelPreis(
   huellenPreisTranche,
    auflage
  );
  console.log("huellenPreis :", huellenPreis, "Détails :", {
    "huellentyp": huellentyp,
    "huellenFarbigkeit": huellenFarbigkeit,
  });
 
  
  const anschreibenStaffelListe = getAnschreibenStaffelpreis((anschreibenGrammatur as AnschreibenGrammatur) || null, (anschreibenFarbigkeit as AnschreibenFarbigkeit) || null);
  const anschreibenPreisTranche = anschreibenStaffelListe?.find(t => auflage >= t.min && auflage <= t.max);
  const anschreibenPreis = berechneArtikelPreis(
    anschreibenPreisTranche,
   
    auflage
  );
  // --- CALCUL DU DELTA DES FLYERS ---
  let flyerPreis = 0;
  let flyerPreisTranche = null;

  if (flyerConfigs && flyerConfigs.length > 0) {
    for (const f of flyerConfigs) {
      if (f.umfang && f.grammatur && f.oberflaeche) {
        const staffeln = getFlyerStaffelpreis(
        f.umfang as FlyerUmfang,
        f.grammatur as FlyerGrammatur,
        f.oberflaeche as FlyerOberflaeche
      );
      console.log("flyerStaffeln :", staffeln, "Détails :", {
        "umfang": f.umfang,
        "grammatur": f.grammatur,
        "oberflaeche": f.oberflaeche,
      });
      flyerPreisTranche = staffeln?.find(t => auflage >= t.min && auflage <= t.max);
      flyerPreis += berechneArtikelPreis(flyerPreisTranche, auflage);
      }
    }
    console.log("flyerPreis :", flyerPreis, "Détails :", {
      "flyerConfigs": flyerConfigs, "tranches": flyerConfigs.map(f => getFlyerStaffelpreis(f.umfang as FlyerUmfang, f.grammatur as FlyerGrammatur, f.oberflaeche as FlyerOberflaeche))
    });
  }
  

  let broschuerePreis = 0;


  
  const broschuerePreisTrancheListe = getBroschuereStaffelpreis(
        broschuereUmfang as BroschuereUmfang,
        broschuereInhaltGrammatur ,
        broschuereInhaltOberflaeche as BroschuereOberflaeche,
        broschuereUmschlagGrammatur,
        broschuereUmschlagOberflaeche as BroschuereOberflaeche,
        
      );
  const broschuerePreisTranche = broschuerePreisTrancheListe?.find(t => auflage >= t.min && auflage <= t.max);
  broschuerePreis = berechneArtikelPreis(
      broschuerePreisTranche,
      auflage
    );
    console.log("Delta de la brochure calculé :", broschuerePreis);
  

 
  const antwortkartePreisTrancheListe = getAntwortkarteStaffelpreis(
    antwortkarteEndformat,
    antwortkarteGrammatur,
    antwortkarteOberflaeche
  );
  const antwortkartePreisTranche = antwortkartePreisTrancheListe?.find(t => auflage >= t.min && auflage <= t.max);
  const antwortkartePreis = berechneArtikelPreis(antwortkartePreisTranche, auflage);
  console.log("antwortkartePreis :", antwortkartePreis, "Détails :", {
    "antwortkarteEndformat": antwortkarteEndformat,
    "antwortkarteGrammatur": antwortkarteGrammatur,
    "antwortkarteOberflaeche": antwortkarteOberflaeche,
  });

 function berechneHauptartikelVorauswahlPreis(staffel: AusstattungPreisTranche, auflage: number): number {
  const fix = staffel.fixpreis ?? 0;
  const p1000 = staffel.preisPro1000 ?? 0;
  return runden(fix + (auflage / 1000) * p1000);
}
  const hauptartikelPreis = berechneHauptartikelVorauswahlPreis(staffelHauptartikelVorauswahl, auflage);
  const gesamtPreisTranche = runden(
    hauptartikelPreis +
      huellenPreis +
      broschuerePreis +
      antwortkartePreis +
      anschreibenPreis +
      flyerPreis
  );
  const druck = runden( gesamtPreisTranche/1.5 );
  console.log("Prix total d'impression calculé :", druck, "€");

  console.table({
    "Hauptartikel / Vorauswahl": { Fixpreis: staffelHauptartikelVorauswahl?.fixpreis, "Preis o/oo": staffelHauptartikelVorauswahl?.preisPro1000, Total: hauptartikelPreis },
    "Hülle": {Fixpreis: huellenPreisTranche?.fixpreis, "Preis o/oo": huellenPreisTranche?.preisPro1000, Total: huellenPreis },
    "Anschreiben": {Fixpreis: anschreibenPreisTranche?.fixpreis, "Preis o/oo": anschreibenPreisTranche?.preisPro1000, Total: anschreibenPreis },
    "Flyer": {Fixpreis: flyerPreisTranche?.fixpreis, "Preis o/oo": flyerPreisTranche?.preisPro1000, Total: flyerPreis },
    "Broschüre": {Fixpreis: broschuerePreisTranche?.fixpreis, "Preis o/oo": broschuerePreisTranche?.preisPro1000, Total: broschuerePreis },
    "Antwortkarte": {Fixpreis: antwortkartePreisTranche?.fixpreis, "Preis o/oo": antwortkartePreisTranche?.preisPro1000, Total: antwortkartePreis },
  });
 

 // A) Hauptartikel / Ausstattung über getAusstattungGewicht
  const hauptartikelGewichtG = ausstattungConfig?.gewicht_in_g ?? 0;
  console.log("Hauptartikel Gewicht in Gramm:", hauptartikelGewichtG, "ausstattungConfig.gewicht_in_g:", ausstattungConfig?.gewicht_in_g);

  // B) Hülle (Filter über Hüllentyp & Ausstattung)
  const huellenGewichtG = getTarifGewicht(artikelTarife, huellentyp, {
    farbigkeit: huellenFarbigkeit,
  });
  console.log("Hülle Gewicht in Gramm:", huellenGewichtG, "farbigkeit:", huellenFarbigkeit);
 
  // C) Anschreiben (Filter über Kategorie 'Anschreiben' & Grammatur & Farbigkeit)
  const anschreibenGewichtG = anschreibenGrammatur && anschreibenFarbigkeit
      ? getTarifGewicht(artikelTarife, "Anschreiben", {
    grammatur: anschreibenGrammatur,
    farbigkeit: anschreibenFarbigkeit,
  }) : 0;
  console.log("Anschreiben Gewicht in Gramm:", anschreibenGewichtG);

  // D) Flyer (Schleife über alle aktiven Flyer-Konfigurationen)
  let flyerGewichtG = 0;
  if (flyerConfigs && flyerConfigs.length > 0) {
    for (const f of flyerConfigs) {
      if (f.umfang) {
        flyerGewichtG += getTarifGewicht(artikelTarife, "Flyer", {
          umfang: f.umfang,
          grammatur: f.grammatur,
        });
      }
    }
  }
  console.log("Flyer Gewicht in Gramm:", flyerGewichtG);

  // E) Broschüre (Filter über Kategorie 'Broschüre' & Umfang)
  const broschuereGewichtG = broschuereUmfang ? getTarifGewicht(artikelTarife, "Broschüre", {
    umfang: broschuereUmfang,
  }) : 0;
  console.log("Broschüre Gewicht in Gramm:", broschuereGewichtG);
  // F) Antwortkarte (Filter über Kategorie 'Antwortkarte', Endformat & Grammatur)
  const antwortkarteGewichtG = antwortkarteEndformat && antwortkarteGrammatur
      ? getTarifGewicht(artikelTarife, "Antwortkarte", {
    endformat: antwortkarteEndformat,
    grammatur: antwortkarteGrammatur,
  }) : 0;
  console.log("Antwortkarte Gewicht in Gramm:", antwortkarteGewichtG);
  const gesamtGewichtG = runden(
    hauptartikelGewichtG +
      huellenGewichtG +
      anschreibenGewichtG +
      flyerGewichtG +
      broschuereGewichtG +
      antwortkarteGewichtG
  );
   //console.log("Gesamtgewicht in Gramm:", gesamtGewichtG);
  // D) Broschüre (Inhalt 90 g/m² + Umschlag 170 g/m²)
  if (ausstattungConfig.broschuere || ausstattung.includes("Broschüre")) {
    const gesamtSeiten = parseSeiten(broschuereUmfang, 16);
    // Annahme: 4 Umschlagseiten, der Rest ist Inhalt
    const inhaltSeiten = Math.max(0, gesamtSeiten - 4);

   
  }

  // Gesamtgewicht berechnen
  
  const gesamtGewichtKg = runden((gesamtGewichtG * auflage) / 1000);
  //console.log("Gesamtgewicht in Kilogramm:", gesamtGewichtKg);

  // Automatische Ermittlung der Versandklasse (B oder C für DIN Lang, D bis H für C4)
  const formatTyp = SLUG_TO_FORMAT_TYPE[slug];
  const versandklasse: Versandklasse = ermittleVersandklasse(gesamtGewichtG, formatTyp);

  // -------------------------------------------------------------
  // 3. BERECHNUNG VON PORTO UND GESAMTSUMME
  // -------------------------------------------------------------
  const porto = berechnePorto(auflage, versandklasse);
  console.log("Porto:", porto, "Versandklasse:", versandklasse, "auflage:", auflage);
  const expressProzent = staffelHauptartikelVorauswahl.aufschlag_express_in_prozent ? (staffelHauptartikelVorauswahl.aufschlag_express_in_prozent / 100) 
    : stufenwert(EXPRESS_PROZENT_STAFFEL, auflage);
  const expressAufpreis = runden(druck * expressProzent);

  const gesamtNettoStandard = runden(druck + porto );
  const gesamtNettoExpress = runden(gesamtNettoStandard + expressAufpreis);
  const mwstStandard = runden(gesamtNettoStandard * 0.19);
  const gesamtBruttoStandard = runden(gesamtNettoStandard + mwstStandard);

  return {
    druck,
    porto,
    expressAufpreis,
    gesamtNettoStandard,
    gesamtNettoExpress,
    mwstStandard,
    gesamtBruttoStandard,
    gewichtProSendungG: gesamtGewichtG,
    gesamtGewichtKg,
    
  };
}
export function formatEuro(wert: number): string {
  return `${wert.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}
