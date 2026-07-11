"use client";

import { useState, type FormEvent } from "react";

interface BestellModalProps {
  open: boolean;
  onClose: () => void;
  produkt: string;
  zeilen: [string, string][];
}

type Status = "idle" | "sending" | "sent" | "error";

export function BestellModal({ open, onClose, produkt, zeilen }: Readonly<BestellModalProps>) {
  const [name, setName] = useState("");
  const [unternehmen, setUnternehmen] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) return null;

  function handleClose() {
    onClose();
    setStatus("idle");
    setErrorMessage("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/bestellung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produkt, zeilen, kontakt: { name, unternehmen, email, telefon } }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "E-Mail konnte nicht gesendet werden.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "E-Mail konnte nicht gesendet werden.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-md shadow-xl relative">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Schließen"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-[#888888] hover:text-[#2b2b2b] hover:bg-[#f4f4f4] transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="p-6 sm:p-8">
          {status === "sent" ? (
            <>
              <h2 className="text-lg font-bold text-[#2b2b2b] mb-3">Anfrage gesendet</h2>
              <p className="text-sm text-[#666666] leading-6 mb-6">
                Vielen Dank{name ? `, ${name}` : ""}! Wir haben Ihre Konfiguration erhalten und melden uns innerhalb
                eines Werktages bei Ihnen.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="w-full px-6 py-3 bg-[#822660] hover:bg-[#6b1f50] text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Schließen
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-[#2b2b2b] mb-1">Konfiguration anfragen</h2>
              <p className="text-xs text-[#888888] mb-6">{produkt}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="bestell-name" className="block text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide mb-1">
                    Name *
                  </label>
                  <input
                    id="bestell-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dcdcdc] text-sm text-[#2b2b2b] focus:outline-none focus:border-[#822660]"
                  />
                </div>
                <div>
                  <label htmlFor="bestell-unternehmen" className="block text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide mb-1">
                    Unternehmen *
                  </label>
                  <input
                    id="bestell-unternehmen"
                    type="text"
                    required
                    value={unternehmen}
                    onChange={(e) => setUnternehmen(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dcdcdc] text-sm text-[#2b2b2b] focus:outline-none focus:border-[#822660]"
                  />
                </div>
                <div>
                  <label htmlFor="bestell-email" className="block text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide mb-1">
                    E-Mail *
                  </label>
                  <input
                    id="bestell-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dcdcdc] text-sm text-[#2b2b2b] focus:outline-none focus:border-[#822660]"
                  />
                </div>
                <div>
                  <label htmlFor="bestell-telefon" className="block text-xs font-semibold text-[#2b2b2b] uppercase tracking-wide mb-1">
                    Telefon *
                  </label>
                  <input
                    id="bestell-telefon"
                    type="tel"
                    required
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dcdcdc] text-sm text-[#2b2b2b] focus:outline-none focus:border-[#822660]"
                  />
                </div>

                {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={`w-full px-6 py-3 font-semibold text-sm transition-colors ${
                    status === "sending"
                      ? "bg-[#dcdcdc] text-[#aaaaaa] cursor-default"
                      : "bg-[#822660] hover:bg-[#6b1f50] text-white cursor-pointer"
                  }`}
                >
                  {status === "sending" ? "Wird gesendet …" : "Bestellen"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
