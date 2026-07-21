# src/components

## Shared UI primitives — ConfiguratorUI.tsx

- `OptionTile({ active, onClick, title, subtitle })` — the reusable clickable choice tile used for every selectable option (papier, veredelung, umfang, grammatur, huellentyp, ausstattung…) across all configurators.
- `StepHeader({ step, title, helpTab })` — numbered step heading with an optional `?` link to `/hilfe#{helpTab}` (opens the matching tab on the help page, see `src/app/CLAUDE.md`).

Both are server-renderable (no `"use client"`), imported by every configurator component and by `src/app/shop/levi/page.tsx` (which duplicates its own local copies instead of importing these — see below).

## AuflageAuswahl.tsx

`"use client"`. Renders the quantity-tile grid (`auflagenFuer()` from `src/lib/auflage.ts`) plus a free-text "eigene Menge" number input, with inline min/max validation messages. Used identically by all three family configurators and by the standalone LEVI page.

## The three family configurators

`KuvertiertesMailingKonfigurator.tsx`, `SelfmailerKonfigurator.tsx`, `KartenmailingKonfigurator.tsx` — each takes one `familie` prop (the return type of the matching `getXFamilie()` in `src/lib/`) and renders a multi-step wizard (sidebar step nav + main panel + summary table + `BestellModal` trigger). They are near-identical in structure but branch on different `Produkt` fields:

- **KuvertiertesMailingKonfigurator**: steps Hüllentyp → Ausstattung → Auflage → Übersicht. Branches on `kategorien[2]`/`kategorien[3]`.
- **SelfmailerKonfigurator**: steps Auflage → Umfang → Grammatur → (Perforation, only if the selected Umfang+Grammatur has >1 perforation option) → Übersicht. Branches on `umfang`, `inhalt.grammatur`, `perforation`.
- **KartenmailingKonfigurator**: steps Papier → Veredelung → Auflage → Übersicht. Branches on `inhalt.papier`, `veredelung`.

All three: build a `Config` state object, derive the matching `Produkt` variant from the catalog by narrowing on each selected field, compute `auflagenFuer(mindestmenge, maximalmenge)` for the current variant, and on the final step render a `[label, value][]` summary that's passed straight into `BestellModal`'s `zeilen` prop for the order email.

**Gotcha**: none of these configurators compute or display a price — they only collect the configuration and send it via `BestellModal` for a manual quote. Pricing only exists in the standalone LEVI page below.

## The one-off standalone page: src/app/shop/levi/page.tsx

Not a thin wrapper — a fully self-contained ~650-line page with its own local `OptionTile`/`StepHeader`, its own hardcoded `UMFANG_DATA`/`PRICE_MATRIX`/`GRAMMATUR_FACTOR`/`PORTO_RATE` pricing tables, and an extra "Verarbeitungszeit" (Standard/Express) step plus marketing sections below the wizard. It does **not** use `SelfmailerKonfigurator` or `getSelfmailerFamilie`, even though `levi` is a valid family slug. If asked to add pricing to other configurators, this file is the reference implementation — but check with the user before assuming other products should follow the same live-pricing pattern, since it's currently an intentional one-off. See `src/app/shop/CLAUDE.md`.

## Modals

`BestellModal.tsx` / `KontaktModal.tsx` — both `"use client"`, near-identical structure: controlled `open`/`onClose`, local form state, POST to `/api/bestellung` / `/api/kontakt` respectively (see `src/app/CLAUDE.md`), idle/sending/sent/error status states, success view replaces the form in place. `BestellModal` takes `produkt: string` and `zeilen: [string, string][]` (the configurator summary) and forwards them in the request body alongside the contact fields (name, unternehmen, email, telefon). `KontaktModal` only collects name/telefon/nachricht.

## Homepage catalog display

`ProductCard.tsx` — single product card (image or placeholder icon, name/format/pages/price, "Konfigurieren" CTA that's a link if `href` is set, else a plain button). `CategorySection.tsx` — titled grid of `ProductCard`s (2 or 3 columns). Both consume `ProduktKarte` from `src/types/produkt.ts`, **not** `Produkt` from the catalog — the homepage's product lists (`src/app/page.tsx`) are hand-maintained static arrays, independent of `PRODUKTKATALOG`.
