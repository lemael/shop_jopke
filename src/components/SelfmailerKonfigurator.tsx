"use client";

import { useMemo, useState } from "react";
import { OptionTile, StepHeader } from "@/components/ConfiguratorUI";
import { AuflageAuswahl } from "@/components/AuflageAuswahl";
import { BestellModal } from "@/components/BestellModal";
import { auflagenFuer } from "@/lib/auflage";
import type { Produkt } from "@/data/produktkatalog";
import type { SelfmailerFamilie } from "@/lib/selfmailer";

function unique<T>(values: (T | null | undefined)[]): T[] {
  const result: T[] = [];
  for (const v of values) {
    if (v !== null && v !== undefined && !result.includes(v)) result.push(v);
  }
  return result;
}

interface Config {
  auflage: number | null;
  umfang: string | null;
  grammatur: string | null;
  perforation: string | null;
}

export function SelfmailerKonfigurator({ familie }: Readonly<{ familie: SelfmailerFamilie }>) {
  const { varianten, name, beschreibung } = familie;

  const mindestmenge = useMemo(
    () => Math.min(...varianten.map((v) => v.mindestmenge ?? Infinity).filter((n) => n !== Infinity)),
    [varianten]
  );
  const maximalmenge = useMemo(
    () => Math.max(...varianten.map((v) => v.maximalmenge ?? -Infinity).filter((n) => n !== -Infinity)),
    [varianten]
  );
  const auflagen = useMemo(() => auflagenFuer(mindestmenge, maximalmenge), [mindestmenge, maximalmenge]);

  const umfaenge = useMemo(() => unique(varianten.map((v) => v.umfang)), [varianten]);
  const [cfg, setCfg] = useState<Config>({ auflage: null, umfang: null, grammatur: null, perforation: null });

  const nachUmfang = useMemo(() => varianten.filter((v) => v.umfang === cfg.umfang), [varianten, cfg.umfang]);
  const grammaturen = useMemo(() => unique(nachUmfang.map((v) => v.inhalt?.grammatur)), [nachUmfang]);
  const grammatur = cfg.grammatur && grammaturen.includes(cfg.grammatur) ? cfg.grammatur : null;

  const nachGrammatur = useMemo(() => nachUmfang.filter((v) => v.inhalt?.grammatur === grammatur), [nachUmfang, grammatur]);
  const perforationen = useMemo(() => unique(nachGrammatur.map((v) => v.perforation)), [nachGrammatur]);
  const brauchtPerforationsAuswahl = perforationen.length > 1;
  const perforation = brauchtPerforationsAuswahl
    ? (cfg.perforation && perforationen.includes(cfg.perforation) ? cfg.perforation : null)
    : (perforationen[0] ?? null);

  const ausgewaehlteVariante: Produkt | undefined = nachGrammatur.find((v) =>
    brauchtPerforationsAuswahl ? v.perforation === perforation : true
  );

  const steps = useMemo(
    () => ["Auflage", "Umfang", "Grammatur", ...(brauchtPerforationsAuswahl ? ["Perforation"] : []), "Übersicht"] as const,
    [brauchtPerforationsAuswahl]
  );
  type StepName = (typeof steps)[number];

  const [currentStep, setCurrentStep] = useState<StepName>("Auflage");
  const stepIndex = steps.indexOf(currentStep as never);

  function goTo(step: StepName) {
    setCurrentStep(step);
  }

  function selectAuflage(a: number) {
    setCfg((c) => ({ ...c, auflage: a }));
    setCurrentStep("Umfang");
  }
  function selectUmfang(u: string) {
    setCfg((c) => ({ ...c, umfang: u, grammatur: null, perforation: null }));
    setCurrentStep("Grammatur");
  }
  function selectGrammatur(g: string) {
    // brauchtPerforationsAuswahl stammt aus dem vorherigen Render (basiert auf altem cfg.grammatur)
    // und darf hier nicht verwendet werden - stattdessen frisch aus nachUmfang + g ableiten.
    const passendeVarianten = nachUmfang.filter((v) => v.inhalt?.grammatur === g);
    const perforationsOptionenFuerG = unique(passendeVarianten.map((v) => v.perforation));
    setCfg((c) => ({ ...c, grammatur: g, perforation: null }));
    setCurrentStep(perforationsOptionenFuerG.length > 1 ? "Perforation" : "Übersicht");
  }
  function selectPerforation(p: string) {
    setCfg((c) => ({ ...c, perforation: p }));
    setCurrentStep("Übersicht");
  }

  function isStepValid(step: StepName): boolean {
    if (step === "Auflage") {
      return cfg.auflage !== null && cfg.auflage >= mindestmenge && cfg.auflage <= maximalmenge;
    }
    if (step === "Umfang") return cfg.umfang !== null;
    if (step === "Grammatur") return grammatur !== null;
    if (step === "Perforation") return perforation !== null;
    return true;
  }

  function next() {
    const idx = steps.indexOf(currentStep as never);
    setCurrentStep(steps[Math.min(idx + 1, steps.length - 1)] as StepName);
  }

  const [bestellOpen, setBestellOpen] = useState(false);

  const uebersichtZeilen: [string, string][] = [
    ["Auflage", cfg.auflage ? `${cfg.auflage.toLocaleString("de-DE")} Stück` : "–"],
    ["Endformat", ausgewaehlteVariante?.endformat ?? "–"],
    ["Offenes Format", ausgewaehlteVariante?.offenesFormat ?? "–"],
    ["Umfang", cfg.umfang ?? "–"],
    ["Farbigkeit", ausgewaehlteVariante?.farbigkeit ?? "–"],
    ["Grammatur", ausgewaehlteVariante?.inhalt?.grammatur ?? "–"],
    ["Papier", ausgewaehlteVariante?.inhalt?.papier ?? "–"],
    ["Oberfläche", ausgewaehlteVariante?.inhalt?.oberflaeche ?? "–"],
    ...(ausgewaehlteVariante?.umschlag
      ? ([
          ["Grammatur (Umschlag)", ausgewaehlteVariante.umschlag.grammatur ?? "–"],
          ["Papier (Umschlag)", ausgewaehlteVariante.umschlag.papier ?? "–"],
          ["Oberfläche (Umschlag)", ausgewaehlteVariante.umschlag.oberflaeche ?? "–"],
        ] as [string, string][])
      : []),
    ...(brauchtPerforationsAuswahl ? ([["Perforation", perforation ?? "–"]] as [string, string][]) : []),
    ["Verarbeitung", ausgewaehlteVariante?.verarbeitung ?? "–"],
  ];

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <nav className="text-xs text-[#888888] mb-6">
          <a href="/" className="hover:text-[#822660]">Startseite</a>{" / "}
          <a href="/#selfmailer" className="hover:text-[#822660]">Selfmailer</a>{" / "}
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
                {steps.map((step, i) => {
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
                      onClick={() => reachable && goTo(step as StepName)}
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

            {Boolean(cfg.auflage) && (
              <div className="mt-4 bg-white border border-[#dcdcdc] p-4 text-xs text-[#666666] space-y-1">
                <p className="font-semibold text-[#2b2b2b] text-xs uppercase tracking-wide mb-2">Ihre Auswahl</p>
                {cfg.auflage && <p><span className="text-[#2b2b2b]">Auflage:</span> {cfg.auflage.toLocaleString("de-DE")} Stück</p>}
                {cfg.umfang && <p><span className="text-[#2b2b2b]">Umfang:</span> {cfg.umfang}</p>}
                {ausgewaehlteVariante?.endformat && <p><span className="text-[#2b2b2b]">Endformat:</span> {ausgewaehlteVariante.endformat}</p>}
                {grammatur && <p><span className="text-[#2b2b2b]">Grammatur:</span> {grammatur}</p>}
                {brauchtPerforationsAuswahl && perforation && <p><span className="text-[#2b2b2b]">Perforation:</span> {perforation}</p>}
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
                    auflagen={auflagen}
                    mindestmenge={mindestmenge}
                    maximalmenge={maximalmenge}
                    value={cfg.auflage}
                    onTileSelect={selectAuflage}
                    onCustomChange={(a) => setCfg((c) => ({ ...c, auflage: a }))}
                  />
                </>
              )}

              {currentStep === "Umfang" && (
                <>
                  <StepHeader step={2} title="Umfang wählen" helpTab="umfang" />
                  <div className="flex flex-wrap gap-3">
                    {umfaenge.map((u) => {
                      const beispiel = varianten.find((v) => v.umfang === u);
                      return (
                        <OptionTile
                          key={u}
                          active={cfg.umfang === u}
                          onClick={() => selectUmfang(u)}
                          title={u}
                          subtitle={beispiel?.endformat ?? undefined}
                        />
                      );
                    })}
                  </div>
                </>
              )}

              {currentStep === "Grammatur" && (
                <>
                  <StepHeader step={3} title="Grammatur wählen" helpTab="grammatur" />
                  <div className="flex flex-wrap gap-3">
                    {grammaturen.map((g) => {
                      const beispiel = nachUmfang.find((v) => v.inhalt?.grammatur === g);
                      return (
                        <OptionTile
                          key={g}
                          active={grammatur === g}
                          onClick={() => selectGrammatur(g)}
                          title={g}
                          subtitle={beispiel?.inhalt?.papier ?? undefined}
                        />
                      );
                    })}
                  </div>
                </>
              )}

              {currentStep === "Perforation" && (
                <>
                  <StepHeader step={4} title="Perforation wählen" helpTab="perforation" />
                  <div className="flex flex-wrap gap-3">
                    {perforationen.map((p) => (
                      <OptionTile key={p} active={perforation === p} onClick={() => selectPerforation(p)} title={p} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Übersicht" && (
                <>
                  <StepHeader step={steps.length} title="Übersicht & Anfrage" helpTab="uebersicht" />
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
                  onClick={() => { const prev = steps[stepIndex - 1]; if (prev) goTo(prev as StepName); }}
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
