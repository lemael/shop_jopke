export const FAMILIEN_KENNUNGEN = {
  lang_mailing: "DIN-Lang-Mailing",
  c4_mailing: "DIN-C4-Mailing",
} as const;

export type MailingSlug = keyof typeof FAMILIEN_KENNUNGEN;