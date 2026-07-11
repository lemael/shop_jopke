import { NextResponse } from "next/server";
import { sendeKontaktanfrage } from "@/lib/mailer";

interface KontaktBody {
  name?: unknown;
  telefon?: unknown;
  nachricht?: unknown;
}

export async function POST(request: Request) {
  let body: KontaktBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const telefon = typeof body.telefon === "string" ? body.telefon.trim() : "";
  const nachricht = typeof body.nachricht === "string" ? body.nachricht.trim() : "";

  if (!name || !telefon || !nachricht) {
    return NextResponse.json({ error: "Bitte alle Pflichtfelder ausfüllen." }, { status: 400 });
  }

  try {
    await sendeKontaktanfrage({ name, telefon, nachricht });
  } catch (error) {
    console.error("Fehler beim Senden der Kontaktanfrage:", error);
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
