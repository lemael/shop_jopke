"use client";

import { useState } from "react";
import { AuflageAuswahl } from "@/components/AuflageAuswahl";
import { BestellModal } from "@/components/BestellModal";

// ─── Data ─────────────────────────────────────────────────────────────────────

const AUFLAGEN = [500, 1000, 2000, 3000, 5000, 10000];
const MINDESTMENGE = 500;
const MAXIMALMENGE = 100000;

const UMFANG_DATA: Record<number, { endformat: string; offenes: string; pdf: string | null }> = {
  4:  { endformat: "210 × 105 mm", offenes: "210 × 210 mm", pdf: "https://www.jopke.de/assets/pdf/druckvorlagen/040_DIN%20lang%20Selfmailer%20Levi_4.pdf" },
  6:  { endformat: "210 × 100 mm", offenes: "210 × 297 mm", pdf: "https://www.jopke.de/assets/pdf/druckvorlagen/041_DIN%20lang%20Selfmailer%20Levi_6.pdf" },
  8:  { endformat: "210 × 100 mm", offenes: "210 × 391 mm", pdf: "https://www.jopke.de/assets/pdf/druckvorlagen/042_DIN%20lang%20Selfmailer%20Levi_8.pdf" },
  10: { endformat: "210 × 100 mm", offenes: "210 × 482 mm", pdf: "https://www.jopke.de/assets/pdf/druckvorlagen/043_DIN%20lang%20Selfmailer%20Levi_10.pdf" },
  12: { endformat: "210 × 100 mm", offenes: "210 × 580 mm", pdf: null },
};

const GRAMMATUREN_BY_UMFANG: Record<number, string[]> = {
  4:  ["170 g/m²", "250 g/m²"],
  6:  ["135 g/m²", "170 g/m²", "250 g/m²"],
  8:  ["135 g/m²", "170 g/m²"],
  10: ["135 g/m²", "170 g/m²"],
  12: ["135 g/m²", "170 g/m²"],
};

const GRAMMATUREN = ["135 g/m²", "170 g/m²", "250 g/m²"];

function getGrammaturenForUmfang(umfang: number | null) {
  return umfang ? GRAMMATUREN_BY_UMFANG[umfang] ?? [] : [];
}

function getVerarbeitungenForUmfang(umfang: number | null) {
  if (!umfang) return [];
  const wickelfalz = VERARBEITUNGEN.filter((v) => v.value === "Wickelfalz");
  const mittelfalz = VERARBEITUNGEN.filter((v) => v.value === "Mittelfalz");
  return umfang === 4 ? mittelfalz : wickelfalz;
}

const PERFORATIONEN = [
  { value: "Ohne",    label: "Ohne Perforation" },
  { value: "Parallel", label: "Parallel zur letzten Seite" },
];

function getPerforationenForSelection(umfang: number | null, grammatur: string | null) {
  if (!umfang || !grammatur) return [];
  if (umfang === 4) {
    return PERFORATIONEN.filter((p) => p.value === "Ohne");
  }
  if (umfang === 6) {
    return grammatur === "135 g/m²"
      ? PERFORATIONEN.filter((p) => p.value === "Ohne")
      : PERFORATIONEN;
  }
  if (umfang === 8) {
    return grammatur === "135 g/m²"
      ? PERFORATIONEN.filter((p) => p.value === "Ohne")
      : PERFORATIONEN;
  }
  if (umfang === 10 || umfang === 12) {
    return grammatur === "135 g/m²" || grammatur === "170 g/m²"
      ? PERFORATIONEN.filter((p) => p.value === "Ohne")
      : [];
  }
  return [];
}

const VERARBEITUNGEN = [
  { value: "Mittelfalz", label: "Mittelfalz auf DIN lang", desc: "mit ablösb. Leim oder transp. perforierten Etiketten verschlossen" },
  { value: "Wickelfalz", label: "Wickelfalz auf DIN lang", desc: "mit ablösb. Leim oder transp. perforierten Etiketten verschlossen" },
];

