"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import type { Config, FlyerConfig, StepName } from "@/types/kuvertiertesMailing";
import { OptionTile, StepHeader } from "@/components/ConfiguratorUI";
import { AuflageAuswahl } from "@/components/AuflageAuswahl";
import { BestellModal } from "@/components/BestellModal";
import { auflagenFuer } from "@/lib/auflage";
import { berechnePreis, formatEuro } from "@/lib/mailingPreis";
import type { Produkt } from "@/data/produktkatalog";
import type { MailingFamilie } from "@/lib/mailing";
import {
  ANSCHREIBEN_OFFENES_FORMAT,
  ANSCHREIBEN_UMFANG,
  ANSCHREIBEN_PAPIER,
  ANSCHREIBEN_GRAMMATUR_OPTIONEN,
  ANSCHREIBEN_FARBIGKEIT_OPTIONEN,
  FLYER_UMFANG_OPTIONEN,
  FLYER_GRAMMATUR_NACH_UMFANG,
  FLYER_OBERFLAECHE_OPTIONEN,
  FLYER_ENDFORMAT_LANG,
  FLYER_FARBIGKEIT,
  FLYER_PAPIER_LANG,
  BROSCHUERE_UMFANG_OPTIONEN,
  BROSCHUERE_OBERFLAECHE_OPTIONEN,
  BROSCHUERE_ENDFORMAT_LANG,
  BROSCHUERE_FARBIGKEIT,
  BROSCHUERE_GRAMMATUR_LANG,
  BROSCHUERE_PAPIER_LANG,
  BROSCHUERE_VERARBEITUNG_LANG,
  ANTWORTKARTE_ENDFORMAT_OPTIONEN,
  ANTWORTKARTE_GRAMMATUR_OPTIONEN,
  ANTWORTKARTE_OBERFLAECHE_OPTIONEN,
  ANTWORTKARTE_UMFANG_LANG,
  ANTWORTKARTE_FARBIGKEIT,
  ANTWORTKARTE_PAPIER_LANG,
  FLYER_GRUPPE_C4,
  BROSCHUERE_GRUPPE_C4,
  ALL_STEPS,
  FLYER_STEPS,
  BROSCHUERE_STEPS,
  ANTWORTKARTE_STEPS,
  FENSTERHUELLE_FARBIGKEIT_OPTIONEN,
  PANORAMA_FARBIGKEIT_OPTIONEN,
} from "@/data/kuvertiertesMailing";

function unique<T>(values: (T | null | undefined)[]): T[] {
  const result: T[] = [];
  for (const v of values) {
    if (v !== null && v !== undefined && !result.includes(v)) result.push(v);
  }
  return result;
}





function farbigkeitOptionenFuerHuelle(huellentyp: string | null): readonly string[] {
  return huellentyp === "Panorama-Fensterhülle" ? PANORAMA_FARBIGKEIT_OPTIONEN : FENSTERHUELLE_FARBIGKEIT_OPTIONEN;
}

// Feste Spezifikation der Hülle (nicht wählbar, siehe Produktübersicht auf jopke.de).
// DIN-C4-Mailing verwendet durchgehend 100 g/m² (statt 75 g/m² bei DIN-Lang), ebenso Panorama-Fensterhülle.
const FENSTERHUELLE_PAPIER = "Offset";
const FENSTERHUELLE_GRAMMATUR = "75 g/m²";
const SCHWERE_GRAMMATUR = "100 g/m²";

function grammaturFuerHuelle(huellentyp: string | null, slug: string): string {
  return huellentyp === "Panorama-Fensterhülle" || slug === "c4_mailing" ? SCHWERE_GRAMMATUR : FENSTERHUELLE_GRAMMATUR;
}


function getVisibleSteps(args: {
  hatAnschreiben: boolean;
  flyerIstInteraktiv: boolean;
  broschuereIstInteraktiv: boolean;
  antwortkarteIstInteraktiv: boolean;
  anzahlFlyer: number;
}): StepName[] {
  const baseSteps = ALL_STEPS.filter((step) => {
    // Étapes toujours présentes
    if (["Hüllentyp", "Ausstattung", "Auflage", "Farbigkeit Hülle", "Übersicht"].includes(step)) {
      return true;
    }

    // Filtrage conditionnel
    if (step === "Grammatur Anschreiben" || step === "Farbigkeit Anschreiben") return args.hatAnschreiben;
    if (BROSCHUERE_STEPS.has(step)) return args.broschuereIstInteraktiv;
    if (ANTWORTKARTE_STEPS.has(step)) return args.antwortkarteIstInteraktiv;
    if (step === "Anzahl Flyer") return args.flyerIstInteraktiv;

    // On ignore les étapes statiques de flyer (Umfang Flyer, Grammatur Flyer, etc.)
    if (FLYER_STEPS.has(step)) return false;

    return true;
  });

  // Injecter les étapes dynamiques pour chaque flyer choisi
  if (args.flyerIstInteraktiv && args.anzahlFlyer > 0) {
    const dynamicFlyerSteps: StepName[] = [];
    for (let i = 1; i <= args.anzahlFlyer; i++) {
      dynamicFlyerSteps.push(`Flyer ${i} - Umfang` as StepName);
      dynamicFlyerSteps.push(`Flyer ${i} - Grammatur` as StepName);
      dynamicFlyerSteps.push(`Flyer ${i} - Oberfläche` as StepName);
    }

    const anzahlIndex = baseSteps.indexOf("Anzahl Flyer");
    if (anzahlIndex !== -1) {
      baseSteps.splice(anzahlIndex + 1, 0, ...dynamicFlyerSteps);
    }
  }

  return baseSteps;
}

