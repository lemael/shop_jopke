import { NextResponse } from "next/server";
import { sendeBestellung } from "@/lib/mailer";

interface BestellungBody {
  produkt?: unknown;
  zeilen?: unknown;
  kontakt?: {
    name?: unknown;
    unternehmen?: unknown;
    email?: unknown;
    telefon?: unknown;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: BestellungBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { produkt, zeilen, kontakt } = body;
  const name = typeof kontakt?.name === "string" ? kontakt.name.trim() : "";
  const unternehmen = typeof kontakt?.unternehmen === "string" ? kontakt.unternehmen.trim() : "";
  const email = typeof kontakt?.email === "string" ? kontakt.email.trim() : "";
  const telefon = typeof kontakt?.telefon === "string" ? kontakt.telefon.trim() : "";

  if (
    typeof produkt !== "string" ||
    !produkt.trim() ||
    !Array.isArray(zeilen) ||
    !name ||
    !unternehmen ||
    !EMAIL_REGEX.test(email) ||
    !telefon
  ) {
    return NextResponse.json({ error: "Bitte alle Pflichtfelder korrekt ausfüllen." }, { status: 400 });
  }

  try {
    await sendeBestellung({
      produkt,
      zeilen: zeilen as [string, string][],
      kontakt: { name, unternehmen, email, telefon },
    });
  } catch (error) {
    console.error("Fehler beim Senden der Bestellanfrage:", error);
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
