# src/app

Next.js App Router. Tech stack: Next 16, React 19, Tailwind CSS 4, TypeScript, `resend` for transactional email. German-language B2B site ("MailingOnline", operated by Jopke Dialog Services). Brand color `#822660` (magenta/purple), dark `#2b2b2b`/`#1e1e1e`, light bg `#f4f4f4` — used consistently via inline Tailwind arbitrary-value classes (no theme config extension, no CSS variables for color).

## layout.tsx / globals.css

Root layout sets `lang="de"`, loads Open Sans via `next/font/google`, sets site-wide `<html>`/`<body>` classes. Metadata (title/description) is static, defined here.

## page.tsx (homepage)

Single-file marketing homepage: sticky navbar, hero video (`/beispiel 1.mp4`), three `CategorySection` product grids (Selfmailer / Kuvertiertes Mailing / Kartenmailing — see `src/components/CLAUDE.md`), features strip, footer. Product arrays (`selfmailerProducts`, `kuvertiertesMailingProducts`, `kartenMailingProducts`) are **hand-maintained `ProduktKarte[]` literals in this file** — not derived from `src/data/produktkatalog.ts`. If a price, image, or blurb shown on the homepage card looks stale, this is the file to edit; it won't self-update from catalog changes.

## shop/

Product configurators — see `src/app/shop/CLAUDE.md`.

## api/ — email routes

- `POST /api/bestellung` (`api/bestellung/route.ts`) — validates `{ produkt, zeilen, kontakt: { name, unternehmen, email, telefon } }` (email regex-checked, all fields required), calls `sendeBestellung()` from `src/lib/mailer.ts`. Used by `BestellModal`.
- `POST /api/kontakt` (`api/kontakt/route.ts`) — validates `{ name, telefon, nachricht }`, calls `sendeKontaktanfrage()`. Used by `KontaktModal` and the `/kontakt` page.
- Both return `{ error: string }` with 400/500 on failure, `{ ok: true }` on success; errors are logged server-side via `console.error`.

## Static content pages

- `kontakt/page.tsx` — contact page with an autoplay-on-click welcome video (`/jopke-willkommen.mp4`) and a `KontaktModal` trigger.
- `hilfe/page.tsx` — tabbed help page (`TABS: HilfeTab[]`, one per configurator step: auflage, umfang, grammatur, perforation, verarbeitung, papier, veredelung, huellentyp, ausstattung, uebersicht, porto). Every configurator's `StepHeader` links to `/hilfe#<tabId>` via `helpTab` — **when adding a new configurator step, add a matching tab `id` here** or the help link will 404 to a nonexistent anchor.
- `impressum/`, `datenschutz/`, `agb/` — static legal pages (Impressum, Datenschutzerklärung, AGB), plain JSX with no client state, safe to edit as pure copy/content changes.
