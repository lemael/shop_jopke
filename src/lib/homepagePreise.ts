import { getMailingFamilie } from "@/lib/mailing";
import { berechnePreis } from "@/lib/mailingPreis";
import { getSelfmailerFamilie } from "@/lib/selfmailer";
import type { MailingSlug } from "@/lib/mailing";
import type { SelfmailerSlug } from "@/lib/selfmailer";
import type { KartenmailingSlug } from "@/lib/kartenmailing";

const HOMEPAGE_AUFLAGEN = [500, 1000, 2000, 3000, 5000, 10000, 20000, 50000, 100000] as const;

const SELFMAILER_PRICE_MATRIX: Partial<Record<SelfmailerSlug, Record<number, Record<number, number>>>> = {
  levi: {
    4: { 500: 0.712237, 1000: 0.434617, 2000: 0.295808, 3000: 0.249537, 5000: 0.212522, 10000: 0.173 },
    6: { 500: 0.708877, 1000: 0.433177, 2000: 0.295327, 3000: 0.249377, 5000: 0.212617, 10000: 0.179287 },
    8: { 500: 0.799838, 1000: 0.491738, 2000: 0.337687, 3000: 0.286338, 5000: 0.245258, 10000: 0.199184 },
    10: { 500: 0.902798, 1000: 0.556298, 2000: 0.383048, 3000: 0.325297, 5000: 0.279097, 10000: 0.227168 },
    12: { 500: 0.948397, 1000: 0.585337, 2000: 0.403807, 3000: 0.343297, 5000: 0.294889, 10000: 0.237128 },
  },
  inata: {
    4: { 500: 1.053037, 1000: 0.646537, 2000: 0.443288, 3000: 0.375538, 5000: 0.321337, 10000: 0.259952 },
    6: { 500: 1.132718, 1000: 0.702217, 2000: 0.486967, 3000: 0.415217, 5000: 0.357817, 10000: 0.290167 },
    8: { 500: 1.370318, 1000: 0.855818, 2000: 0.598568, 3000: 0.512817, 5000: 0.444218, 10000: 0.375968 },
  },
  klappe_alba: {
    6: { 500: 1.64982, 1000: 0.93627, 2000: 0.579495, 3000: 0.46057, 5000: 0.36543, 10000: 0.278106 },
    8: { 500: 1.962143, 1000: 1.146203, 2000: 0.738233, 3000: 0.602243, 5000: 0.493451, 10000: 0.408709 },
  },
  mikro: {
    4: { 500: 0.661838, 1000: 0.398618, 2000: 0.267008, 3000: 0.223138, 5000: 0.188042, 10000: 0.151664 },
    6: { 500: 0.730237, 1000: 0.443737, 2000: 0.300487, 3000: 0.252738, 5000: 0.214537, 10000: 0.171943 },
    8: { 500: 0.795757, 1000: 0.485258, 2000: 0.330008, 3000: 0.278257, 5000: 0.236857, 10000: 0.189583 },
  },
  megalo: {
    4: { 500: 0.797438, 1000: 0.486938, 2000: 0.331688, 3000: 0.279938, 5000: 0.238538, 10000: 0.198823 },
    6: { 500: 0.841118, 1000: 0.518618, 2000: 0.357368, 3000: 0.303617, 5000: 0.260618, 10000: 0.212839 },
    8: { 500: 0.963278, 1000: 0.592778, 2000: 0.407528, 3000: 0.345778, 5000: 0.296378, 10000: 0.247087 },
  },
  andigo: {
    12: { 500: 1.515217, 1000: 0.875287, 2000: 0.555322, 3000: 0.448667, 5000: 0.363344, 10000: 0.290398 },
  },
  afisa: {
    8: { 500: 1.114478, 1000: 0.671978, 2000: 0.450728, 3000: 0.376978, 5000: 0.317978, 10000: 0.273968 },
  },
  alvaro: {
    16: { 500: 1.288717, 1000: 0.798218, 2000: 0.552967, 3000: 0.471217, 5000: 0.405817, 10000: 0.330535 },
    20: { 500: 1.545082, 1000: 0.973583, 2000: 0.687832, 3000: 0.592583, 5000: 0.516382, 10000: 0.421552 },
  },
};

const MAILINGPREIS_BY_SLUG: Record<MailingSlug, number> = {
  lang_mailing: 0.638129,
  c4_mailing: 0.66285,
};

const KARTENPREIS_BY_SLUG: Record<KartenmailingSlug, number> = {
  post_din_lan_98: 0.48,
  post_din_lan_105: 0.492,
  post_maxi: 0.528,
  post_din_a6: 0.48,
  post_din_a5: 0.552,
  post_din_a4: 0.7395,
};

function formatHomepagePrice(value: number) {
  return `ab ${value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function minPrice(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.min(...values);
}

export function getSelfmailerHomepagePrice(slug: SelfmailerSlug): string {
  const familie = getSelfmailerFamilie(slug);
  if (!familie) return "Preis auf Anfrage";

  const candidatePrices = familie.varianten.flatMap((variante) => {
    const umfang = Number.parseInt(variante.umfang ?? "0", 10);
    const matrix = SELFMAILER_PRICE_MATRIX[slug]?.[umfang];
    if (!matrix) return [];
    return Object.values(matrix);
  });

  const cheapest = minPrice(candidatePrices);
  if (cheapest === null) return "Preis auf Anfrage";

  return formatHomepagePrice(cheapest);
}

export function getMailingHomepagePrice(slug: MailingSlug): string {
  if (slug === "c4_mailing") {
    const price = MAILINGPREIS_BY_SLUG[slug];
    return price === undefined ? "Preis auf Anfrage" : formatHomepagePrice(price);
  }

  const familie = getMailingFamilie(slug);
  if (!familie) return "Preis auf Anfrage";

  const candidatePrices = familie.varianten.flatMap((variante) => {
    const huellentyp = variante.kategorien[2]?.name ?? null;
    const ausstattung = variante.kategorien[3]?.name ?? null;
    if (!huellentyp || !ausstattung) return [];

    return HOMEPAGE_AUFLAGEN.flatMap((auflage) => {
      if (auflage < (variante.mindestmenge ?? 0) || auflage > (variante.maximalmenge ?? Number.POSITIVE_INFINITY)) {
        return [];
      }

      const preisdetails = berechnePreis({
        slug,
        huellentyp,
        ausstattung,
        auflage,
      });
      if (!preisdetails) return [];

      return [preisdetails.gesamtNettoStandard / auflage];
    });
  });

  const cheapest = minPrice(candidatePrices);
  return cheapest === null ? "Preis auf Anfrage" : formatHomepagePrice(cheapest);
}

export function getKartenmailingHomepagePrice(slug: KartenmailingSlug): string {
  const price = KARTENPREIS_BY_SLUG[slug];
  return price === undefined ? "Preis auf Anfrage" : formatHomepagePrice(price);
}