function isStepValidForConfig(args: {
  step: StepName;
  cfg: Config;
  ausstattung: string | null;
  ausgewaehlteVariante?: Produkt;
}): boolean {
  const { step, cfg, ausstattung, ausgewaehlteVariante } = args;

  if (step === "Hüllentyp") return cfg.huellentyp !== null;
  if (step === "Ausstattung") return ausstattung !== null;
  if (step === "Auflage") {
    const min = ausgewaehlteVariante?.mindestmenge ?? null;
    const max = ausgewaehlteVariante?.maximalmenge ?? null;
    return cfg.auflage !== null && (min === null || cfg.auflage >= min) && (max === null || cfg.auflage <= max);
  }
  if (step === "Farbigkeit Hülle") return cfg.fensterhuelleFarbigkeit !== null;
  if (step === "Grammatur Anschreiben") return cfg.anschreibenGrammatur !== null;
  if (step === "Farbigkeit Anschreiben") return cfg.anschreibenFarbigkeit !== null;
  if (step === "Umfang Flyer") return cfg.flyerUmfang !== null;
  if (step === "Grammatur Flyer") return cfg.flyerGrammatur !== null;
  if (step === "Oberfläche Flyer") return cfg.flyerOberflaeche !== null;
  if (step === "Umfang Broschüre") return cfg.broschuereUmfang !== null;
  if (step === "Oberfläche Broschüre") return cfg.broschuereOberflaeche !== null;
  if (step === "Endformat Antwortkarte") return cfg.antwortkarteEndformat !== null;
  if (step === "Grammatur Antwortkarte") return cfg.antwortkarteGrammatur !== null;
  if (step === "Oberfläche Antwortkarte") return cfg.antwortkarteOberflaeche !== null;
  if (step === "Anzahl Flyer") return cfg.anzahlFlyer !== null && cfg.anzahlFlyer > 0;

  if (step.startsWith("Flyer")) {
    const flyerIndex = parseInt(step.split(" ")[1], 10) - 1;
    if (step.endsWith("Umfang")) return cfg.flyerConfigs[flyerIndex]?.umfang !== null;
    if (step.endsWith("Grammatur")) return cfg.flyerConfigs[flyerIndex]?.grammatur !== null;
    if (step.endsWith("Oberfläche")) return cfg.flyerConfigs[flyerIndex]?.oberflaeche !== null;
  }
  return true;
}

