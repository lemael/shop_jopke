"use client";

import Link from "next/link";
import { ALL_STEPS, StepName } from "@/types/selfmailer/selfmailer";
import { OptionTile, StepHeader } from "@/components/ConfiguratorUI";
import { AuflageAuswahl } from "@/components/AuflageAuswahl";
import { BestellModal } from "@/components/BestellModal";
import type { SelfmailerFamilie } from "@/lib/selfmailerPreis";
import { useSelfmailerConfiguratorStore as useConfiguratorStore } from "@/stores/useSeflmailerConfiguratorStore";
import { useEffect} from "react";
import { calcSelfmailerPrice } from "@/lib/selfmailerPreis";
import { DETAIL_STAFFEL_PUNKTE } from "@/data/constants";


function formatEuro(value: number) {
  return `${value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function formatGramG(value: number) {
 return `${value} g`;
} 
function formatGramKg(value: number) {
 
    return `${value} kg`;
  }


export function SelfmailerKonfigurator({ familie }: Readonly<{ familie: SelfmailerFamilie }>) {

    const store = useConfiguratorStore();
    const stepIndex = store.stepIndex();
    const STEP = store.STEPS();
    const ausstattungen = store.ausstattungConfigs;
    const { 
      loading, 
      error, 
      loadOptions, 
      cfg, 
      currentStep, 
      goTo, 
      next, 
      isStepValid, 
      selectUmfang, 
      selectGrammatur, 
      selectPerforation, 
      selectAuflage,
      bestellOpen, 
      setBestellOpen,
    } = store;
  
    // API-Daten beim Komponenten-Mount laden
    useEffect(() => {
      loadOptions();
    }, [loadOptions]);
    
      if (loading && ausstattungen.length === 0) return (
      <div
        className="min-h-[300px] flex flex-col items-center justify-center gap-5 text-gray-500"
        suppressHydrationWarning
      >
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />

        <p>wartet bitte...</p>
      </div>
    );

    const { varianten, name, beschreibung } = familie;

    const auflagen: number[] = DETAIL_STAFFEL_PUNKTE;


  

  


 
  const suchbegriff = familie.kategorie_2?.trim() || familie.slug;

  const ausstattung = ausstattungen.filter(a =>
    a.name?.toLowerCase().includes(suchbegriff.toLowerCase())
  );
  const umfangen = Array.from(
    new Set(ausstattung.flatMap(a => a.umfang))
  );

  const grammaturen = Array.from(
    new Set(ausstattung.flatMap(a => a.grammatur))
  );

  const perforationen = Array.from(
    new Set(ausstattung.flatMap(a => a.perforation))
  );

  
  const ausgewaehlteVariante = ausstattung.find(a => a.umfang === cfg.umfang && a.grammatur === cfg.grammatur);
  const preisdetails = ausgewaehlteVariante ? calcSelfmailerPrice(ausgewaehlteVariante, cfg) : null;
  const uebersichtZeilen: [string, string][] = [
    ["Auflage", cfg.auflage ? `${cfg.auflage.toLocaleString("de-DE")} Stück` : "–"],
    ["Endformat", ausgewaehlteVariante?.endformat ?? "–"],
    ["Offenes Format", ausgewaehlteVariante?.offenes_format ?? "–"],
    ["Umfang", cfg.umfang ?? "–"],
    ["Farbigkeit", ausgewaehlteVariante?.farbigkeit ?? "–"],
    ["Grammatur", ausgewaehlteVariante?.grammatur ?? "–"],
    ["Papier", ausgewaehlteVariante?.papier ?? "–"],
    ["Oberfläche", ausgewaehlteVariante?.oberflaeche ?? "–"],
    ["Grammatur (Umschlag)", ausgewaehlteVariante?.grammatur_2 ?? "–"],
    ["Papier (Umschlag)", ausgewaehlteVariante?.papier_2 ?? "–"],
    ["Oberfläche (Umschlag)", ausgewaehlteVariante?.oberflaeche_2 ?? "–"],
       
    ...(ausgewaehlteVariante?.perforation ? ([["Perforation", ausgewaehlteVariante?.perforation ?? "–"]] as [string, string][]) : []),
    ["Verarbeitung", ausgewaehlteVariante?.verarbeitung ?? "–"],
  ];

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <nav className="text-xs text-[#888888] mb-6">
          <Link href="/" className="hover:text-[#822660]">Startseite</Link>{" / "}
          <Link href="/#selfmailer" className="hover:text-[#822660]">Selfmailer</Link>{" / "}
          <span className="text-[#2b2b2b]">{name}</span>
        </nav>

        <h1 className="text-2xl font-bold text-[#2b2b2b] mb-2">{name} – Konfigurator</h1>
       
       <br />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-[#dcdcdc]">
              <div className="bg-[#2b2b2b] text-white text-xs font-semibold uppercase tracking-wide px-4 py-3">
                Konfiguration
              </div>
              <nav className="divide-y divide-[#f0f0f0]">
                {STEP.map((step, i) => {
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
                {cfg.grammatur && <p><span className="text-[#2b2b2b]">Grammatur:</span> {cfg.grammatur}</p>}
                {cfg.perforation && <p><span className="text-[#2b2b2b]">Perforation:</span> {cfg.perforation}</p>}
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
                    mindestmenge={ausstattung[0]?.mindestmenge}
                    maximalmenge={ausstattung[0]?.maximalmenge}
                    value={cfg.auflage}
                    onTileSelect={selectAuflage}
                    onCustomChange={selectAuflage}
                  />
                </>
              )}

              {currentStep === "Umfang" && (
                <>
                  <StepHeader step={2} title="Umfang wählen" helpTab="umfang" />
                  <div className="flex flex-wrap gap-3">
                    {umfangen.map((u) => {
                      const beispiel = ausstattung.find((v) => v.umfang === u);
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
                      const beispiel = ausstattung.find((v) => v.grammatur === g);
                      return (
                        <OptionTile
                          key={g}
                          active={cfg.grammatur === g}
                          onClick={() => selectGrammatur(g)}
                          title={g}
                          subtitle={beispiel?.papier ?? undefined}
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
                      <OptionTile key={p} active={cfg.perforation.includes(p)} onClick={() => selectPerforation(p)} title={p} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Übersicht" && (
                <>
                  <StepHeader step={STEP.length} title="Übersicht & Anfrage" helpTab="uebersicht" />
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] mb-6">
                    <div>
                      <table className="w-full text-sm">
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
                        <p className="text-xs text-[#888888] mt-6">Datenblatt: {ausgewaehlteVariante.pdf}</p>
                      )}
                    </div>

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
                  onClick={() => { const prev = STEP[stepIndex - 1]; if (prev) goTo(prev as StepName); }}
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
