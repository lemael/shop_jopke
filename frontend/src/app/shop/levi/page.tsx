"use client";

import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const AUFLAGEN = [500, 1000, 2000, 3000, 5000, 10000];

const UMFANG_DATA: Record<number, { endformat: string; offenes: string; pdf: string | null }> = {
  4:  { endformat: "210 × 105 mm", offenes: "210 × 210 mm", pdf: "https://www.jopke.de/assets/pdf/druckvorlagen/040_DIN%20lang%20Selfmailer%20Levi_4.pdf" },
  6:  { endformat: "210 × 100 mm", offenes: "210 × 297 mm", pdf: "https://www.jopke.de/assets/pdf/druckvorlagen/041_DIN%20lang%20Selfmailer%20Levi_6.pdf" },
  8:  { endformat: "210 × 100 mm", offenes: "210 × 391 mm", pdf: "https://www.jopke.de/assets/pdf/druckvorlagen/042_DIN%20lang%20Selfmailer%20Levi_8.pdf" },
  10: { endformat: "210 × 100 mm", offenes: "210 × 482 mm", pdf: "https://www.jopke.de/assets/pdf/druckvorlagen/043_DIN%20lang%20Selfmailer%20Levi_10.pdf" },
  12: { endformat: "210 × 100 mm", offenes: "210 × 580 mm", pdf: null },
};

const GRAMMATUREN = ["135 g/m²", "170 g/m²", "250 g/m²"];

const PERFORATIONEN = [
  { value: "Ohne",    label: "Ohne Perforation" },
  { value: "Parallel", label: "Parallel zur letzten Seite" },
];

