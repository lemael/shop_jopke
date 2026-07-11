import { Resend } from "resend";

export interface BestellKontakt {
  name: string;
  unternehmen: string;
  email: string;
  telefon: string;
}

export interface BestellAnfrage {
  produkt: string;
  zeilen: [string, string][];
  kontakt: BestellKontakt;
}

export interface Kontaktanfrage {
  name: string;
  telefon: string;
  nachricht: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY fehlt (in .env.local setzen).");
  }
  return new Resend(apiKey);
}

function absenderName(name: string): string {
  const bereinigterName = name.replace(/["\r\n]/g, "").trim();
  return bereinigterName ? `${bereinigterName} (via MailingOnline)` : "MailingOnline";
}

async function sendeMail({
  name,
  replyTo,
  subject,
  text,
  html,
}: Readonly<{ name: string; replyTo?: string; subject: string; text: string; html: string }>): Promise<void> {
  const resend = getResendClient();
  const empfaenger = process.env.MAIL_TO || "info@jopke.de";
  const absenderAdresse = process.env.RESEND_FROM || "onboarding@resend.dev";

  const { error } = await resend.emails.send({
    from: `${absenderName(name)} <${absenderAdresse}>`,
    to: empfaenger,
    ...(replyTo ? { replyTo } : {}),
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendeBestellung({ produkt, zeilen, kontakt }: Readonly<BestellAnfrage>): Promise<void> {
  const zeilenText = zeilen.map(([label, value]) => `${label}: ${value}`).join("\n");
  const zeilenHtml = zeilen
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#2b2b2b;">${escapeHtml(label)}</td><td style="padding:4px 0;color:#666666;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const text = `Neue Konfigurationsanfrage: ${produkt}

${zeilenText}

Kontakt:
Name: ${kontakt.name}
Unternehmen: ${kontakt.unternehmen}
E-Mail: ${kontakt.email}
Telefon: ${kontakt.telefon}
`;

  const html = `
    <h2 style="color:#2b2b2b;">Neue Konfigurationsanfrage: ${escapeHtml(produkt)}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">${zeilenHtml}</table>
    <h3 style="color:#2b2b2b;margin-top:24px;">Kontakt</h3>
    <p style="font-family:sans-serif;font-size:14px;color:#333333;">
      Name: ${escapeHtml(kontakt.name)}<br/>
      Unternehmen: ${escapeHtml(kontakt.unternehmen)}<br/>
      E-Mail: ${escapeHtml(kontakt.email)}<br/>
      Telefon: ${escapeHtml(kontakt.telefon)}
    </p>
  `;

  await sendeMail({
    name: kontakt.name,
    replyTo: kontakt.email,
    subject: `Konfigurationsanfrage: ${produkt}`,
    text,
    html,
  });
}

export async function sendeKontaktanfrage({ name, telefon, nachricht }: Readonly<Kontaktanfrage>): Promise<void> {
  const text = `Neue Kontaktanfrage über die Website

Name: ${name}
Telefon: ${telefon}

Nachricht:
${nachricht}
`;

  const html = `
    <h2 style="color:#2b2b2b;">Neue Kontaktanfrage über die Website</h2>
    <p style="font-family:sans-serif;font-size:14px;color:#333333;">
      Name: ${escapeHtml(name)}<br/>
      Telefon: ${escapeHtml(telefon)}
    </p>
    <h3 style="color:#2b2b2b;margin-top:24px;">Nachricht</h3>
    <p style="font-family:sans-serif;font-size:14px;color:#333333;white-space:pre-line;">${escapeHtml(nachricht)}</p>
  `;

  await sendeMail({
    name,
    subject: `Kontaktanfrage von ${name}`,
    text,
    html,
  });
}
