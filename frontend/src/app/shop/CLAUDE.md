# src/app/shop

15 product configurator routes, one per product line, at `/shop/<slug>`.

## The standard pattern (14 of 15 pages)

Every page except `levi/` is a 9-line wrapper with this exact shape:

```tsx
import { notFound } from "next/navigation";
import { getXFamilie } from "@/lib/x";
import { XKonfigurator } from "@/components/XKonfigurator";

export default function Page() {
  const familie = getXFamilie("slug");
  if (!familie) notFound();
  return <XKonfigurator familie={familie} />;
}
```

Mapping of route → lib helper → component (see `src/lib/CLAUDE.md` and `src/components/CLAUDE.md` for details):

- **Selfmailer** (`getSelfmailerFamilie` / `SelfmailerKonfigurator`): `afisa`, `alvaro`, `andigo`, `inata`, `klappe_alba`, `megalo`, `mikro`. (`levi` is the exception below.)
- **Kuvertiertes Mailing** (`getMailingFamilie` / `KuvertiertesMailingKonfigurator`): `lang_mailing`, `c4_mailing`.
- **Kartenmailing** (`getKartenmailingFamilie` / `KartenmailingKonfigurator`): `post_din_a4`, `post_din_a5`, `post_din_a6`, `post_din_lan_98`, `post_din_lan_105`, `post_maxi`.

To add a new variant of an existing product line, it's usually enough to add rows to `PRODUKTKATALOG` in `src/data/produktkatalog.ts` — these wrapper pages and the shared configurators need no changes. To add a wholly new product line, add a new slug to the matching `FAMILIEN_KENNUNGEN` map in `src/lib/`, then add a new 9-line wrapper page following the pattern above.

## The exception: shop/levi/page.tsx

Fully custom, ~650 lines, does not use `getSelfmailerFamilie`/`SelfmailerKonfigurator`. Has its own hardcoded pricing tables and an extra pricing/Express-shipping step the shared configurators don't have. See `src/components/CLAUDE.md` for why, and check with the user before assuming this pattern should be extended to other products.
