"use client";

import { useState } from "react";
import { OptionTile } from "@/components/ConfiguratorUI";

export function AuflageAuswahl({
  auflagen,
  mindestmenge,
  maximalmenge,
  value,
  onTileSelect,
  onCustomChange,
}: Readonly<{
  auflagen: number[];
  mindestmenge: number | null | undefined;
  maximalmenge: number | null | undefined;
  value: number | null;
  onTileSelect: (auflage: number) => void;
  onCustomChange: (auflage: number | null) => void;
}>) {
  const [eigeneEingabe, setEigeneEingabe] = useState(
    value !== null && !auflagen.includes(value) ? String(value) : ""
  );

  const eigeneMengeAktiv = value !== null && !auflagen.includes(value);
  const unterMindestmenge = value !== null && mindestmenge != null && value < mindestmenge;
  const ueberMaximalmenge = value !== null && maximalmenge != null && value > maximalmenge;

  function eingabeAendern(text: string) {
    setEigeneEingabe(text);
    const n = parseInt(text, 10);
    onCustomChange(Number.isFinite(n) && n > 0 ? n : null);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        {auflagen.map((a) => (
          <OptionTile
            key={a}
            active={value === a}
            onClick={() => { setEigeneEingabe(""); onTileSelect(a); }}
            title={a.toLocaleString("de-DE") + " Stück"}
          />
        ))}
      </div>

      <div className="max-w-xs">
        <label htmlFor="eigene-auflage" className="block text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide mb-2">
          Eigene Menge eingeben
        </label>
        <input
          id="eigene-auflage"
          type="number"
          min={mindestmenge ?? undefined}
          max={maximalmenge ?? undefined}
          step={1}
          value={eigeneEingabe}
          onChange={(e) => eingabeAendern(e.target.value)}
          placeholder={mindestmenge != null ? `z.B. ${mindestmenge.toLocaleString("de-DE")}` : "Menge"}
          className={`w-full p-3 border text-sm transition-colors focus:outline-none focus:border-[#822660] ${
            eigeneMengeAktiv ? "border-[#822660]" : "border-[#dcdcdc]"
          }`}
        />
      </div>

      <div className="mt-4 bg-[#f4f4f4] border border-[#dcdcdc] p-3 text-xs text-[#666666] max-w-xs">
        {mindestmenge != null && maximalmenge != null && (
          <p>
            Wir nehmen Bestellungen ab <strong className="text-[#2b2b2b]">{mindestmenge.toLocaleString("de-DE")} Stück</strong> an,
            maximal <strong className="text-[#2b2b2b]">{maximalmenge.toLocaleString("de-DE")} Stück</strong> pro Bestellung.
          </p>
        )}
        {unterMindestmenge && (
          <p className="text-[#b3261e] mt-1">Die eingegebene Menge liegt unter der Mindestbestellmenge.</p>
        )}
        {ueberMaximalmenge && (
          <p className="text-[#b3261e] mt-1">Die eingegebene Menge übersteigt die maximal mögliche Menge.</p>
        )}
      </div>
    </div>
  );
}
