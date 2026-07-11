"use client";

import { useMemo, useState } from "react";
import { OptionTile, StepHeader } from "@/components/ConfiguratorUI";
import { AuflageAuswahl } from "@/components/AuflageAuswahl";
import { BestellModal } from "@/components/BestellModal";
import { auflagenFuer } from "@/lib/auflage";
import type { Produkt } from "@/data/produktkatalog";
import type { MailingFamilie } from "@/lib/mailing";

function unique<T>(values: (T | null | undefined)[]): T[] {
  const result: T[] = [];
  for (const v of values) {
    if (v !== null && v !== undefined && !result.includes(v)) result.push(v);
  }
  return result;
}

interface Config {
  huellentyp: string | null;
  ausstattung: string | null;
  auflage: number | null;
}

const STEPS = ["Hüllentyp", "Ausstattung", "Auflage", "Übersicht"] as const;
type StepName = (typeof STEPS)[number];

export function KuvertiertesMailingKonfigurator({ familie }: Readonly<{ familie: MailingFamilie }>) {
  const { varianten, name, beschreibung } = familie;

  const huellentypen = useMemo(() => unique(varianten.map((v) => v.kategorien[2]?.name)), [varianten]);

  const [cfg, setCfg] = useState<Config>({ huellentyp: null, ausstattung: null, auflage: null });
  const [currentStep, setCurrentStep] = useState<StepName>("Hüllentyp");
  const stepIndex = STEPS.indexOf(currentStep);

  const huellentypInfo = varianten.find((v) => v.kategorien[2]?.name === cfg.huellentyp)?.kategorien[2];

  const nachHuellentyp = useMemo(
    () => varianten.filter((v) => v.kategorien[2]?.name === cfg.huellentyp),
    [varianten, cfg.huellentyp]
  );
  const ausstattungen = useMemo(() => unique(nachHuellentyp.map((v) => v.kategorien[3]?.name)), [nachHuellentyp]);
  const ausstattung = cfg.ausstattung && ausstattungen.includes(cfg.ausstattung) ? cfg.ausstattung : null;

  const ausgewaehlteVariante: Produkt | undefined = nachHuellentyp.find((v) => v.kategorien[3]?.name === ausstattung);

  const auflagen = useMemo(
    () => auflagenFuer(ausgewaehlteVariante?.mindestmenge, ausgewaehlteVariante?.maximalmenge),
    [ausgewaehlteVariante]
  );

  function goTo(step: StepName) {
    setCurrentStep(step);
  }

  function selectHuellentyp(h: string) {
    setCfg({ huellentyp: h, ausstattung: null, auflage: null });
    setCurrentStep("Ausstattung");
  }
  function selectAusstattung(a: string) {
    setCfg((c) => ({ ...c, ausstattung: a, auflage: null }));
    setCurrentStep("Auflage");
  }
  function selectAuflage(a: number) {
    setCfg((c) => ({ ...c, auflage: a }));
    setCurrentStep("Übersicht");
  }

  function isStepValid(step: StepName): boolean {
    if (step === "Hüllentyp") return cfg.huellentyp !== null;
    if (step === "Ausstattung") return ausstattung !== null;
    if (step === "Auflage") {
      const min = ausgewaehlteVariante?.mindestmenge ?? null;
      const max = ausgewaehlteVariante?.maximalmenge ?? null;
      return cfg.auflage !== null && (min === null || cfg.auflage >= min) && (max === null || cfg.auflage <= max);
    }
    return true;
  }

  function next() {
    const idx = STEPS.indexOf(currentStep);
    setCurrentStep(STEPS[Math.min(idx + 1, STEPS.length - 1)]);
  }

  const [bestellOpen, setBestellOpen] = useState(false);

  const uebersichtZeilen: [string, string][] = [
    ["Auflage", cfg.auflage ? `${cfg.auflage.toLocaleString("de-DE")} Stück` : "–"],
    ["Endformat", ausgewaehlteVariante?.endformat ?? "–"],
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

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <nav className="text-xs text-[#888888] mb-6">
          <a href="/" className="hover:text-[#822660]">Startseite</a>{" / "}
          <a href="/#kuvertiertes-mailing" className="hover:text-[#822660]">Kuvertiertes Mailing</a>{" / "}
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
              </div>
            )}
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <div className="bg-white border border-[#dcdcdc] p-6 sm:p-8">

              {currentStep === "Hüllentyp" && (
                <>
                  <StepHeader step={1} title="Hüllentyp wählen" helpTab="huellentyp" />
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
                  <StepHeader step={2} title="Ausstattung wählen" helpTab="ausstattung" />
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
                  <StepHeader step={3} title="Auflage wählen" helpTab="auflage" />
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

              {currentStep === "Übersicht" && (
                <>
                  <StepHeader step={4} title="Übersicht & Anfrage" helpTab="uebersicht" />
                  <table className="w-full text-sm mb-6">
                    <tbody className="divide-y divide-[#f0f0f0]">
                      {uebersichtZeilen.map(([label, value]) => (
                        <tr key={label}>
                          <td className="py-2 pr-4 font-semibold text-[#2b2b2b] w-40 align-top">{label}</td>
                          <td className="py-2 text-[#666666]">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {ausgewaehlteVariante?.pdf && (
                    <p className="text-xs text-[#888888] mb-6">Datenblatt: {ausgewaehlteVariante.pdf}</p>
                  )}

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