export function KuvertiertesMailingKonfigurator({ familie }: Readonly<{ familie: MailingFamilie }>) {
  const { varianten, name, beschreibung } = familie;

  const huellentypen = useMemo(() => unique(varianten.map((v) => v.kategorien[2]?.name)), [varianten]);

  const [cfg, setCfg] = useState<Config>({
    huellentyp: null,
    ausstattung: null,
    auflage: null,
    fensterhuelleFarbigkeit: null,
    anschreibenGrammatur: null,
    anschreibenFarbigkeit: null,
    flyerUmfang: null,
    flyerGrammatur: null,
    flyerOberflaeche: null,
    broschuereUmfang: null,
    broschuereOberflaeche: null,
    antwortkarteEndformat: null,
    antwortkarteGrammatur: null,
    antwortkarteOberflaeche: null,
    anzahlFlyer: null,
    flyerConfigs: [],
    verarbeitungszeit: "Standard",
  });
  const [currentStep, setCurrentStep] = useState<StepName>("Hüllentyp");

  const huellentypInfo = varianten.find((v) => v.kategorien[2]?.name === cfg.huellentyp)?.kategorien[2];

  const nachHuellentyp = useMemo(
    () => varianten.filter((v) => v.kategorien[2]?.name === cfg.huellentyp),
    [varianten, cfg.huellentyp]
  );
  const ausstattungen = useMemo(() => unique(nachHuellentyp.map((v) => v.kategorien[3]?.name)), [nachHuellentyp]);
  const ausstattung = cfg.ausstattung && ausstattungen.includes(cfg.ausstattung) ? cfg.ausstattung : null;

  const ausgewaehlteVariante: Produkt | undefined = nachHuellentyp.find((v) => v.kategorien[3]?.name === ausstattung);

  // "Hülle ohne Fenster"-Ausstattungen enthalten kein Anschreiben (siehe optionen.anschreiben in produktkatalog.ts) —
  // die beiden Anschreiben-Schritte werden dann übersprungen.
  const hatAnschreiben = Boolean(ausgewaehlteVariante?.optionen.anschreiben);
  const hatFlyer = Boolean(ausgewaehlteVariante?.optionen.flyer);
  const hatBroschuere = Boolean(ausgewaehlteVariante?.optionen.broschuere);
  const hatAntwortkarte = Boolean(ausgewaehlteVariante?.optionen.antwortkarte);
  // Umfang/Grammatur-Zusammenhang für Flyer nur für DIN-Lang verifiziert (siehe FLYER_GRAMMATUR_NACH_UMFANG) —
  // bei DIN-C4-Mailing bleibt Flyer eine reine Info-Gruppe ohne eigene Schritte (FLYER_GRUPPE_C4).
  const flyerIstInteraktiv = hatFlyer && familie.slug === "lang_mailing";
  // Broschüre DIN lang hat feste Grammatur (siehe BROSCHUERE_GRAMMATUR_LANG) — nur bei DIN-Lang interaktiv,
  // DIN-C4 hat mehrere Grammatur-Werte in der Produktübersicht und bleibt daher eine Info-Gruppe (BROSCHUERE_GRUPPE_C4).
  const broschuereIstInteraktiv = hatBroschuere && familie.slug === "lang_mailing";
  // Antwortkarte DIN lang: Endformat/Grammatur/Oberfläche unabhängig voneinander, nur für
  // DIN-Lang verifiziert (DIN-C4-Mailing bietet in der Praxis nie eine Antwortkarte an).
  const antwortkarteIstInteraktiv = hatAntwortkarte && familie.slug === "lang_mailing";

  const STEPS = useMemo(
    () =>
      getVisibleSteps({
        hatAnschreiben,
        flyerIstInteraktiv,
        broschuereIstInteraktiv,
        antwortkarteIstInteraktiv,
        anzahlFlyer: cfg.anzahlFlyer ?? 0,
      }),
    [
      hatAnschreiben,
      flyerIstInteraktiv,
      broschuereIstInteraktiv,
      antwortkarteIstInteraktiv,
      cfg.anzahlFlyer,
    ]
  );
  const stepIndex = STEPS.indexOf(currentStep);
  const stepNumber = (step: StepName) => STEPS.indexOf(step) + 1;

  const auflagen = useMemo(
    () => auflagenFuer(ausgewaehlteVariante?.mindestmenge, ausgewaehlteVariante?.maximalmenge),
    [ausgewaehlteVariante]
  );

  function goTo(step: StepName) {
    setCurrentStep(step);
  }

  function selectHuellentyp(h: string) {
    setCfg((c) => ({
      huellentyp: h,
      ausstattung: null,
      auflage: null,
      fensterhuelleFarbigkeit: null,
      anschreibenGrammatur: null,
      anschreibenFarbigkeit: null,
      flyerUmfang: null,
      flyerGrammatur: null,
      flyerOberflaeche: null,
      broschuereUmfang: null,
      broschuereOberflaeche: null,
      antwortkarteEndformat: null,
      antwortkarteGrammatur: null,
      antwortkarteOberflaeche: null,
      anzahlFlyer: null,
      flyerConfigs: [],
      verarbeitungszeit: c.verarbeitungszeit,
    }));
    setCurrentStep("Ausstattung");
  }
  function selectAusstattung(a: string) {
    setCfg((c) => ({
      ...c,
      ausstattung: a,
      auflage: null,
      fensterhuelleFarbigkeit: null,
      anschreibenGrammatur: null,
      anschreibenFarbigkeit: null,
      flyerUmfang: null,
      flyerGrammatur: null,
      flyerOberflaeche: null,
      broschuereUmfang: null,
      broschuereOberflaeche: null,
      antwortkarteEndformat: null,
      antwortkarteGrammatur: null,
      antwortkarteOberflaeche: null,
      anzahlFlyer: null,
      flyerConfigs: [],
    }));
    setCurrentStep("Auflage");
  }
  function selectAuflage(a: number) {
    setCfg((c) => ({ ...c, auflage: a }));
    next();
  }
  function selectFensterhuelleFarbigkeit(f: string) {
    setCfg((c) => ({ ...c, fensterhuelleFarbigkeit: f }));
    next();
  }
  function selectAnschreibenGrammatur(g: string) {
    setCfg((c) => ({ ...c, anschreibenGrammatur: g }));
    next();
  }
  function selectAnzahlFlyer(n: number) {
    setCfg((c) => ({
      ...c,
      anzahlFlyer: n,
      flyerConfigs: Array.from({ length: n }, () => ({ umfang: null, grammatur: null, oberflaeche: null })),
    }));
   // Bascule immédiatement vers la première étape du premier flyer
    setCurrentStep("Flyer 1 - Umfang" as StepName);
  }

  // --- GESTION DES FLYERS DYNAMIQUES (0 à 3 flyers) ---
  function selectFlyerUmfang(flyerIndex: number, u: string) {
    const newConfigs = [...cfg.flyerConfigs];
    newConfigs[flyerIndex] = { ...newConfigs[flyerIndex], umfang: u, grammatur: null };
    setCfg((c) => ({ ...c, flyerConfigs: newConfigs }));
    next();
  }

  function selectFlyerGrammatur(flyerIndex: number, g: string) {
    const newConfigs = [...cfg.flyerConfigs];
    newConfigs[flyerIndex] = { ...newConfigs[flyerIndex], grammatur: g };
    setCfg((c) => ({ ...c, flyerConfigs: newConfigs }));
    next();
  }

  function selectFlyerOberflaeche(flyerIndex: number, o: string) {
    const newConfigs = [...cfg.flyerConfigs];
    newConfigs[flyerIndex] = { ...newConfigs[flyerIndex], oberflaeche: o };
    setCfg((c) => ({ ...c, flyerConfigs: newConfigs }));
    next();
  }

 
 
  function selectBroschuereUmfang(u: string) {
    setCfg((c) => ({ ...c, broschuereUmfang: u }));
    next();
  }
  function selectBroschuereOberflaeche(o: string) {
    setCfg((c) => ({ ...c, broschuereOberflaeche: o }));
    next();
  }
 

  function selectAntwortkarteEndformat(e: string) {
    setCfg((c) => ({ ...c, antwortkarteEndformat: e }));
    next();
  }
  function selectAntwortkarteGrammatur(g: string) {
    setCfg((c) => ({ ...c, antwortkarteGrammatur: g }));
    next();
  }
  function selectAntwortkarteOberflaeche(o: string) {
    setCfg((c) => ({ ...c, antwortkarteOberflaeche: o }));
    next();
  }
  function selectAnschreibenFarbigkeit(f: string) {
    setCfg((c) => ({ ...c, anschreibenFarbigkeit: f }));
    next();
  }

  function isStepValid(step: StepName): boolean {
    return isStepValidForConfig({
      step,
      cfg,
      ausstattung,
      ausgewaehlteVariante,
    });
  }

  function next() {
    const idx = STEPS.indexOf(currentStep);
    setCurrentStep(STEPS[Math.min(idx + 1, STEPS.length - 1)]);
  }

  const [bestellOpen, setBestellOpen] = useState(false);

  const allgemeinZeilen: [string, string][] = [
    ["Auflage", cfg.auflage ? `${cfg.auflage.toLocaleString("de-DE")} Stück` : "–"],
    ["Hüllentyp", cfg.huellentyp ?? "–"],
    ["Ausstattung", ausstattung ?? "–"],
    ["Versandklasse", ausgewaehlteVariante?.versandklasse ?? "–"],
    [
      "Menge",
      ausgewaehlteVariante?.mindestmenge && ausgewaehlteVariante?.maximalmenge
        ? `${ausgewaehlteVariante.mindestmenge.toLocaleString("de-DE")} – ${ausgewaehlteVariante.maximalmenge.toLocaleString("de-DE")} Stück`
        : "–",
    ],
  ];

  const huelleGruppe = {
    titel: cfg.huellentyp ?? "Hülle",
    zeilen: [
      ["Endformat", ausgewaehlteVariante?.endformat ?? "–"],
      ["Farbigkeit", cfg.fensterhuelleFarbigkeit ?? "–"],
      ["Grammatur", cfg.huellentyp ? grammaturFuerHuelle(cfg.huellentyp, familie.slug) : "–"],
      ["Papier", cfg.huellentyp ? FENSTERHUELLE_PAPIER : "–"],
    ] as [string, string][],
  };

  const anschreibenGruppe = {
    titel: "Anschreiben DIN A4",
    zeilen: [
      ["Endformat", ANSCHREIBEN_OFFENES_FORMAT],
      ["Umfang", ANSCHREIBEN_UMFANG],
      ["Farbigkeit", cfg.anschreibenFarbigkeit ?? "–"],
      ["Grammatur", cfg.anschreibenGrammatur ?? "–"],
      ["Papier", ANSCHREIBEN_PAPIER],
    ] as [string, string][],
  };

  // Groupe pour le flyer en version DIN C4 (groupe d'information fixe)
  const flyerGruppeC4 = [FLYER_GRUPPE_C4];

  // Groupes dynamiques pour les flyers DIN lang (un groupe par flyer configuré)
  const flyerGruppenLang = cfg.flyerConfigs.map((flyerCfg, i) => ({
    titel: `Flyer ${i + 1} (DIN lang)`,
    zeilen: [
      ["Endformat", FLYER_ENDFORMAT_LANG],
      ["Umfang", flyerCfg.umfang ?? "–"],
      ["Farbigkeit", FLYER_FARBIGKEIT],
      ["Grammatur", flyerCfg.grammatur ?? "–"],
      ["Papier", FLYER_PAPIER_LANG],
      ["Oberfläche", flyerCfg.oberflaeche ?? "–"],
    ] as [string, string][],
  }));

  // Sélection du bon groupe selon la famille de produit
  const flyerGruppen = familie.slug === "c4_mailing" ? flyerGruppeC4 : flyerGruppenLang;

  const broschuereGruppeLang = {
    titel: "Broschüre DIN lang",
    zeilen: [
      ["Endformat", BROSCHUERE_ENDFORMAT_LANG],
      ["Umfang", cfg.broschuereUmfang ?? "–"],
      ["Farbigkeit", BROSCHUERE_FARBIGKEIT],
      ["Grammatur", BROSCHUERE_GRAMMATUR_LANG],
      ["Papier", BROSCHUERE_PAPIER_LANG],
      ["Oberfläche", cfg.broschuereOberflaeche ?? "–"],
      ["Verarbeitung", BROSCHUERE_VERARBEITUNG_LANG],
    ] as [string, string][],
  };
  const broschuereGruppe = familie.slug === "c4_mailing" ? BROSCHUERE_GRUPPE_C4 : broschuereGruppeLang;

  const antwortkarteGruppeLang = {
    titel: "Antwortkarte DIN lang",
    zeilen: [
      ["Endformat", cfg.antwortkarteEndformat ?? "–"],
      ["Umfang", ANTWORTKARTE_UMFANG_LANG],
      ["Farbigkeit", ANTWORTKARTE_FARBIGKEIT],
      ["Grammatur", cfg.antwortkarteGrammatur ?? "–"],
      ["Papier", ANTWORTKARTE_PAPIER_LANG],
      ["Oberfläche", cfg.antwortkarteOberflaeche ?? "–"],
    ] as [string, string][],
  };

  const uebersichtGruppen = [
    huelleGruppe,
    ...(hatAnschreiben ? [anschreibenGruppe] : []),
    ...(hatFlyer ? flyerGruppen : []),
    ...(hatBroschuere ? [broschuereGruppe] : []),
    ...(hatAntwortkarte ? [antwortkarteGruppeLang] : []),
  ];

  const preis = berechnePreis({
    slug: familie.slug,
    huellentyp: cfg.huellentyp,
    ausstattung,
    auflage: cfg.auflage,
    fensterhuelleFarbigkeit: cfg.fensterhuelleFarbigkeit,
    anschreibenGrammatur: cfg.anschreibenGrammatur,
    anschreibenFarbigkeit: cfg.anschreibenFarbigkeit,
    flyerUmfang: cfg.flyerUmfang,
    flyerGrammatur: cfg.flyerGrammatur,
    broschuereUmfang: cfg.broschuereUmfang,
    antwortkarteEndformat: cfg.antwortkarteEndformat,
    antwortkarteGrammatur: cfg.antwortkarteGrammatur,
  });

  const uebersichtZeilen: [string, string][] = [
    ...allgemeinZeilen,
    ...uebersichtGruppen.flatMap((g) => {
      if (!g) return [];
      return g.zeilen.map(([label, value]) => [`${g.titel} – ${label}`, value] as [string, string]);
    }),
    ...(preis
      ? ([
          ["Verarbeitungszeit", cfg.verarbeitungszeit === "Express" ? "Express" : "Standard"],
          ["Druck (netto)", formatEuro(preis.druck)],
          ["Porto (max., netto)", formatEuro(preis.porto)],
          ...(cfg.verarbeitungszeit === "Express" ? [["Express-Aufpreis", formatEuro(preis.expressAufpreis)] as [string, string]] : []),
          [
            "Gesamt (netto)",
            formatEuro(cfg.verarbeitungszeit === "Express" ? preis.gesamtNettoExpress : preis.gesamtNettoStandard),
          ],
        ] as [string, string][])
      : []),
  ];

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <nav className="text-xs text-[#888888] mb-6">
          <Link href="/" className="hover:text-[#822660]">Startseite</Link>{" / "}
          <Link href="/#kuvertiertes-mailing" className="hover:text-[#822660]">Kuvertiertes Mailing</Link>{" / "}
          <span className="text-[#2b2b2b]">{name}</span>
        </nav>

        <h1 className="text-2xl font-bold text-[#2b2b2b] mb-2">{name} – Konfigurator</h1>
        {beschreibung && (
          <p className="text-sm text-[#666666] mb-8 whitespace-pre-line max-w-2xl">{beschreibung}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-[#dcdcdc]">
              <div className="bg-[#2b2b2b] text-white text-xs font-semibold uppercase tracking-wide px-4 py-3">
                Konfiguration
              </div>
              <nav className="divide-y divide-[#f0f0f0]">
                {STEPS.map((step, i) => {
                  const done = i < stepIndex;
                  const active = step === currentStep;
                  const reachable = i <= stepIndex;
                  let btnClass = "text-[#aaaaaa] cursor-default";
                  if (active) btnClass = "bg-[#822660] text-white font-semibold";
                  else if (reachable) btnClass = "text-[#2b2b2b] hover:bg-[#f4f4f4] cursor-pointer";
                  let iconClass = "border-[#cccccc] text-[#cccccc]";
                  if (active) iconClass = "border-white text-white";
                  else if (done) iconClass = "border-[#822660] text-[#822660]";
                  return (
                    <button
                      key={step}
                      type="button"
                      disabled={!reachable}
                      onClick={() => reachable && goTo(step)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${btnClass}`}
                    >
                      <span className={`w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 border ${iconClass}`}>
                        {done ? "✓" : i + 1}
                      </span>
                      {step}
                    </button>
                  );
                })}
              </nav>
            </div>

            {Boolean(cfg.huellentyp) && (
              <div className="mt-4 bg-white border border-[#dcdcdc] p-4 text-xs text-[#666666] space-y-1">
                <p className="font-semibold text-[#2b2b2b] text-xs uppercase tracking-wide mb-2">Ihre Auswahl</p>
                {cfg.huellentyp && <p><span className="text-[#2b2b2b]">Hüllentyp:</span> {cfg.huellentyp}</p>}
                {ausstattung && <p><span className="text-[#2b2b2b]">Ausstattung:</span> {ausstattung}</p>}
                {cfg.auflage && <p><span className="text-[#2b2b2b]">Auflage:</span> {cfg.auflage.toLocaleString("de-DE")} Stück</p>}
                {cfg.fensterhuelleFarbigkeit && <p><span className="text-[#2b2b2b]">Farbigkeit Hülle:</span> {cfg.fensterhuelleFarbigkeit}</p>}
                {cfg.anschreibenGrammatur && <p><span className="text-[#2b2b2b]">Grammatur Anschreiben:</span> {cfg.anschreibenGrammatur}</p>}
                {cfg.anschreibenFarbigkeit && <p><span className="text-[#2b2b2b]">Farbigkeit Anschreiben:</span> {cfg.anschreibenFarbigkeit}</p>}
                {cfg.flyerUmfang && <p><span className="text-[#2b2b2b]">Umfang Flyer:</span> {cfg.flyerUmfang}</p>}
                {cfg.flyerGrammatur && <p><span className="text-[#2b2b2b]">Grammatur Flyer:</span> {cfg.flyerGrammatur}</p>}
                {cfg.flyerOberflaeche && <p><span className="text-[#2b2b2b]">Oberfläche Flyer:</span> {cfg.flyerOberflaeche}</p>}
                {cfg.broschuereUmfang && <p><span className="text-[#2b2b2b]">Umfang Broschüre:</span> {cfg.broschuereUmfang}</p>}
                {cfg.broschuereOberflaeche && <p><span className="text-[#2b2b2b]">Oberfläche Broschüre:</span> {cfg.broschuereOberflaeche}</p>}
                {cfg.antwortkarteEndformat && <p><span className="text-[#2b2b2b]">Endformat Antwortkarte:</span> {cfg.antwortkarteEndformat}</p>}
                {cfg.antwortkarteGrammatur && <p><span className="text-[#2b2b2b]">Grammatur Antwortkarte:</span> {cfg.antwortkarteGrammatur}</p>}
                {cfg.antwortkarteOberflaeche && <p><span className="text-[#2b2b2b]">Oberfläche Antwortkarte:</span> {cfg.antwortkarteOberflaeche}</p>}
                {cfg.anzahlFlyer && <p><span className="text-[#2b2b2b]">Anzahl Flyer:</span> {cfg.anzahlFlyer}</p>}
                {cfg.flyerConfigs.map((flyerCfg, i) => (
                  flyerCfg.umfang && <p key={i}><span className="text-[#2b2b2b]">Flyer {i + 1}:</span> {flyerCfg.umfang}, {flyerCfg.grammatur}, {flyerCfg.oberflaeche}</p>
                ))}
              </div>
            )}
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <div className="bg-white border border-[#dcdcdc] p-6 sm:p-8">

              {currentStep === "Hüllentyp" && (
                <>
                  <StepHeader step={stepNumber("Hüllentyp")} title="Hüllentyp wählen" helpTab="huellentyp" />
                  <div className="flex flex-wrap gap-3">
                    {huellentypen.map((h) => (
                      <OptionTile key={h} active={cfg.huellentyp === h} onClick={() => selectHuellentyp(h)} title={h} />
                    ))}
                  </div>
                  {huellentypInfo?.beschreibung && (
                    <div className="mt-6 bg-[#f4f4f4] border border-[#dcdcdc] p-4 text-sm text-[#555555] whitespace-pre-line">
                      {huellentypInfo.beschreibung}
                    </div>
                  )}
                </>
              )}

              {currentStep === "Ausstattung" && (
                <>
                  <StepHeader step={stepNumber("Ausstattung")} title="Ausstattung wählen" helpTab="ausstattung" />
                  <div className="flex flex-wrap gap-3">
                    {ausstattungen.map((a) => {
                      const beispiel = nachHuellentyp.find((v) => v.kategorien[3]?.name === a);
                      return (
                        <OptionTile
                          key={a}
                          active={ausstattung === a}
                          onClick={() => selectAusstattung(a)}
                          title={a}
                          subtitle={beispiel?.maximalmenge ? `bis ${beispiel.maximalmenge.toLocaleString("de-DE")} Stück` : undefined}
                        />
                      );
                    })}
                  </div>
                </>
              )}

              {currentStep === "Auflage" && (
                <>
                  <StepHeader step={stepNumber("Auflage")} title="Auflage wählen" helpTab="auflage" />
                  <AuflageAuswahl
                    auflagen={auflagen}
                    mindestmenge={ausgewaehlteVariante?.mindestmenge}
                    maximalmenge={ausgewaehlteVariante?.maximalmenge}
                    value={cfg.auflage}
                    onTileSelect={selectAuflage}
                    onCustomChange={(a) => setCfg((c) => ({ ...c, auflage: a }))}
                  />
                </>
              )}

              {currentStep === "Anzahl Flyer" && (
                <>
                  <StepHeader step={stepNumber("Anzahl Flyer")} title="Anzahl Flyer wählen" />
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3].map((n) => (
                      <OptionTile
                        key={n}
                        active={cfg.anzahlFlyer === n}
                        onClick={() => selectAnzahlFlyer(n)}
                        title={`${n} Flyer`}
                      />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Farbigkeit Hülle" && (
                <>
                  <StepHeader
                    step={stepNumber("Farbigkeit Hülle")}
                    title={`Farbigkeit ${cfg.huellentyp ?? "Hülle"} wählen`}
                    helpTab="farbigkeit"
                  />
                  <div className="flex flex-wrap gap-3">
                    {farbigkeitOptionenFuerHuelle(cfg.huellentyp).map((f) => (
                      <OptionTile
                        key={f}
                        active={cfg.fensterhuelleFarbigkeit === f}
                        onClick={() => selectFensterhuelleFarbigkeit(f)}
                        title={f}
                      />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Umfang Broschüre" && (
                <>
                  <StepHeader step={stepNumber("Umfang Broschüre")} title="Umfang Broschüre wählen" helpTab="umfang" />
                  <div className="flex flex-wrap gap-3">
                    {BROSCHUERE_UMFANG_OPTIONEN.map((u) => (
                      <OptionTile key={u} active={cfg.broschuereUmfang === u} onClick={() => selectBroschuereUmfang(u)} title={u} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Oberfläche Broschüre" && (
                <>
                  <StepHeader step={stepNumber("Oberfläche Broschüre")} title="Oberfläche Broschüre wählen" helpTab="oberflaeche" />
                  <div className="flex flex-wrap gap-3">
                    {BROSCHUERE_OBERFLAECHE_OPTIONEN.map((o) => (
                      <OptionTile key={o} active={cfg.broschuereOberflaeche === o} onClick={() => selectBroschuereOberflaeche(o)} title={o} />
                    ))}
                  </div>
                </>
              )}
             
               
             

             
             {/* --- BLAATTER/FLYER DYNAMIQUES (de 1 à N flyers) --- */}
              {Array.from({ length: cfg.anzahlFlyer ?? 0 }).map((_, i) => (
                <Fragment key={i}>
                  {currentStep === `Flyer ${i + 1} - Umfang` && (
                    <>
                      <StepHeader
                        step={stepNumber(currentStep)}
                        title={`Umfang Flyer ${i + 1} wählen`}
                        helpTab="umfang"
                      />
                      <div className="flex flex-wrap gap-3">
                        {FLYER_UMFANG_OPTIONEN.map((u) => (
                          <OptionTile
                            key={u}
                            active={cfg.flyerConfigs[i]?.umfang === u}
                            onClick={() => selectFlyerUmfang(i, u)}
                            title={u}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {currentStep === `Flyer ${i + 1} - Grammatur` && (
                    <>
                      <StepHeader
                        step={stepNumber(currentStep)}
                        title={`Grammatur Flyer ${i + 1} wählen`}
                        helpTab="grammatur"
                      />
                      <div className="flex flex-wrap gap-3">
                        {(FLYER_GRAMMATUR_NACH_UMFANG[cfg.flyerConfigs[i]?.umfang ?? ""] ?? []).map((g) => (
                          <OptionTile
                            key={g}
                            active={cfg.flyerConfigs[i]?.grammatur === g}
                            onClick={() => selectFlyerGrammatur(i, g)}
                            title={g}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {currentStep === `Flyer ${i + 1} - Oberfläche` && (
                    <>
                      <StepHeader
                        step={stepNumber(currentStep)}
                        title={`Oberfläche Flyer ${i + 1} wählen`}
                        helpTab="oberflaeche"
                      />
                      <div className="flex flex-wrap gap-3">
                        {FLYER_OBERFLAECHE_OPTIONEN.map((o) => (
                          <OptionTile
                            key={o}
                            active={cfg.flyerConfigs[i]?.oberflaeche === o}
                            onClick={() => selectFlyerOberflaeche(i, o)}
                            title={o}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </Fragment>
              ))}

              {/* --- OPTIONS DE LA LETTRE (ANSCHREIBEN) --- */}
              {currentStep === "Grammatur Anschreiben" && (
                <>
                  <StepHeader step={stepNumber("Grammatur Anschreiben")} title="Grammatur Anschreiben wählen" helpTab="grammatur" />
                  <div className="flex flex-wrap gap-3">
                    {ANSCHREIBEN_GRAMMATUR_OPTIONEN.map((g) => (
                      <OptionTile
                        key={g}
                        active={cfg.anschreibenGrammatur === g}
                        onClick={() => selectAnschreibenGrammatur(g)}
                        title={g}
                      />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Farbigkeit Anschreiben" && (
                <>
                  <StepHeader step={stepNumber("Farbigkeit Anschreiben")} title="Farbigkeit Anschreiben wählen" helpTab="farbigkeit" />
                  <div className="flex flex-wrap gap-3">
                    {ANSCHREIBEN_FARBIGKEIT_OPTIONEN.map((f) => (
                      <OptionTile
                        key={f}
                        active={cfg.anschreibenFarbigkeit === f}
                        onClick={() => selectAnschreibenFarbigkeit(f)}
                        title={f}
                      />
                    ))}
                  </div>
                </>
              )}


             

              {currentStep === "Endformat Antwortkarte" && (
                <>
                  <StepHeader step={stepNumber("Endformat Antwortkarte")} title="Endformat Antwortkarte wählen" helpTab="endformat" />
                  <div className="flex flex-wrap gap-3">
                    {ANTWORTKARTE_ENDFORMAT_OPTIONEN.map((e) => (
                      <OptionTile key={e} active={cfg.antwortkarteEndformat === e} onClick={() => selectAntwortkarteEndformat(e)} title={e} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Grammatur Antwortkarte" && (
                <>
                  <StepHeader step={stepNumber("Grammatur Antwortkarte")} title="Grammatur Antwortkarte wählen" helpTab="grammatur" />
                  <div className="flex flex-wrap gap-3">
                    {ANTWORTKARTE_GRAMMATUR_OPTIONEN.map((g) => (
                      <OptionTile key={g} active={cfg.antwortkarteGrammatur === g} onClick={() => selectAntwortkarteGrammatur(g)} title={g} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Oberfläche Antwortkarte" && (
                <>
                  <StepHeader step={stepNumber("Oberfläche Antwortkarte")} title="Oberfläche Antwortkarte wählen" helpTab="oberflaeche" />
                  <div className="flex flex-wrap gap-3">
                    {ANTWORTKARTE_OBERFLAECHE_OPTIONEN.map((o) => (
                      <OptionTile key={o} active={cfg.antwortkarteOberflaeche === o} onClick={() => selectAntwortkarteOberflaeche(o)} title={o} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Übersicht" && (
                <>
                  <StepHeader step={stepNumber("Übersicht")} title="Übersicht & Anfrage" helpTab="uebersicht" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    <div>
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-[#f0f0f0]">
                          {allgemeinZeilen.map(([label, value]) => (
                            <tr key={label}>
                              <td className="py-2 pr-4 font-semibold text-[#2b2b2b] w-40 align-top">{label}</td>
                              <td className="py-2 text-[#666666]">{value}</td>
                            </tr>
                          ))}
                          {uebersichtGruppen.map((gruppe) => (
                            <Fragment key={gruppe.titel}>
                              <tr>
                                <td colSpan={2} className="pt-5 pb-2 font-bold uppercase tracking-wide text-xs text-[#822660] border-t-2 border-[#822660]">
                                  {gruppe.titel}
                                </td>
                              </tr>
                              {gruppe.zeilen.map(([label, value]) => (
                                <tr key={`${gruppe.titel}-${label}`}>
                                  <td className="py-2 pr-4 font-semibold text-[#2b2b2b] w-40 align-top">{label}</td>
                                  <td className="py-2 text-[#666666]">{value}</td>
                                </tr>
                              ))}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>

                      {ausgewaehlteVariante?.pdf && (
                        <p className="text-xs text-[#888888] mt-4">Datenblatt: {ausgewaehlteVariante.pdf}</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#822660] mb-1">Preisübersicht</h3>
                      {preis ? (
                        <div className="border border-[#dcdcdc]">
                          <div className="bg-[#f4f4f4] px-4 py-2 text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide border-b border-[#dcdcdc]">
                            Inklusive Druck, Portooptimierung, Personalisierung, Verarbeitung und Postauflieferung
                          </div>
                          <dl className="text-sm">
                            <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                              <dt className="text-[#666666]">{name}</dt>
                              <dd className="font-semibold text-[#2b2b2b]">{formatEuro(preis.druck)}</dd>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                              <dt className="text-[#666666]">Porto</dt>
                              <dd className="font-semibold text-[#2b2b2b]">{formatEuro(preis.porto)}</dd>
                            </div>
                          </dl>

                          <div className="px-4 py-3 border-b border-[#dcdcdc]">
                            <p className="text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide mb-2">Verarbeitungszeit wählen</p>
                            <div className="flex flex-col gap-2">
                              {(["Standard", "Express"] as const).map((vz) => (
                                <button
                                  key={vz}
                                  type="button"
                                  onClick={() => setCfg((c) => ({ ...c, verarbeitungszeit: vz }))}
                                  className={`flex items-center justify-between px-3 py-2 border text-sm transition-colors cursor-pointer ${
                                    cfg.verarbeitungszeit === vz
                                      ? "bg-[#822660] border-[#822660] text-white"
                                      : "bg-white border-[#dcdcdc] text-[#333333] hover:border-[#822660]"
                                  }`}
                                >
                                  <span className="font-semibold">{vz === "Standard" ? "Standard" : "Express"}</span>
                                  <span className={`text-xs ml-4 ${cfg.verarbeitungszeit === vz ? "text-[#f0cce3]" : "text-[#888888]"}`}>
                                    {vz === "Standard" ? "+ 0,00 €" : `+ ${formatEuro(preis.expressAufpreis)}`}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <dl className="text-sm">
                            <div className="flex justify-between px-4 py-3 border-b border-[#dcdcdc] bg-[#f9f9f9]">
                              <dt className="font-bold text-[#2b2b2b]">Gesamt (netto):</dt>
                              <dd className="font-bold text-[#822660] text-lg">
                                {formatEuro(cfg.verarbeitungszeit === "Express" ? preis.gesamtNettoExpress : preis.gesamtNettoStandard)}
                              </dd>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                              <dt className="text-xs text-[#666666]">zzgl. 19% MwSt.:</dt>
                              <dd className="text-xs text-[#666666]">{formatEuro(preis.mwstStandard)}</dd>
                            </div>
                            <div className="flex justify-between px-4 py-2">
                              <dt className="font-semibold text-[#2b2b2b]">Gesamt (brutto):</dt>
                              <dd className="font-semibold text-[#2b2b2b]">{formatEuro(preis.gesamtBruttoStandard)}</dd>
                            </div>
                          </dl>
                          <div className="px-4 py-3 text-xs text-[#888888] border-t border-[#f0f0f0] space-y-1">
                            <p>
                              Gewicht pro Sendung: ca. {preis.gewichtProSendungG.toLocaleString("de-DE")} g
                            </p>
                            <p>
                              Gesamtgewicht: ca. {preis.gesamtGewichtKg.toLocaleString("de-DE")} kg
                            </p>
                          </div>
                          <p className="px-4 py-3 text-xs text-[#888888] border-t border-[#f0f0f0] leading-relaxed">
                            Der oben angegebene Betrag bildet die <strong>maximalen Portokosten ohne Portooptimierung</strong> ab.
                            Basiert auf der günstigsten Farbigkeit/Grammatur (Hülle unbedruckt, Anschreiben 80 g/m² 1/0-farbig
                            Schwarz) — Ihre Auswahl kann den Druckpreis erhöhen.
                          </p>
                        </div>
                      ) : (
                        <div className="border border-[#dcdcdc] p-4 text-sm text-[#666666] bg-[#f4f4f4]">
                          Für diese Kombination erstellen wir Ihnen ein individuelles Angebot. Wir melden uns innerhalb eines
                          Werktages mit dem konkreten Preis.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#2b2b2b] text-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold">Konfiguration anfragen</p>
                      <p className="text-xs text-[#bbbbbb] mt-1">
                        Wir melden uns innerhalb eines Werktages mit einem verbindlichen Angebot inkl. Preis.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBestellOpen(true)}
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#822660] hover:bg-[#6b1f50] text-white font-semibold text-sm transition-colors shrink-0 cursor-pointer"
                    >
                      Weiter →
                    </button>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#dcdcdc]">
                <button
                  type="button"
                  onClick={() => { const prev = STEPS[stepIndex - 1]; if (prev) goTo(prev); }}
                  disabled={stepIndex === 0}
                  className={`px-5 py-2.5 border text-sm font-medium transition-colors ${
                    stepIndex === 0
                      ? "border-[#dcdcdc] text-[#cccccc] cursor-default"
                      : "border-[#2b2b2b] text-[#2b2b2b] hover:bg-[#f4f4f4] cursor-pointer"
                  }`}
                >
                  ← Zurück
                </button>

                {currentStep !== "Übersicht" && (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!isStepValid(currentStep)}
                    className={`px-6 py-2.5 text-sm font-semibold transition-colors ${
                      isStepValid(currentStep)
                        ? "bg-[#822660] hover:bg-[#6b1f50] text-white cursor-pointer"
                        : "bg-[#dcdcdc] text-[#aaaaaa] cursor-default"
                    }`}
                  >
                    Weiter →
                  </button>
                )}
              </div>

            </div>
          </main>
        </div>
      </div>

      <BestellModal open={bestellOpen} onClose={() => setBestellOpen(false)} produkt={name} zeilen={uebersichtZeilen} />
    </div>
  );
}