// Druckpreis inkl. Portooptimierung, Personalisierung, Verarbeitung & Postauflieferung
// Quelle: jopke.de (8 Seiten / 500 Stück verifiziert; restliche Werte geschätzt)
const PRICE_MATRIX: Record<number, Record<number, number>> = {
  4:  { 500: 195,   1000: 245,  2000: 320,  3000: 390,  5000: 510,  10000: 850  },
  6:  { 500: 225,   1000: 285,  2000: 370,  3000: 450,  5000: 590,  10000: 985  },
  8:  { 500: 242.5, 1000: 320,  2000: 415,  3000: 505,  5000: 660,  10000: 1105 },
  10: { 500: 280,   1000: 355,  2000: 460,  3000: 560,  5000: 735,  10000: 1225 },
  12: { 500: 310,   1000: 390,  2000: 505,  3000: 615,  5000: 805,  10000: 1345 },
};

// Maximale Portokosten ohne Portooptimierung (Dialogpost ≤20 g)
const PORTO_RATE = 0.56; // €/Stück
const EXPRESS_SURCHARGE = 58.2; // Express (5 Arbeitstage)

const GRAMMATUR_FACTOR: Record<string, number> = {
  "135 g/m²": 1,
  "170 g/m²": 1.08,
  "250 g/m²": 1.15,
};

const VERARBEITUNG_SURCHARGE: Record<string, number> = {
  Mittelfalz: 0,
  Wickelfalz: 0,
};

const STEPS = ["Auflage", "Umfang", "Grammatur", "Perforation", "Verarbeitung", "Übersicht"] as const;
type StepName = (typeof STEPS)[number];

interface Config {
  auflage: number | null;
  umfang:  number | null;
  grammatur: string | null;
  perforation: string | null;
  verarbeitung: string | null;
  verarbeitungszeit: "Standard" | "Express";
}

function calcPrice(cfg: Config): number | null {
  if (!cfg.auflage || !cfg.umfang || !cfg.grammatur || !cfg.verarbeitung) return null;
  const base = PRICE_MATRIX[cfg.umfang]?.[cfg.auflage] ?? 0;
  const gFactor = GRAMMATUR_FACTOR[cfg.grammatur] ?? 1;
  const surcharge = VERARBEITUNG_SURCHARGE[cfg.verarbeitung] ?? 0;
  return Math.round(base * gFactor) + surcharge;
}

function OptionTile({ active, onClick, title, subtitle }: Readonly<{ active: boolean; onClick: () => void; title: string; subtitle?: string }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-1 w-full sm:w-auto min-w-35 p-4 border text-left transition-colors cursor-pointer ${
        active ? "bg-[#822660] border-[#822660] text-white" : "bg-white border-[#dcdcdc] text-[#333333] hover:border-[#822660]"
      }`}
    >
      <span className="font-semibold text-sm">{title}</span>
      {subtitle && <span className={`text-xs ${active ? "text-[#f0cce3]" : "text-[#888888]"}`}>{subtitle}</span>}
    </button>
  );
}

function StepHeader({ step, title, helpTab }: Readonly<{ step: number; title: string; helpTab?: string }>) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 flex items-center justify-center bg-[#822660] text-white font-bold text-sm shrink-0">{step}</span>
        <h2 className="text-lg font-bold text-[#2b2b2b] uppercase tracking-wide">{title}</h2>
      </div>
      {helpTab && (
        <a
          href={`/hilfe#${helpTab}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Hilfe zu diesem Schritt"
          aria-label="Hilfe zu diesem Schritt"
          className="w-7 h-7 flex items-center justify-center rounded-full border border-[#dcdcdc] text-[#822660] font-bold text-sm hover:border-[#822660] hover:bg-[#822660] hover:text-white transition-colors shrink-0"
        >
          ?
        </a>
      )}
    </div>
  );
}

interface Totals {
  druck: number; porto: number; express: number;
  netto: number; mwst: number; brutto: number;
}
function calcTotals(cfg: Config): Totals | null {
  const druck = calcPrice(cfg);
  if (!druck || cfg.auflage === null) return null;
  const porto = Math.round(cfg.auflage * PORTO_RATE * 100) / 100;
  const express = cfg.verarbeitungszeit === "Express" ? EXPRESS_SURCHARGE : 0;
  const netto = druck + porto + express;
  const mwst = Math.round(netto * 0.19 * 100) / 100;
  return { druck, porto, express, netto, mwst, brutto: netto + mwst };
}

