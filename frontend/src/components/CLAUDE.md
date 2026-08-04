# src/components

## Shared UI primitives — ConfiguratorUI.tsx

- `OptionTile({ active, onClick, title, subtitle })` — the reusable clickable choice tile used for every selectable option (papier, veredelung, umfang, grammatur, huellentyp, ausstattung…) across all configurators.
- `StepHeader({ step, title, helpTab })` — numbered step heading with an optional `?` link to `/hilfe#{helpTab}` (opens the matching tab on the help page, see `src/app/CLAUDE.md`).

Both are server-renderable (no `"use client"`), imported by every configurator component and by `src/app/shop/levi/page.tsx` (which duplicates its own local copies instead of importing these — see below).

## AuflageAuswahl.tsx

`"use client"`. Renders the quantity-tile grid (`auflagenFuer()` from `src/lib/auflage.ts`) plus a free-text "eigene Menge" number input, with inline min/max validation messages. Used identically by all three family configurators and by the standalone LEVI page.

## The three family configurators

`KuvertiertesMailingKonfigurator.tsx`, `SelfmailerKonfigurator.tsx`, `KartenmailingKonfigurator.tsx` — each takes one `familie` prop (the return type of the matching `getXFamilie()` in `src/lib/`) and renders a multi-step wizard (sidebar step nav + main panel + summary table + `BestellModal` trigger). They are near-identical in structure but branch on different `Produkt` fields:

- **KuvertiertesMailingKonfigurator**: steps Hüllentyp → Ausstattung → Auflage → Farbigkeit Hülle → Grammatur Anschreiben → Farbigkeit Anschreiben → Umfang Flyer → Grammatur Flyer → Oberfläche Flyer → Umfang Broschüre → Oberfläche Broschüre → Endformat Antwortkarte → Grammatur Antwortkarte → Oberfläche Antwortkarte → Übersicht. Branches on `kategorien[2]`/`kategorien[3]`. The two Anschreiben steps are skipped when `optionen.anschreiben` is `null` (see `hatAnschreiben`); the Flyer/Broschüre/Antwortkarte steps are skipped unless the variant has that piece (`optionen.flyer`/`optionen.broschuere`/`optionen.antwortkarte` non-null) **and** `familie.slug === "lang_mailing"` (see `flyerIstInteraktiv`/`broschuereIstInteraktiv`/`antwortkarteIstInteraktiv`) — DIN-C4-Mailing's Flyer/Broschüre stay static info groups (`FLYER_GRUPPE_C4`/`BROSCHUERE_GRUPPE_C4`) since the per-Umfang Grammatur mapping and the Broschüre Grammatur-is-fixed assumption were only verified for DIN-Lang (C4's Broschüre Produktübersicht lists multiple Grammatur values, unlike DIN-lang's single fixed value, so it likely needs its own Grammatur step if ever made interactive); DIN-C4-Mailing never offers an Antwortkarte at all in the catalog, so `antwortkarteIstInteraktiv`'s `lang_mailing` guard is currently unreachable-false rather than load-bearing, but kept for consistency with the other two pieces. `FLYER_GRAMMATUR_NACH_UMFANG` narrows the Flyer Grammatur choices by the previously-selected Umfang (verified on jopke.de: more pages → fewer/lighter grammatures available); Broschüre DIN lang has **no** Grammatur step at all — Grammatur is fixed (`BROSCHUERE_GRAMMATUR_LANG`, verified: content and cover each only ever show one value in the real Produktübersicht). Antwortkarte DIN lang's three steps (Endformat, Grammatur, Oberfläche) are mutually independent — verified on jopke.de that both Endformat choices (210x99mm / 210x105mm) lead to the same two Grammatur options, unlike Flyer's Umfang→Grammatur dependency; Umfang (fixed "2 Seiten"), Farbigkeit (fixed `ANTWORTKARTE_FARBIGKEIT`) and Papier (fixed `ANTWORTKARTE_PAPIER_LANG`) are auto-filled, not chosen. Farbigkeit/Grammatur/Panorama option lists are hardcoded constants in the component, not derived from the catalog — `produktkatalog.ts` rows for this group have `farbigkeit`/`inhalt`/`umschlag` all `null` (that granularity wasn't in the source spreadsheet). Pricing (`berechnePreis` from `src/lib/mailingPreis.ts`) is verified against jopke.de for `lang_mailing` across all three Hüllentypen; `c4_mailing` always renders "Preis auf Anfrage" since jopke.de's own configurator 500s for every C4 combination tested.
- **SelfmailerKonfigurator**: steps Auflage → Umfang → Grammatur → (Perforation, only if the selected Umfang+Grammatur has >1 perforation option) → Übersicht. Branches on `umfang`, `inhalt.grammatur`, `perforation`.
- **KartenmailingKonfigurator**: steps Papier → Veredelung → Auflage → Übersicht. Branches on `inhalt.papier`, `veredelung`.

All three: build a `Config` state object, derive the matching `Produkt` variant from the catalog by narrowing on each selected field, compute `auflagenFuer(mindestmenge, maximalmenge)` for the current variant, and on the final step render a `[label, value][]` summary that's passed straight into `BestellModal`'s `zeilen` prop for the order email.

**Gotcha**: `SelfmailerKonfigurator` and `KartenmailingKonfigurator` don't compute or display a price — they only collect the configuration and send it via `BestellModal` for a manual quote. `KuvertiertesMailingKonfigurator` is the exception: it computes a real price via `berechnePreis()` (see `src/lib/mailingPreis.ts`) for `lang_mailing`, falling back to a manual-quote message for `c4_mailing`. The standalone LEVI page below has its own separate hardcoded pricing.

## The one-off standalone page: src/app/shop/levi/page.tsx

Not a thin wrapper — a fully self-contained ~650-line page with its own local `OptionTile`/`StepHeader`, its own hardcoded `UMFANG_DATA`/`PRICE_MATRIX`/`GRAMMATUR_FACTOR`/`PORTO_RATE` pricing tables, and an extra "Verarbeitungszeit" (Standard/Express) step plus marketing sections below the wizard. It does **not** use `SelfmailerKonfigurator` or `getSelfmailerFamilie`, even though `levi` is a valid family slug. If asked to add pricing to other configurators, this file is the reference implementation — but check with the user before assuming other products should follow the same live-pricing pattern, since it's currently an intentional one-off. See `src/app/shop/CLAUDE.md`.

## Modals

`BestellModal.tsx` / `KontaktModal.tsx` — both `"use client"`, near-identical structure: controlled `open`/`onClose`, local form state, POST to `/api/bestellung` / `/api/kontakt` respectively (see `src/app/CLAUDE.md`), idle/sending/sent/error status states, success view replaces the form in place. `BestellModal` takes `produkt: string` and `zeilen: [string, string][]` (the configurator summary) and forwards them in the request body alongside the contact fields (name, unternehmen, email, telefon). `KontaktModal` only collects name/telefon/nachricht.

## Homepage catalog display

`ProductCard.tsx` — single product card (image or placeholder icon, name/format/pages/price, "Konfigurieren" CTA that's a link if `href` is set, else a plain button). `CategorySection.tsx` — titled grid of `ProductCard`s (2 or 3 columns). Both consume `ProduktKarte` from `src/types/produkt.ts`, **not** `Produkt` from the catalog — the homepage's product lists (`src/app/page.tsx`) are hand-maintained static arrays, independent of `PRODUKTKATALOG`.
