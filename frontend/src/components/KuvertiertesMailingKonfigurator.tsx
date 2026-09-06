"use client";

import { Fragment, useMemo, useEffect } from "react";
import type { StepName } from "@/types/kuvertiertesMailing/kuvertiertesMailing";
import { OptionTile, StepHeader } from "@/components/ConfiguratorUI";
import { AuflageAuswahl } from "@/components/AuflageAuswahl";
import { BestellModal } from "@/components/BestellModal";
import { formatEuro } from "@/lib/kuvertiertesmailingPreis";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import type { MailingFamilie } from "@/lib/mailing";
import Link from "next/link";

export function KuvertiertesMailingKonfiguratorUI() {
  const store = useConfiguratorStore();
  const { loading, error, loadOptions } = store;

  // API-Daten beim Komponenten-Mount laden
  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

 
  // 1. Getter/Funktionen aus dem Store ausführen
  const STEPS = store.STEPS();
  const stepIndex = store.stepIndex();
  const auflagen = store.auflagen();
  const preis = store.preis();
  const ausstattungen = store.ausstattungen();
  const versandklasse = store.versandklasse();
  const huelleFarbigkeiten = store.huelleFarbigkeiten();
  const ausgewaehlterArtikel = store.ausgewaehlterArtikel();
  const mailingPackage = store.getMailingPackage();

  // 2. Zustände und Aktionen aus dem Store destructurieren
  const {
    name,
    beschreibung,
    familieSlug,
    cfg,
    currentStep,
    huellentypen,
    anschreibenGrammaturen,
    anschreibenFarbigkeiten,
    flyerUmfaenge,
    flyerGrammaturenMapped,
    flyerOberflaechen,
    broschuereUmfaenge,
    broschuereOberflaechen,
    antwortkarteEndformate,
    antwortkarteGrammaturen,
    antwortkarteOberflaechen,
    bestellOpen,
    selectHuellentyp,
    selectAusstattung,
    selectAuflage,
    selectHuelleFarbigkeit,
    selectAnschreibenGrammatur,
    selectAnschreibenFarbigkeit,
    selectAnzahlFlyer,
    selectFlyerUmfang,
    selectFlyerGrammatur,
    selectFlyerOberflaeche,
    selectBroschuereUmfang,
    selectBroschuereOberflaeche,
    selectAntwortkarteEndformat,
    selectAntwortkarteGrammatur,
    selectAntwortkarteOberflaeche,
    setVerarbeitungszeit,
    setCustomAuflage,
    goTo,
    next,
    isStepValid,
    setBestellOpen,
  } = store;

  const stepNumber = (step: StepName) => STEPS.indexOf(step) + 1;
   console.log("antwortkarteGrammaturen:", antwortkarteGrammaturen);
   console.log("antwortkarteEndformate:", antwortkarteEndformate);
  // Allgemeine Zeilen
  const allgemeinZeilen: [string, string][] = [
    ["Auflage", cfg.auflage ? `${cfg.auflage.toLocaleString("de-DE")} Stück` : "–"],
    ["Hüllentyp", cfg.huellentyp ?? "–"],
    ["Ausstattung", cfg.ausstattung ?? "–"],
    ["Versandklasse", versandklasse ?? "–"],
      
 
  ];
   console.log("versandklasse:", versandklasse);
  // 100% dynamische Konstruktion der Zusammenfassung über getMailingPackage()
  const uebersichtGruppen = useMemo(() => {
    if (!mailingPackage) return [];

    const groups: { titel: string; zeilen: [string, string][] }[] = [];

    // Hülle (Umschlag)
    groups.push({
      titel: mailingPackage.huelle.kategorie ?? cfg.huellentyp ?? "Hülle",
      zeilen: [
        ["Endformat", mailingPackage.huelle.endformat ?? "–"],
        ["Farbigkeit", cfg.huelleFarbigkeit ?? mailingPackage.huelle.farbigkeit ?? "–"],
        ["Grammatur", mailingPackage.huelle.grammatur ?? "–"],
        ["Papier", mailingPackage.huelle.papier ?? "–"],
      ],
    });

    // Anschreiben (Brief)
    if (mailingPackage.anschreiben || cfg.anschreibenGrammatur) {
      groups.push({
        titel: "Anschreiben DIN A4",
        zeilen: [
          ["Endformat", mailingPackage.anschreiben?.endformat ?? "210 x 297 mm"],
          ["Umfang", mailingPackage.anschreiben?.umfang ?? "2 Seiten"],
          ["Farbigkeit", cfg.anschreibenFarbigkeit ?? mailingPackage.anschreiben?.farbigkeit ?? "–"],
          ["Grammatur", cfg.anschreibenGrammatur ?? mailingPackage.anschreiben?.grammatur ?? "–"],
          ["Papier", mailingPackage.anschreiben?.papier ?? "Offset"],
        ],
      });
    }

    // Flyers
    if (cfg.flyerConfigs && cfg.flyerConfigs.length > 0) {
      cfg.flyerConfigs.forEach((flyerCfg, i) => {
        const pkgFlyer = mailingPackage.flyers[i];
        groups.push({
          titel: `Flyer ${i + 1}`,
          zeilen: [
            ["Endformat", pkgFlyer?.endformat ?? "DIN lang"],
            ["Umfang", flyerCfg.umfang ?? "–"],
            ["Farbigkeit", pkgFlyer?.farbigkeit ?? "4/4-farbig Euroskala"],
            ["Grammatur", flyerCfg.grammatur ?? "–"],
            ["Papier", pkgFlyer?.papier ?? "Bilderdruck"],
            ["Oberfläche", flyerCfg.oberflaeche ?? "–"],
          ],
        });
      });
    }

    // Broschüre
    if (mailingPackage.broschuere || cfg.broschuereUmfang) {
      groups.push({
        titel: "Broschüre",
        zeilen: [
          ["Endformat", mailingPackage.broschuere?.endformat ?? "105 x 210 mm"],
          ["Umfang", cfg.broschuereUmfang ?? "–"],
          ["Farbigkeit", mailingPackage.broschuere?.farbigkeit ?? "4/4-farbig Euroskala"],
          ["Grammatur", mailingPackage.broschuere?.grammatur ?? "Inhalt 90 g/m², Umschlag 170 g/m²"],
          ["Papier", mailingPackage.broschuere?.papier ?? "Bilderdruck"],
          ["Oberfläche", cfg.broschuereOberflaeche ?? "–"],
        ],
      });
    }

    // Antwortkarte
    if (mailingPackage.antwortkarte || cfg.antwortkarteEndformat) {
      groups.push({
        titel: "Antwortkarte",
        zeilen: [
          ["Endformat", cfg.antwortkarteEndformat ?? "–"],
          ["Umfang", mailingPackage.antwortkarte?.umfang ?? "2 Seiten"],
          ["Farbigkeit", mailingPackage.antwortkarte?.farbigkeit ?? "4/4-farbig Euroskala"],
          ["Grammatur", cfg.antwortkarteGrammatur ?? "–"],
          ["Papier", mailingPackage.antwortkarte?.papier ?? "Bilderdruck"],
          ["Oberfläche", cfg.antwortkarteOberflaeche ?? "–"],
        ],
      });
    }

    return groups;
  }, [mailingPackage, cfg]);

  const uebersichtZeilen: [string, string][] = [
    ...allgemeinZeilen,
    ...uebersichtGruppen.flatMap((g) =>
      g.zeilen.map(([label, value]) => [`${g.titel} – ${label}`, value] as [string, string])
    ),
  ];

  if (loading) return (
  <div
    className="min-h-[300px] flex flex-col items-center justify-center gap-5 text-gray-500"
    suppressHydrationWarning
  >
    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />

    <p>wartet bitte...</p>
  </div>
);
  console.log("flyerGrammaturenMapped", flyerGrammaturenMapped);
  if (error) return <div className="p-8 text-center text-red-500" suppressHydrationWarning>Fehler beim Verbinden mit dem Backend: {error}</div>;

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-xs text-[#888888] mb-6">
          <Link href="/" className="hover:text-[#822660]">Startseite</Link>{" / "}
          <Link href="/#kuvertiertes-mailing" className="hover:text-[#822660]">Kuvertiertes Mailing</Link>{" / "}
          <span className="text-[#2b2b2b]">{name}</span>
        </nav>

        <h1 className="text-2xl font-bold text-[#2b2b2b] mb-2">{name} – Konfigurator</h1>
        {beschreibung && <p className="text-sm text-[#666666] mb-8 whitespace-pre-line max-w-2xl">{beschreibung}</p>}

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
                  return (
                    <button
                      key={step}
                      type="button"
                      disabled={!reachable}
                      onClick={() => reachable && goTo(step)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                        active
                          ? "bg-[#822660] text-white font-semibold"
                          : reachable
                          ? "text-[#2b2b2b] hover:bg-[#f4f4f4] cursor-pointer"
                          : "text-[#aaaaaa] cursor-default"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 border ${
                          active
                            ? "border-white text-white"
                            : done
                            ? "border-[#822660] text-[#822660]"
                            : "border-[#cccccc] text-[#cccccc]"
                        }`}
                      >
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
                {cfg.ausstattung && <p><span className="text-[#2b2b2b]">Ausstattung:</span> {cfg.ausstattung}</p>}
                {cfg.auflage && <p><span className="text-[#2b2b2b]">Auflage:</span> {cfg.auflage.toLocaleString("de-DE")} Stück</p>}
                {cfg.huelleFarbigkeit && <p><span className="text-[#2b2b2b]">Farbigkeit Hülle:</span> {cfg.huelleFarbigkeit}</p>}
                {cfg.anschreibenGrammatur && <p><span className="text-[#2b2b2b]">Grammatur Anschreiben:</span> {cfg.anschreibenGrammatur}</p>}
                {cfg.anschreibenFarbigkeit && <p><span className="text-[#2b2b2b]">Farbigkeit Anschreiben:</span> {cfg.anschreibenFarbigkeit}</p>}
                {cfg.broschuereUmfang && <p><span className="text-[#2b2b2b]">Umfang Broschüre:</span> {cfg.broschuereUmfang}</p>}
                {cfg.broschuereOberflaeche && <p><span className="text-[#2b2b2b]">Oberfläche Broschüre:</span> {cfg.broschuereOberflaeche}</p>}
                {cfg.antwortkarteEndformat && <p><span className="text-[#2b2b2b]">Endformat Antwortkarte:</span> {cfg.antwortkarteEndformat}</p>}
                {cfg.antwortkarteGrammatur && <p><span className="text-[#2b2b2b]">Grammatur Antwortkarte:</span> {cfg.antwortkarteGrammatur}</p>}
                {cfg.antwortkarteOberflaeche && <p><span className="text-[#2b2b2b]">Oberfläche Antwortkarte:</span> {cfg.antwortkarteOberflaeche}</p>}
                {cfg.anzahlFlyer && <p><span className="text-[#2b2b2b]">Anzahl Flyer:</span> {cfg.anzahlFlyer}</p>}
                {cfg.flyerConfigs.map((f, i) => (
                  f.umfang && <p key={i}><span className="text-[#2b2b2b]">Flyer {i + 1}:</span> {f.umfang}, {f.grammatur}, {f.oberflaeche}</p>
                ))}
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white border border-[#dcdcdc] p-6 sm:p-8">

              {currentStep === "Hüllentyp" && (
                <>
                  <StepHeader step={stepNumber("Hüllentyp")} title="Hüllentyp wählen" helpTab="huellentyp" />
                  <div className="flex flex-wrap gap-3">
                    {huellentypen.map((h) => {
                      const title = typeof h === "string" ? h : (h as any).name || (h as any).kategorie || String(h);
                      return (
                        <OptionTile
                          key={title}
                          active={cfg.huellentyp === title}
                          onClick={() => selectHuellentyp(title as any)}
                          title={title}
                        />
                      );
                    })}
                  </div>
                </>
              )}

               {currentStep === "Farbigkeit Hülle" && (
                <>
                  <StepHeader step={stepNumber("Farbigkeit Hülle")} title={`Farbigkeit ${cfg.huellentyp ?? "Hülle"} wählen`} helpTab="farbigkeit" />
                    <div className="flex flex-wrap gap-3">
                        {huelleFarbigkeiten.map((f: string) => (
                          <OptionTile
                            key={f}
                            active={cfg.huelleFarbigkeit === f}
                            onClick={() => selectHuelleFarbigkeit(f)}
                            title={f}
                          />
                        ))}
                    </div>
                </>
              )}
              {currentStep === "Ausstattung" && (
                <>
                  <StepHeader step={stepNumber("Ausstattung")} title="Ausstattung wählen" helpTab="ausstattung" />
                  <div className="flex flex-wrap gap-3">
                    {ausstattungen.length > 0 ? (
                      ausstattungen.map((a) => (
                        <OptionTile key={a} active={cfg.ausstattung === a} onClick={() => selectAusstattung(a)} title={a} />
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 py-4">
                        Keine Ausstattung für diesen Hüllentyp verfügbar.
                      </p>
                    )}
                  </div>
                </>
              )}

              {currentStep === "Auflage" && (
                <>
                  <StepHeader step={stepNumber("Auflage")} title="Auflage wählen" helpTab="auflage" />
                  <AuflageAuswahl
                    auflagen={auflagen}
                    mindestmenge={ausgewaehlterArtikel?.mindestmenge ?? undefined}
                    maximalmenge={ausgewaehlterArtikel?.maximalmenge ?? undefined}
                    value={cfg.auflage}
                    onTileSelect={selectAuflage}
                    onCustomChange={setCustomAuflage}
                  />
                </>
              )}

             

              {currentStep === "Grammatur Anschreiben" && (
                <>
                  <StepHeader step={stepNumber("Grammatur Anschreiben")} title="Grammatur Anschreiben wählen" helpTab="grammatur" />
                  <div className="flex flex-wrap gap-3">
                    {anschreibenGrammaturen.map((g) => (
                      <OptionTile key={g} active={cfg.anschreibenGrammatur === g} onClick={() => selectAnschreibenGrammatur(g)} title={g} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Farbigkeit Anschreiben" && (
                <>
                  <StepHeader step={stepNumber("Farbigkeit Anschreiben")} title="Farbigkeit Anschreiben wählen" helpTab="farbigkeit" />
                  <div className="flex flex-wrap gap-3">
                    {anschreibenFarbigkeiten.map((f) => (
                      <OptionTile key={f} active={cfg.anschreibenFarbigkeit === f} onClick={() => selectAnschreibenFarbigkeit(f)} title={f} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Anzahl Flyer" && (
                <>
                  <StepHeader step={stepNumber("Anzahl Flyer")} title="Anzahl Flyer wählen" />
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3].map((n) => (
                      <OptionTile key={n} active={cfg.anzahlFlyer === n} onClick={() => selectAnzahlFlyer(n)} title={`${n} Flyer`} />
                    ))}
                  </div>
                </>
              )}

              {/* Dynamische Flyer */}
              {Array.from({ length: cfg.anzahlFlyer ?? 0 }).map((_, i) => (
                <Fragment key={i}>
                  {currentStep === `Flyer ${i + 1} - Umfang` && (
                    <>
                      <StepHeader step={stepNumber(currentStep)} title={`Umfang Flyer ${i + 1} wählen`} helpTab="umfang" />
                      <div className="flex flex-wrap gap-3">
                        {flyerUmfaenge.map((u) => (
                          <OptionTile key={u} active={cfg.flyerConfigs[i]?.umfang === u} onClick={() => selectFlyerUmfang(i, u)} title={u} />
                        ))}
                      </div>
                    </>
                  )}
                  {currentStep === `Flyer ${i + 1} - Grammatur` && (
                    <>
                      <StepHeader step={stepNumber(currentStep)} title={`Grammatur Flyer ${i + 1} wählen`} helpTab="grammatur" />
                      <div className="flex flex-wrap gap-3">
                        {(flyerGrammaturenMapped[cfg.flyerConfigs[i]?.umfang ?? ""] ?? ["90 g/m²", "115 g/m²", "135 g/m²", "170 g/m²", "250 g/m²"]).map((g) => (
                          <OptionTile key={g} active={cfg.flyerConfigs[i]?.grammatur === g} onClick={() => selectFlyerGrammatur(i, g)} title={g} />
                        ))}
                      </div>
                    </>
                  )}
                  {currentStep === `Flyer ${i + 1} - Oberfläche` && (
                    <>
                      <StepHeader step={stepNumber(currentStep)} title={`Oberfläche Flyer ${i + 1} wählen`} helpTab="oberflaeche" />
                      <div className="flex flex-wrap gap-3">
                        {flyerOberflaechen.map((o) => (
                          <OptionTile key={o} active={cfg.flyerConfigs[i]?.oberflaeche === o} onClick={() => selectFlyerOberflaeche(i, o)} title={o} />
                        ))}
                      </div>
                    </>
                  )}
                </Fragment>
              ))}

              {currentStep === "Umfang Broschüre" && (
                <>
                  <StepHeader step={stepNumber("Umfang Broschüre")} title="Umfang Broschüre wählen" helpTab="umfang" />
                  <div className="flex flex-wrap gap-3">
                    {broschuereUmfaenge.map((u) => (
                      <OptionTile key={u} active={cfg.broschuereUmfang === u} onClick={() => selectBroschuereUmfang(u)} title={u} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Oberfläche Broschüre" && (
                <>
                  <StepHeader step={stepNumber("Oberfläche Broschüre")} title="Oberfläche Broschüre wählen" helpTab="oberflaeche" />
                  <div className="flex flex-wrap gap-3">
                    {broschuereOberflaechen.map((o) => (
                      <OptionTile key={o} active={cfg.broschuereOberflaeche === o} onClick={() => selectBroschuereOberflaeche(o)} title={o} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Endformat Antwortkarte" && (
                <>
                  <StepHeader step={stepNumber("Endformat Antwortkarte")} title="Endformat Antwortkarte wählen" helpTab="endformat" />
                  <div className="flex flex-wrap gap-3">
                    {antwortkarteEndformate.map((e) => (
                      <OptionTile key={e} active={cfg.antwortkarteEndformat === e} onClick={() => selectAntwortkarteEndformat(e)} title={e} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Grammatur Antwortkarte" && (
                <>
                  <StepHeader step={stepNumber("Grammatur Antwortkarte")} title="Grammatur Antwortkarte wählen" helpTab="grammatur" />
                  <div className="flex flex-wrap gap-3">
                    {antwortkarteGrammaturen.map((g) => (
                      <OptionTile key={g} active={cfg.antwortkarteGrammatur === g} onClick={() => selectAntwortkarteGrammatur(g)} title={g} />
                    ))}
                  </div>
                </>
              )}

              {currentStep === "Oberfläche Antwortkarte" && (
                <>
                  <StepHeader step={stepNumber("Oberfläche Antwortkarte")} title="Oberfläche Antwortkarte wählen" helpTab="oberflaeche" />
                  <div className="flex flex-wrap gap-3">
                    {antwortkarteOberflaechen.map((o) => (
                      <OptionTile key={o} active={cfg.antwortkarteOberflaeche === o} onClick={() => selectAntwortkarteOberflaeche(o)} title={o} />
                    ))}
                  </div>
                </>
              )}

              {/* Zusammenfassungsschritt / Übersicht */}
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
                                  onClick={() => setVerarbeitungszeit(vz)}
                                  className={`flex items-center justify-between px-3 py-2 border text-sm transition-colors cursor-pointer ${
                                    cfg.verarbeitungszeit === vz
                                      ? "bg-[#822660] border-[#822660] text-white"
                                      : "bg-white border-[#dcdcdc] text-[#333333] hover:border-[#822660]"
                                  }`}
                                >
                                  <span className="font-semibold">{vz}</span>
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
                                                    {/* Gewicht */}
                          <dl className="text-sm border-b border-[#dcdcdc]">
                            <div className="flex justify-between px-4 py-2 border-b border-[#f0f0f0]">
                              <dt className="text-xs text-[#666666]">Gewicht pro Sendung:</dt>
                              <dd className="text-xs text-[#666666]">{preis.gewichtProSendungG} g</dd>
                            </div>

                            <div className="flex justify-between px-4 py-2">
                              <dt className="text-xs text-[#666666]">Gesamtgewicht:</dt>
                              <dd className="text-xs text-[#666666]">{preis.gesamtGewichtKg} kg</dd>
                            </div>
                          </dl>

                        </div>
                      ) : (
                        <div className="border border-[#dcdcdc] p-4 text-sm text-[#666666] bg-[#f4f4f4]">
                          Für diese Kombination erstellen wir Ihnen ein individuelles Angebot.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#2b2b2b] text-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold">Konfiguration anfragen</p>
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

              {/* Navigationsschaltflächen */}
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