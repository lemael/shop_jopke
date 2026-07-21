# src/lib

## Catalog grouping helpers: mailing.ts, selfmailer.ts, kartenmailing.ts

Each file exports one `getXFamilie(slug)` function that filters `PRODUKTKATALOG` (from `src/data/produktkatalog.ts`) down to the variants belonging to one product family/line, plus a `Slug` union type and a `FAMILIEN_KENNUNGEN` map (slug → matching keyword/name). Returns `null` if no variants match. See `src/data/CLAUDE.md` for why the matching logic differs per file (index-based vs. keyword-based vs. substring-based).

- `getMailingFamilie(slug: MailingSlug)` — slugs: `lang_mailing`, `c4_mailing`.
- `getSelfmailerFamilie(slug: SelfmailerSlug)` — slugs: `levi`, `inata`, `klappe_alba`, `mikro`, `megalo`, `andigo`, `afisa`, `alvaro`.
- `getKartenmailingFamilie(slug: KartenmailingSlug)` — slugs: `post_din_lan_98`, `post_din_lan_105`, `post_maxi`, `post_din_a6`, `post_din_a5`, `post_din_a4`.

These are consumed by the matching `src/components/*Konfigurator.tsx` component and by the corresponding `src/app/shop/<slug>/page.tsx` (see `src/app/shop/CLAUDE.md`). Note `levi` is also a valid `SelfmailerSlug`/family, but `src/app/shop/levi/page.tsx` does **not** use `getSelfmailerFamilie` — it's a fully custom standalone page (see `src/app/shop/CLAUDE.md`).

## auflage.ts

`AUFLAGE_STAFFELN` — the fixed list of standard quantity tiers (500…200000) shown across all configurators. `auflagenFuer(min, max)` filters that list to the range valid for a given product variant; used by `AuflageAuswahl` alongside its free-text custom quantity input.

## mailer.ts

Wraps the `resend` package to send transactional emails via `/api/bestellung` and `/api/kontakt`.

- `sendeBestellung({ produkt, zeilen, kontakt })` — configurator "request a quote" email. `zeilen` is a `[label, value][]` list rendered as a table (both plain-text and HTML).
- `sendeKontaktanfrage({ name, telefon, nachricht })` — contact form email.
- Requires `RESEND_API_KEY` env var (throws if missing). Optional `RESEND_FROM` (default `onboarding@resend.dev`) and `MAIL_TO` (default `info@jopke.de`). See `.env.local.example`.
- Sender display name is built from the customer's name (`"<name> (via MailingOnline)"`), reply-to is set to the customer's email for order requests.
- All user-supplied strings are HTML-escaped before interpolation into the email body — don't bypass `escapeHtml` when adding new fields.
