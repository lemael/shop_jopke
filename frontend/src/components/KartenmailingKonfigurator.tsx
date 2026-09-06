"use client";

import { useMemo, useState, useEffect } from "react";
import { OptionTile, StepHeader } from "@/components/ConfiguratorUI";
import { AuflageAuswahl } from "@/components/AuflageAuswahl";
import { BestellModal } from "@/components/BestellModal";
import { auflagenFuer } from "@/lib/auflage";
import type { Produkt } from "@/data/produktkatalog";
import { calcSelfmailerPrice, type KartenmailingFamilie } from "@/lib/kartenmailingPreis";
import { useKartenmailingConfiguratorStore } from "@/stores/useKartenmailingConfiguratorStore";
import { DETAIL_STAFFEL_PUNKTE } from "@/data/constants";
import { FAMILIEN_KENNUNGEN } from "@/types/kartenmailer/kartenmailer";

function unique<T>(values: (T | null | undefined)[]): T[] {
  const result: T[] = [];
  for (const v of values) {
    if (v !== null && v !== undefined && !result.includes(v)) result.push(v);
  }
  return result;
}
function formatEuro(value: number) {
  return `${value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function formatGramG(value: number) {
 return `${value} g`;
} 
function formatGramKg(value: number) {
 
    return `${value} kg`;
}



export function KartenmailingKonfigurator({ familie }: Readonly<{ familie: KartenmailingFamilie }>) {

  const store = useKartenmailingConfiguratorStore();
  const { varianten, name, beschreibung } = familie;

  
  const stepIndex = store.stepIndex();
  const STEPS = store.STEPS();
  const ausstattungen = store.ausstattungConfigs;
  
  const { cfg, currentStep, selectPapier, selectVeredelung, selectAuflage, goTo, isStepValid, next, loadOptions, loading } = store;

  // API-Daten beim Komponenten-Mount laden
  useEffect(() => {
    loadOptions();
  }, [loadOptions]);
 

  console.log("Ausstattungen", ausstattungen);
  


  const suchbegriff = FAMILIEN_KENNUNGEN[familie.slug];
  console.log("FAMILIEN_KENNUNGEN", FAMILIEN_KENNUNGEN);
  const ausstattung = ausstattungen.filter(a =>
    a.name?.toLowerCase().includes(suchbegriff.toLowerCase())
  );
  console.log("suchbegriff", suchbegriff);
  console.log("ausstattung", ausstattung);
  const veredelungen = Array.from(new Set(ausstattung.map((v) => v.veredelung))).filter((v): v is string => v !== undefined);
  
  const papiere = [...new Set(
    ausstattung
      .map((v) => v.papier)
      .filter((v): v is string => v !== undefined)
  )];
  console.log("papiere", papiere);
  const auflagen: number[] = DETAIL_STAFFEL_PUNKTE;
  const ausgewaehlteVariante = ausstattung.find((v) => v.papier === cfg.papier && v.veredelung === cfg.veredelung);

  const preisdetails = ausgewaehlteVariante ? calcSelfmailerPrice(ausgewaehlteVariante, cfg) : null;
  // Removed local selectPapier, selectVeredelung, selectAuflage functions
  // Using store's selectPapier, selectVeredelung, selectAuflage functions instead



  // Removed local next function
  // Using store's next function instead

  const [bestellOpen, setBestellOpen] = useState(false);

  const uebersichtZeilen: [string, string][] = [
    ["Auflage", cfg.auflage ? `${cfg.auflage.toLocaleString("de-DE")} Stück` : "–"],
    ["Endformat", ausgewaehlteVariante?.endformat ?? "–"],
    ["Papier", cfg.papier ?? "–"],
    ["Farbigkeit", ausgewaehlteVariante?.farbigkeit ?? "–"],
    ["Veredelung", cfg.veredelung ?? "–"],
    ["Versandklasse", ausgewaehlteVariante?.mindest_versandklasse ?? "–"],
  ];

  if (loading && ausstattungen.length === 0) {
    return (
      <div
        className="min-h-[300px] flex flex-col items-center justify-center gap-5 text-gray-500"
        suppressHydrationWarning
      >
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <p>wartet bitte...</p>
      </div>
    );
  } else{

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <nav className="text-xs text-[#888888] mb-6">
          <a href="/" className="hover:text-[#822660]">Startseite</a>{" / "}
          <a href="/#kartenmailing" className="hover:text-[#822660]">Kartenmailing</a>{" / "}
          <span className="text-[#2b2b2b]">{name}</span>
        </nav>

       

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

            {Boolean(cfg.papier) && (
              <div className="mt-4 bg-white border border-[#dcdcdc] p-4 text-xs text-[#666666] space-y-1">
                <p className="font-semibold text-[#2b2b2b] text-xs uppercase tracking-wide mb-2">Ihre Auswahl</p>
                {cfg.auflage && <p><span className="text-[#2b2b2b]">Auflage:</span> {cfg.auflage.toLocaleString("de-DE")} Stück</p>}
                {cfg.papier && <p><span className="text-[#2b2b2b]">Papier:</span> {cfg.papier}</p>}
                {cfg.veredelung && <p><span className="text-[#2b2b2b]">Veredelung:</span> {cfg.veredelung}</p>}
                
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
                    mindestmenge={ausgewaehlteVariante?.mindestmenge}
                    maximalmenge={ausgewaehlteVariante?.maximalmenge}
                    value={cfg.auflage}
                    onTileSelect={selectAuflage}
                    onCustomChange={(a) => selectAuflage(a)}
                  />
                </>
              )}
              {currentStep === "Papier" && (
                <>
                  <StepHeader step={2} title="Papier wählen" helpTab="papier" />
                  <div className="flex flex-wrap gap-3">
                    {papiere.map((p) => (
                      <OptionTile key={p} active={cfg.papier === p} onClick={() => selectPapier(p)} title={p} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Veredelung" && (
                <>
                  <StepHeader step={3} title="Veredelung wählen" helpTab="veredelung" />
                  <div className="flex flex-wrap gap-3">
                    {veredelungen.map((v) => (
                      <OptionTile key={v} active={cfg.veredelung === v} onClick={() => selectVeredelung(v)} title={v} />
                    ))}
                  </div>
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
                  {preisdetails ? (
                      <div className="border border-[#dcdcdc]">
                        <div className="bg-[#f4f4f4] px-4 py-2 text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide border-b border-[#dcdcdc]">
                          Inklusive Druck, Portooptimierung, Personalisierung, Verarbeitung und Postauflieferung
                        </div>
                        <dl className="text-sm">
                          <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                            <dt className="text-[#666666]">Druck (netto)</dt>
                            <dd className="font-semibold text-[#2b2b2b]">{formatEuro(preisdetails.druck)}</dd>
                          </div>
                          <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                            <dt className="text-[#666666]">Porto (max., netto)</dt>
                            <dd className="font-semibold text-[#2b2b2b]">{formatEuro(preisdetails.porto)}</dd>
                          </div>
                          <div className="flex justify-between px-4 py-3 border-t border-[#dcdcdc] bg-[#f9f9f9]">
                            <dt className="font-bold text-[#2b2b2b]">Gesamt (netto):</dt>
                            <dd className="font-bold text-[#822660] text-lg">{formatEuro(preisdetails.gesamtNettoStandard)}</dd>
                          </div>
                          <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                            <dt className="text-xs text-[#666666]">zzgl. 19% MwSt.:</dt>
                            <dd className="text-xs text-[#666666]">{formatEuro(preisdetails.mwstStandard)}</dd>
                          </div>
                          <div className="flex justify-between px-4 py-2">
                            <dt className="font-semibold text-[#2b2b2b]">Gesamt (brutto):</dt>
                            <dd className="font-semibold text-[#2b2b2b]">{formatEuro(preisdetails.gesamtBruttoStandard)}</dd>
                          </div>
                          <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                            <dt className="text-[#666666]">Gewicht pro Sendung:</dt>
                            <dd className="font-semibold text-[#666666]">{formatGramG(preisdetails.gewichtProSendungG)}</dd>
                          </div>
                             <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                            <dt className="text-[#666666]">Gesamtgewicht:</dt>
                            <dd className="font-semibold text-[#666666]">{formatGramKg(preisdetails.gesamtGewichtKg)}</dd>
                          </div>
                        </dl>
                        <p className="px-4 py-3 text-xs text-[#888888] border-t border-[#f0f0f0] leading-relaxed">
                          Der oben angegebene Betrag bildet die maximalen Portokosten ohne Portooptimierung ab. Sie erhalten innerhalb von 48 Stunden nach Auftragsvergabe eine konkrete Portoabrechnung basierend auf den von Ihnen gelieferten Daten.
                        </p>
                      </div>
                    ) : null}
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
}