const VERARBEITUNGEN = [
  { value: "Mittelfalz_Leim",    label: "Mittelfalz auf DIN lang", desc: "mit ablösbarem Leim verschlossen" },
  { value: "Mittelfalz_Etikett", label: "Mittelfalz auf DIN lang", desc: "mit transparenten perforierten Etiketten verschlossen" },
  { value: "Wickelfalz_Leim",    label: "Wickelfalz auf DIN lang", desc: "mit ablösbarem Leim verschlossen" },
  { value: "Wickelfalz_Etikett", label: "Wickelfalz auf DIN lang", desc: "mit transparenten perforierten Etiketten verschlossen" },
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
  Mittelfalz_Leim: 0, Mittelfalz_Etikett: 10, Wickelfalz_Leim: 0, Wickelfalz_Etikett: 10,
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

function StepHeader({ step, title }: Readonly<{ step: number; title: string }>) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-8 h-8 flex items-center justify-center bg-[#822660] text-white font-bold text-sm shrink-0">{step}</span>
      <h2 className="text-lg font-bold text-[#2b2b2b] uppercase tracking-wide">{title}</h2>
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
  const field = STEP_FIELD[step];
  return field ? cfg[field] !== null : true;
}

export default function LeviKonfigurator() {
  const [currentStep, setCurrentStep] = useState<StepName>("Auflage");
  const [cfg, setCfg] = useState<Config>({ auflage: null, umfang: null, grammatur: null, perforation: null, verarbeitung: null, verarbeitungszeit: "Standard" });

  const stepIndex = STEPS.indexOf(currentStep);
  const totals = calcTotals(cfg);
  const umfangInfo = cfg.umfang ? UMFANG_DATA[cfg.umfang] : null;

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
                  <StepHeader step={1} title="Auflage wählen" />
                  <div className="flex flex-wrap gap-3">
                    {AUFLAGEN.map((a) => (
                      <OptionTile key={a} active={cfg.auflage === a}
                        onClick={() => setCfg({ ...cfg, auflage: a })}
                        title={a.toLocaleString("de-DE") + " Stück"} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Umfang" && (
                <>
                  <StepHeader step={2} title="Umfang wählen" />
                  <p className="text-sm text-[#666666] mb-5">
                    Endformat und offenes Format werden automatisch bestimmt.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(UMFANG_DATA).map(([seiten, info]) => (
                      <OptionTile key={seiten} active={cfg.umfang === Number(seiten)}
                        onClick={() => setCfg({ ...cfg, umfang: Number(seiten) })}
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
                  <StepHeader step={3} title="Grammatur wählen" />
                  <p className="text-sm text-[#666666] mb-5">Bilderdruck matt · 4/4-farbig Euroskala</p>
                  <div className="flex flex-wrap gap-3">
                    {GRAMMATUREN.map((g) => (
                      <OptionTile key={g} active={cfg.grammatur === g}
                        onClick={() => setCfg({ ...cfg, grammatur: g })}
                        title={g} subtitle="Bilderdruck matt" />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Perforation" && (
                <>
                  <StepHeader step={4} title="Perforation wählen" />
                  <div className="flex flex-wrap gap-3">
                    {PERFORATIONEN.map((p) => (
                      <OptionTile key={p.value} active={cfg.perforation === p.value}
                        onClick={() => setCfg({ ...cfg, perforation: p.value })}
                        title={p.label} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Verarbeitung" && (
                <>
                  <StepHeader step={5} title="Verarbeitung wählen" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {VERARBEITUNGEN.map((v) => (
                      <OptionTile key={v.value} active={cfg.verarbeitung === v.value}
                        onClick={() => setCfg({ ...cfg, verarbeitung: v.value })}
                        title={v.label} subtitle={v.desc} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Übersicht" && (
                <>
                  <StepHeader step={6} title="Übersicht & Bestellung" />
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
                      <p className="px-4 py-3 text-xs text-[#888888] border-t border-[#f0f0f0] leading-relaxed">
                        Der oben angegebene Betrag bildet die <strong>maximalen Portokosten ohne Portooptimierung</strong> ab.
                        Sie erhalten innerhalb von 48 Stunden nach Auftragsvergabe eine konkrete Portoabrechnung basierend auf den von Ihnen gelieferten Daten.
                      </p>
                    </div>
                  )}

                  <div className="bg-[#2b2b2b] text-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold">Konfiguration anfragen</p>
                      <p className="text-xs text-[#bbbbbb] mt-1">
                        Wir melden uns innerhalb eines Werktages mit einem verbindlichen Angebot.
                      </p>
                    </div>
                    <a
                      href={`/kontakt?produkt=DIN-Lang-Selfmailer+LEVI&auflage=${cfg.auflage}&umfang=${cfg.umfang}&grammatur=${encodeURIComponent(cfg.grammatur ?? "")}`}
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#822660] hover:bg-[#6b1f50] text-white font-semibold text-sm transition-colors shrink-0"
                    >
                      Jetzt anfragen →
                    </a>
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

      {/* ─── Info sections below wizard ──────────────────────────────────────── */}

      {/* 1 — Vorteile */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image placeholder – left */}
        <div className="bg-[#5ba3b8] min-h-64 flex items-center justify-center p-10">
          <div className="text-white text-center">
            <div className="w-24 h-24 mx-auto mb-4 border-4 border-white/40 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-12 h-12 fill-white/80"><path d="M8 8h48v8H8zm0 12h32v6H8zm0 10h40v6H8zm0 10h28v6H8z"/></svg>
            </div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">DIN-Lang-Selfmailer LEVI</p>
          </div>
        </div>
        {/* Text – right */}
        <div className="bg-white flex items-center px-10 py-12">
          <div>
            <h2 className="text-xl font-bold text-[#2b2b2b] mb-4">Selfmailer-Druck – Schnell, einfach &amp; professionell</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              Nutzen Sie unseren Online-Konfigurator, um Ihren DIN-Lang-Selfmailer LEVI unkompliziert zu bestellen.
              Wählen Sie Auflage, Grammatur und Verarbeitung – wir übernehmen Druck, Kuvertierung und Postauflieferung.
            </p>
          </div>
        </div>
      </div>

      {/* 2 — Ihre Vorteile */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Text – left */}
        <div className="bg-white flex items-center px-10 py-12">
          <div>
            <h2 className="text-lg font-bold text-[#2b2b2b] mb-4">Ihre Vorteile auf einen Blick:</h2>
            <p className="text-sm text-[#555555] mb-4">Wählen Sie aus verschiedenen Umfängen und Grammaturen für Ihren Selfmailer:</p>
            <ul className="text-sm text-[#555555] space-y-2">
              <li><strong>Portooptimierte Zustellung</strong> – Dialogpost-fähig, maximale Kosteneffizienz</li>
              <li><strong>4/4-farbiger Druck</strong> – Bilderdruck matt, Euroskala</li>
              <li><strong>Personalisierung inklusive</strong> – Adress- und Datendruck im Preis enthalten</li>
              <li><strong>Postauflieferung inklusive</strong> – Komplettservice aus einer Hand</li>
            </ul>
          </div>
        </div>
        {/* Image placeholder – right */}
        <div className="bg-[#5ba3b8] min-h-64 flex items-center justify-center p-10">
          <div className="text-white text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-white/40 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-10 h-10 fill-white/80"><path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm-4 42L14 32l4-4 10 10 22-22 4 4-22 22z"/></svg>
            </div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Komplettservice</p>
          </div>
        </div>
      </div>

      {/* 3 — Ideal für */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image placeholder – left */}
        <div className="bg-[#5ba3b8] min-h-64 flex items-center justify-center p-10">
          <div className="text-white text-center">
            <div className="w-24 h-24 mx-auto mb-4 border-4 border-white/40 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-12 h-12 fill-white/80"><path d="M10 6h44v52H10zm6 8v6h32v-6zm0 10v6h32v-6zm0 10v6h20v-6z"/></svg>
            </div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Vielseitig einsetzbar</p>
          </div>
        </div>
        {/* Text – right */}
        <div className="bg-white flex items-center px-10 py-12">
          <div>
            <h2 className="text-lg font-bold text-[#2b2b2b] mb-4">Ideal für:</h2>
            <ul className="text-sm text-[#555555] space-y-2">
              <li><strong>Kataloge &amp; Produktneuheiten</strong> – Perfekt gestaltet &amp; sofort versandfertig</li>
              <li><strong>Kundenakquise &amp; Kampagnen</strong> – Professioneller Direktmailing-Druck</li>
              <li><strong>Events &amp; Einladungen</strong> – Hochwertig gedruckt, portooptimiert zugestellt</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4 — Weitere Optionen */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Text – left */}
        <div className="bg-white flex items-center px-10 py-12">
          <div>
            <h2 className="text-lg font-bold text-[#2b2b2b] mb-3">Sie suchen weitere Optionen?</h2>
            <p className="text-sm text-[#555555] leading-relaxed mb-6">
              Für höhere Auflagen oder andere Formate empfehlen wir unsere weiteren Selfmailer-Produkte.
              Größere Auswahl an Formaten sowie vielfältige Falz- und Verschlussoptionen, um Ihren individuellen Bedürfnissen gerecht zu werden.
            </p>
            <a href="/#selfmailer"
              className="inline-block px-6 py-3 border-2 border-[#822660] text-[#822660] text-xs font-bold uppercase tracking-widest hover:bg-[#822660] hover:text-white transition-colors">
              Alle Selfmailer
            </a>
          </div>
        </div>
        {/* Image placeholder – right */}
        <div className="bg-[#5ba3b8] min-h-64 flex items-center justify-center p-10">
          <div className="text-center text-white space-y-3">
            {["LEVI", "INATA", "ALBA", "MIKRO"].map((name) => (
              <div key={name} className="bg-white/20 px-6 py-2 text-sm font-semibold tracking-wide">{name}</div>
            ))}
          </div>
        </div>
      </div>

      {/* 5 — CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image placeholder – left */}
        <div className="bg-[#5ba3b8] min-h-64 flex items-center justify-center p-10">
          <div className="text-white text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-white/40 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-10 h-10 fill-white/80"><path d="M52 8H12a4 4 0 0 0-4 4v40a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4zm-4 26H34v14h-4V34H16v-4h14V16h4v14h14v4z"/></svg>
            </div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Online konfigurieren</p>
          </div>
        </div>
        {/* Text – right */}
        <div className="bg-white flex items-center px-10 py-12">
          <div>
            <h2 className="text-xl font-bold text-[#2b2b2b] mb-4">Bestellen Sie jetzt – einfach, schnell und zuverlässig!</h2>
            <p className="text-sm text-[#555555] leading-relaxed mb-3">
              Nutzen Sie unseren Online-Konfigurator, um Ihren DIN-Lang-Selfmailer LEVI schnell und in bester Qualität zu bestellen.
              Profitieren Sie von unserem benutzerfreundlichen Bestellverfahren und gestalten Sie Ihr Mailing ganz nach Ihren Vorstellungen.
            </p>
            <p className="text-sm text-[#555555]">
              Setzen Sie auf <strong>Flexibilität &amp; Qualität</strong> mit unserem <strong>DIN-Lang-Selfmailer LEVI</strong>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