const STEP_FIELD: Partial<Record<StepName, keyof Config>> = {
  Auflage: "auflage", Umfang: "umfang", Grammatur: "grammatur",
  Perforation: "perforation", Verarbeitung: "verarbeitung",
};
function isStepValid(step: StepName, cfg: Config): boolean {
  if (step === "Auflage") {
    return cfg.auflage !== null && cfg.auflage >= MINDESTMENGE && cfg.auflage <= MAXIMALMENGE;
  }
  const field = STEP_FIELD[step];
  return field ? cfg[field] !== null : true;
}

export default function LeviKonfigurator() {
  const [currentStep, setCurrentStep] = useState<StepName>("Auflage");
  const [cfg, setCfg] = useState<Config>({ auflage: null, umfang: null, grammatur: null, perforation: null, verarbeitung: null, verarbeitungszeit: "Standard" });
  const [bestellOpen, setBestellOpen] = useState(false);

  const stepIndex = STEPS.indexOf(currentStep);
  const totals = calcTotals(cfg);
  const umfangInfo = cfg.umfang ? UMFANG_DATA[cfg.umfang] : null;
  const konfigurationVollstaendig =
    cfg.auflage !== null && cfg.umfang !== null && cfg.grammatur !== null && cfg.verarbeitung !== null;
  const individuellePreisAnfrage = konfigurationVollstaendig && totals === null;

  const bestellZeilen: [string, string][] = [
    ["Auflage", cfg.auflage ? `${cfg.auflage.toLocaleString("de-DE")} Stück` : "–"],
    ["Umfang", cfg.umfang ? `${cfg.umfang} Seiten` : "–"],
    ["Endformat", umfangInfo?.endformat ?? "–"],
    ["Offenes Format", umfangInfo?.offenes ?? "–"],
    ["Farbigkeit", "4/4-farbig Euroskala"],
    ["Grammatur", cfg.grammatur ?? "–"],
    ["Papier", "Bilderdruck"],
    ["Oberfläche", "matt"],
    ["Perforation", cfg.perforation === "Parallel" ? "Parallel zur letzten Seite" : cfg.perforation ?? "–"],
    ["Verarbeitung", (() => { const v = VERARBEITUNGEN.find((x) => x.value === cfg.verarbeitung); return v ? `${v.label} – ${v.desc}` : "–"; })()],
    ["Verarbeitungszeit", cfg.verarbeitungszeit === "Express" ? "Express (5 Arbeitstage)" : "Standard (7 Arbeitstage)"],
    ...(totals
      ? ([
          ["Druck (netto)", `${totals.druck.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`],
          ["Porto (max., ohne Optimierung)", `${totals.porto.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`],
          ["Express-Aufpreis", totals.express === 0 ? "0,00 €" : `${totals.express.toFixed(2).replace(".", ",")} €`],
          ["Gesamt (netto)", `${totals.netto.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`],
          ["Gesamt (brutto)", `${totals.brutto.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`],
        ] as [string, string][])
      : []),
  ];

  function goTo(step: StepName) { setCurrentStep(step); }
  function next() { setCurrentStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)]); }

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <nav className="text-xs text-[#888888] mb-6">
          <a href="/" className="hover:text-[#822660]">Startseite</a>{" / "}
          <a href="/#selfmailer" className="hover:text-[#822660]">Selfmailer</a>{" / "}
          <span className="text-[#2b2b2b]">DIN-Lang-Selfmailer LEVI</span>
        </nav>

        <h1 className="text-2xl font-bold text-[#2b2b2b] mb-8">DIN-Lang-Selfmailer LEVI – Konfigurator</h1>

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

            {Boolean(cfg.auflage ?? cfg.umfang) && (
              <div className="mt-4 bg-white border border-[#dcdcdc] p-4 text-xs text-[#666666] space-y-1">
                <p className="font-semibold text-[#2b2b2b] text-xs uppercase tracking-wide mb-2">Ihre Auswahl</p>
                {cfg.auflage !== null && <p><span className="text-[#2b2b2b]">Auflage:</span> {cfg.auflage.toLocaleString("de-DE")} Stück</p>}
                {cfg.umfang !== null && <p><span className="text-[#2b2b2b]">Umfang:</span> {cfg.umfang} Seiten</p>}
                {umfangInfo      && <p><span className="text-[#2b2b2b]">Endformat:</span> {umfangInfo.endformat}</p>}
                {umfangInfo      && <p><span className="text-[#2b2b2b]">Offen:</span> {umfangInfo.offenes}</p>}
                {cfg.grammatur   && <p><span className="text-[#2b2b2b]">Grammatur:</span> {cfg.grammatur}</p>}
                {cfg.perforation && <p><span className="text-[#2b2b2b]">Perforation:</span> {cfg.perforation}</p>}
                {cfg.verarbeitung && <p><span className="text-[#2b2b2b]">Verarbeitung:</span> {VERARBEITUNGEN.find(v => v.value === cfg.verarbeitung)?.label}</p>}
                {totals !== null && (
                  <p className="border-t border-[#dcdcdc] pt-2 mt-2 font-bold text-[#822660]">
                    Gesamt: {totals.netto.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € netto
                  </p>
                )}
              </div>
            )}
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <div className="bg-white border border-[#dcdcdc] p-6 sm:p-8">

              {currentStep === "Auflage" && (
                <>
                  <StepHeader step={1} title="Auflage wählen" helpTab="auflage" />
                  <AuflageAuswahl
                    auflagen={AUFLAGEN}
                    mindestmenge={MINDESTMENGE}
                    maximalmenge={MAXIMALMENGE}
                    value={cfg.auflage}
                    onTileSelect={(a) => setCfg({ ...cfg, auflage: a })}
                    onCustomChange={(a) => setCfg({ ...cfg, auflage: a })}
                  />
                </>
              )}

              {currentStep === "Umfang" && (
                <>
                  <StepHeader step={2} title="Umfang wählen" helpTab="umfang" />
                  <p className="text-sm text-[#666666] mb-5">
                    Endformat und offenes Format werden automatisch bestimmt.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(UMFANG_DATA).map(([seiten, info]) => (
                      <OptionTile key={seiten} active={cfg.umfang === Number(seiten)}
                        onClick={() => {
                          const selected = Number(seiten);
                          const grammaturAllowed = getGrammaturenForUmfang(selected);
                          const verarbeitungAllowed = getVerarbeitungenForUmfang(selected).map((v) => v.value);
                          setCfg({
                            ...cfg,
                            umfang: selected,
                            grammatur: grammaturAllowed.includes(cfg.grammatur ?? "") ? cfg.grammatur : null,
                            verarbeitung: verarbeitungAllowed.includes(cfg.verarbeitung ?? "") ? cfg.verarbeitung : null,
                            perforation: null,
                          });
                        }}
                        title={`${seiten} Seiten`} subtitle={`Endformat: ${info.endformat}`} />
                    ))}
                  </div>
                  {cfg.umfang !== null && (
                    <div className="mt-6 bg-[#f4f4f4] border border-[#dcdcdc] p-4 text-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-[#888888]">Endformat</p>
                        <p className="font-semibold text-[#2b2b2b]">{UMFANG_DATA[cfg.umfang].endformat}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Offenes Format</p>
                        <p className="font-semibold text-[#2b2b2b]">{UMFANG_DATA[cfg.umfang].offenes}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Druckvorlage</p>
                        {UMFANG_DATA[cfg.umfang].pdf ? (
                          <a href={UMFANG_DATA[cfg.umfang].pdf ?? ""}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[#822660] hover:underline font-medium text-sm">
                            PDF ↓
                          </a>
                        ) : <span className="text-[#aaaaaa] text-sm">–</span>}
                      </div>
                    </div>
                  )}
                </>
              )}

              {currentStep === "Grammatur" && (
                <>
                  <StepHeader step={3} title="Grammatur wählen" helpTab="grammatur" />
                  <p className="text-sm text-[#666666] mb-5">Bilderdruck matt · 4/4-farbig Euroskala</p>
                  <div className="flex flex-wrap gap-3">
                    {cfg.umfang === null ? (
                      <p className="text-sm text-[#666666]">Bitte wählen Sie zuerst den Umfang.</p>
                    ) : (
                      getGrammaturenForUmfang(cfg.umfang).map((g) => (
                        <OptionTile key={g} active={cfg.grammatur === g}
                          onClick={() => setCfg({ ...cfg, grammatur: g })}
                          title={g} subtitle="Bilderdruck matt" />
                      ))
                    )}
                  </div>
                </>
              )}

              {currentStep === "Perforation" && (
                <>
                  <StepHeader step={4} title="Perforation wählen" helpTab="perforation" />
                  <div className="flex flex-wrap gap-3">
                    {cfg.umfang === null || cfg.grammatur === null ? (
                      <p className="text-sm text-[#666666]">Bitte wählen Sie zuerst Umfang und Grammatur.</p>
                    ) : (
                      getPerforationenForSelection(cfg.umfang, cfg.grammatur).map((p) => (
                        <OptionTile key={p.value} active={cfg.perforation === p.value}
                          onClick={() => setCfg({ ...cfg, perforation: p.value })}
                          title={p.label} />
                      ))
                    )}
                  </div>
                </>
              )}

              {currentStep === "Verarbeitung" && (
                <>
                  <StepHeader step={5} title="Verarbeitung wählen" helpTab="verarbeitung" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cfg.umfang === null ? (
                      <p className="text-sm text-[#666666]">Bitte wählen Sie zuerst den Umfang.</p>
                    ) : (
                      getVerarbeitungenForUmfang(cfg.umfang).map((v) => (
                        <OptionTile key={v.value} active={cfg.verarbeitung === v.value}
                          onClick={() => setCfg({ ...cfg, verarbeitung: v.value })}
                          title={v.label} subtitle={v.desc} />
                      ))
                    )}
                  </div>
                </>
              )}

              {currentStep === "Übersicht" && (
                <>
                  <StepHeader step={6} title="Übersicht & Bestellung" helpTab="uebersicht" />
                  <table className="w-full text-sm mb-6">
                    <tbody className="divide-y divide-[#f0f0f0]">
                      {[
                        ["Produkt",         "DIN-Lang-Selfmailer LEVI"],
                        ["Auflage",         cfg.auflage ? `${cfg.auflage.toLocaleString("de-DE")} Stück` : "–"],
                        ["Umfang",          cfg.umfang ? `${cfg.umfang} Seiten` : "–"],
                        ["Endformat",       umfangInfo?.endformat ?? "–"],
                        ["Offenes Format",  umfangInfo?.offenes ?? "–"],
                        ["Farbigkeit",      "4/4-farbig Euroskala"],
                        ["Grammatur",       cfg.grammatur ?? "–"],
                        ["Papier",          "Bilderdruck"],
                        ["Oberfläche",      "matt"],
                        ["Perforation",     cfg.perforation === "Parallel" ? "Parallel zur letzten Seite" : cfg.perforation ?? "–"],
                        ["Verarbeitung", (() => { const v = VERARBEITUNGEN.find(x => x.value === cfg.verarbeitung); return v ? `${v.label} – ${v.desc}` : "–"; })()],
                      ].map(([label, value]) => (
                        <tr key={label}>
                          <td className="py-2 pr-4 font-semibold text-[#2b2b2b] w-40 align-top">{label}</td>
                          <td className="py-2 text-[#666666]">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Verarbeitungszeit */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide mb-3">Verarbeitungszeit wählen</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {(["Standard", "Express"] as const).map((vz) => (
                        <button
                          key={vz}
                          type="button"
                          onClick={() => setCfg({ ...cfg, verarbeitungszeit: vz })}
                          className={`flex items-center justify-between px-4 py-3 border text-sm transition-colors cursor-pointer ${
                            cfg.verarbeitungszeit === vz
                              ? "bg-[#822660] border-[#822660] text-white"
                              : "bg-white border-[#dcdcdc] text-[#333333] hover:border-[#822660]"
                          }`}
                        >
                          <span className="font-semibold">
                            {vz === "Standard" ? "Standard (7 Arbeitstage)" : "Express (5 Arbeitstage)"}
                          </span>
                          <span className={`text-xs ml-4 ${cfg.verarbeitungszeit === vz ? "text-[#f0cce3]" : "text-[#888888]"}`}>
                            {vz === "Standard" ? "+ 0,00 €" : `+ ${EXPRESS_SURCHARGE.toFixed(2).replace(".", ",")} €`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preisaufstellung */}
                  {totals !== null && (
                    <div className="border border-[#dcdcdc] mb-6">
                      <div className="bg-[#f4f4f4] px-4 py-2 text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide border-b border-[#dcdcdc]">
                        Inklusive Druck, Portooptimierung, Personalisierung, Verarbeitung und Postauflieferung
                      </div>
                      <dl className="w-full text-sm">
                        <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                          <dt className="text-[#666666]">DIN-Lang-Selfmailer LEVI</dt>
                          <dd className="font-semibold text-[#2b2b2b]">{totals.druck.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</dd>
                        </div>
                        <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                          <dt className="text-[#666666]">Porto</dt>
                          <dd className="font-semibold text-[#2b2b2b]">{totals.porto.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</dd>
                        </div>
                        <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                          <dt className="text-[#666666]">
                            {cfg.verarbeitungszeit === "Express" ? "Express (5 Arbeitstage)" : "Standard (7 Arbeitstage)"}
                          </dt>
                          <dd className="font-semibold text-[#2b2b2b]">
                            {totals.express === 0 ? "0,00 €" : `${totals.express.toFixed(2).replace(".", ",")} €`}
                          </dd>
                        </div>
                        <div className="flex justify-between px-4 py-3 border-b border-[#dcdcdc] bg-[#f9f9f9]">
                          <dt className="font-bold text-[#2b2b2b]">Gesamt (netto):</dt>
                          <dd className="font-bold text-[#822660] text-lg">{totals.netto.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</dd>
                        </div>
                        <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                          <dt className="text-xs text-[#666666]">zzgl. 19% MwSt.:</dt>
                          <dd className="text-xs text-[#666666]">{totals.mwst.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</dd>
                        </div>
                        <div className="flex justify-between px-4 py-2">
                          <dt className="font-semibold text-[#2b2b2b]">Gesamt (brutto):</dt>
                          <dd className="font-semibold text-[#2b2b2b]">{totals.brutto.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</dd>
                        </div>
                      </dl>
                      <div className="px-4 py-3 text-xs text-[#888888] border-t border-[#f0f0f0] leading-relaxed space-y-2">
                        <p>
                          Sendungen <a href="/hilfe#dialogpost" className="text-[#822660] underline">müssen werblichen Inhalt</a> enthalten, ansonsten kann es zu Preisaufschlägen durch die Deutsche Post AG kommen.
                        </p>
                        <p>Der oben angegebene Betrag bildet die maximalen Portokosten ohne Portooptimierung ab. Sie erhalten innerhalb von 48 Stunden nach Auftragsvergabe eine konkrete Portoabrechnung basierend auf den von Ihnen gelieferten Daten.</p>
                        <p>Alle Produktionszeiten basieren auf der Annahme, dass die Materialverfügbarkeit am Markt gewährleistet ist.</p>
                        <p>Nach Eingang der Portokosten beginnen wir mit der Bearbeitung Ihres Auftrags. Die Verarbeitungszeit bezieht sich auf diesen Startzeitpunkt.</p>
                        <p><a href="/hilfe#portooptimierung" className="text-[#822660] underline">Infos zur Portooptimierung</a></p>
                      </div>
                    </div>
                    )}

                  {individuellePreisAnfrage && (
                    <div className="border border-[#dcdcdc] mb-6 p-4 text-sm text-[#666666] bg-[#f4f4f4]">
                      Für Ihre gewählte Auflage von {cfg.auflage?.toLocaleString("de-DE")} Stück erstellen wir Ihnen ein individuelles Angebot.
                      Wir melden uns innerhalb eines Werktages mit dem konkreten Preis.
                    </div>
                  )}

                  <div className="bg-[#2b2b2b] text-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold">Konfiguration anfragen</p>
                      <p className="text-xs text-[#bbbbbb] mt-1">
                        Wir melden uns innerhalb eines Werktages mit einem verbindlichen Angebot.
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

                  {umfangInfo?.pdf && (
                    <div className="mt-5 border border-[#dcdcdc] p-4 flex items-center justify-between text-sm">
                      <span className="text-[#333333]">Druckvorlage für <strong>{cfg.umfang} Seiten</strong></span>
                      <a href={umfangInfo.pdf} target="_blank" rel="noopener noreferrer"
                        className="text-[#822660] hover:underline font-medium">
                        PDF herunterladen ↓
                      </a>
                    </div>
                  )}
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
                    disabled={!isStepValid(currentStep, cfg)}
                    className={`px-6 py-2.5 text-sm font-semibold transition-colors ${
                      isStepValid(currentStep, cfg)
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

      

      <BestellModal
        open={bestellOpen}
        onClose={() => setBestellOpen(false)}
        produkt="DIN-Lang-Selfmailer LEVI"
        zeilen={bestellZeilen}
      />
    </div>
  );
}
