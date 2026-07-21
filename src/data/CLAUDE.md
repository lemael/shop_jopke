# src/data

## produktkatalog.ts

Auto-generated from `_produktdaten_Herr_Fosso_20260710.xlsx`, sheet "Hauptartikel & Vorauswahl". **Do not hand-edit product entries** — regenerate from the spreadsheet if the source data changes. Only customer-relevant catalog fields were kept; internal cost/supplier/pricing-tier columns were intentionally dropped.

Exports:
- `PRODUKTKATALOG: Produkt[]` — flat array of ~every product variant (2600+ lines).
- `Produkt` interface — one catalog row/variant. Key fields:
  - `produktNummer` — e.g. `"100.101"`.
  - `kategorien: Kategorieebene[]` — the category breadcrumb hierarchy, **ordered outer → inner**. Index meaning differs by product group (see below) — this is the field every `src/lib/*.ts` grouping helper filters/groups on.
  - `optionen` — which enclosure/letter/flyer/brochure/reply-card SKUs are included (nullable).
  - `endformat` / `offenesFormat` / `umfang` — final size / flat-sheet size / page count.
  - `inhalt` / `umschlag: PapierAngabe | null` — paper spec (`papier`, `grammatur`, `oberflaeche`) for content vs. envelope.
  - `mindestmenge` / `maximalmenge` — min/max order quantity, used by `src/lib/auflage.ts` to filter quantity tiles.

### `kategorien` index meaning by product group

The 3 top-level groups in the catalog use **different hierarchy depths**, so consumers must know which group they're reading before indexing into `kategorien`:

- **Kuvertiertes Mailing** (`kategorien[0].name === "Kuvertiertes Mailing"`): `[0]` group, `[1]` product line (e.g. "DIN-Lang-Mailing"), `[2]` envelope/Hüllentyp (e.g. "Fensterhülle"), `[3]` Ausstattung (contents combo). See `src/lib/mailing.ts`.
- **Selfmailer** (`kategorien[0].name === "Selfmailer"`): grouped by matching a keyword (LEVI, INATA, ALBA, MIKRO, MEGALO, ANDIGO, AFISA, ALVARO) against the **last** category level's name — not a fixed index, because depth varies per line. See `src/lib/selfmailer.ts`.
- **Kartenmailing** (`kategorien[0].name === "Kartenmailing"`): `[0]` group, `[1]` format (contains a `(WxH)` mm marker like `(210x98)`). See `src/lib/kartenmailing.ts`.

Category names in the source spreadsheet sometimes contain Unicode whitespace variants (notably around "INATA") — matching is done with `.includes(kennung)` + whitespace normalization, never exact string equality.

## Related

- `src/lib/CLAUDE.md` — the three `getXFamilie()` grouping functions built on top of this data.
- `src/types/produkt.ts` — unrelated, much simpler `ProduktKarte` type used only for the static homepage product-card grid (id/name/format/pages/price/href/image), not derived from `PRODUKTKATALOG`.
