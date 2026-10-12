import type { Metadata } from "next";
import Link from "next/link";
import styles from "./documentation.module.css";

export const metadata: Metadata = {
  title: "Documentation technique | Mailing Online",
  description: "Fachliche und technische Dokumentation des Mailing-Konfigurators.",
};

const sections = [
  ["objectif", "Projektziel"],
  ["parcours", "Nutzerablauf"],
  ["frontend", "Frontend"],
  ["backend", "Backend"],
  ["donnees", "Daten und Preise"],
  ["api", "API und Integration"],
  ["lancement", "Lokaler Start"],
] as const;

const endpointRows = [
  ["/api/health", "Prüft, ob die API verfügbar ist."],
  ["/api/ausstattung-config/all", "Liefert alle verfügbaren Konfigurationsoptionen."],
  ["/api/ausstattung-config/kategorie/{name}", "Filtert Optionen nach Kategorie."],
  ["/api/tarife/all", "Liefert sämtliche Preise."],
  ["/api/tarife/map/*", "Liefert die Preisstaffeln für die Konfiguratoren."],
] as const;

export default function DocumentationPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>← Zurück zur Website</Link>
          <p className={styles.eyebrow}>Projektdokumentation</p>
          <h1>Mailing Online</h1>
          <p className={styles.lead}>
            Plattform zur Konfiguration von Direktmailing-Kampagnen. Sie führt
            Nutzende von der Produktauswahl bis zur Angebotsanfrage.
          </p>
          <div className={styles.stack}>
            <span>Next.js</span>
            <span>TypeScript</span>
            <span>FastAPI</span>
            <span>Python</span>
            <span>Excel</span>
          </div>
        </div>
      </header>

      <div className={`${styles.container} ${styles.layout}`}>
        <aside className={styles.navigation} aria-label="Inhaltsverzeichnis">
          <p>Inhalt</p>
          <nav>
            {sections.map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
          </nav>
        </aside>

        <article className={styles.content}>
          <section id="objectif">
            <p className={styles.sectionNumber}>01 — Fachlicher Überblick</p>
            <h2>Projektziel</h2>
            <p>
              Mailing Online ermöglicht die Vorbereitung einer Werbemailing-
              Kampagne, ohne dass Kenntnisse über Druck, Falzung, Kuvertierung
              oder Frankierung erforderlich sind. Die Website macht aus einem
              Produkt- und Preiskatalog einen verständlichen
              Konfigurationsablauf.
            </p>
            <div className={styles.cards}>
              <div>
                <h3>Selfmailers</h3>
                <p>
                  Ohne Umschlag versendete Falzflyer. Gewählt werden unter
                  anderem Auflage, Seitenumfang, Grammatur und Perforation.
                </p>
              </div>
              <div>
                <h3>Kartenmailings</h3>
                <p>
                  Postkarten, die anhand von Auflage, Papier und Veredelung
                  konfiguriert werden.
                </p>
              </div>
              <div>
                <h3>Kuvertierte Mailings</h3>
                <p>
                  Kampagnen mit Umschlag und mehreren Bestandteilen wie
                  Anschreiben, Flyern, Broschüre oder Antwortkarte.
                </p>
              </div>
            </div>
          </section>

          <section id="parcours">
            <p className={styles.sectionNumber}>02 — Nutzerablauf</p>
            <h2>Vom Produkt zur Angebotsanfrage</h2>
            <ol className={styles.timeline}>
              <li><strong>Produkt wählen</strong><span>Auf der Startseite nach Produktfamilie und Format.</span></li>
              <li><strong>Eigenschaften konfigurieren</strong><span>Die angezeigten Schritte hängen vom Produkt und den verfügbaren Kombinationen ab.</span></li>
              <li><strong>Preis prüfen</strong><span>Der Konfigurator berechnet bei vorhandenen Daten Druckkosten, Gewicht, Porto und Mehrwertsteuer.</span></li>
              <li><strong>Anfrage senden</strong><span>Eine Übersicht zeigt die Auswahl vor dem Versand der Anfrage.</span></li>
            </ol>
            <p className={styles.note}>
              Standardauflagen werden als Kacheln angeboten. Eine eigene Menge
              kann ebenfalls eingegeben und gegen die Mindest- und
              Höchstmengen des Produkts geprüft werden.
            </p>
          </section>

          <section id="frontend">
            <p className={styles.sectionNumber}>03 — Frontend</p>
            <h2>Next.js-Anwendung mit TypeScript</h2>
            <p>
              Das Frontend ist eine Next.js-Anwendung mit dem
              <code>app</code>-Router. Jede Produktfamilie hat eine Route unter
              <code>/shop</code>, die den passenden Konfigurator lädt. Die
              Oberfläche verwendet Tailwind CSS und gemeinsame Komponenten.
            </p>
            <div className={styles.architecture}>
              <div><span>Seiten</span><code>src/app</code><p>Routen, Produkt- und Informationsseiten.</p></div>
              <div><span>Komponenten</span><code>src/components</code><p>Konfiguratoren, Auflagenauswahl und gemeinsame Benutzeroberfläche.</p></div>
              <div><span>Status</span><code>src/stores</code><p>Zustand-Stores für Schritte und Konfigurationsauswahl.</p></div>
              <div><span>Dienste</span><code>src/api · src/services</code><p>HTTP-Client und typisierter Zugriff auf API-Daten.</p></div>
            </div>
            <p>
              Die Konfiguratoren speichern den aktuellen Schritt und die
              Konfiguration in Zustand. Die Auswahl einer Kachel führt zum
              nächsten Schritt; eine eigene Menge aktualisiert nur den Wert,
              damit Eingaben in Ruhe korrigiert werden können.
            </p>
          </section>

          <section id="backend">
            <p className={styles.sectionNumber}>04 — Backend</p>
            <h2>FastAPI-Backend mit Python</h2>
            <p>
              Das Backend stellt dem Frontend die benötigten Daten über eine
              FastAPI-REST-API bereit. Die Routen sind nach Bereichen
              organisiert: Anwendungsstatus, verfügbare Konfigurationen und
              Preise.
            </p>
            <div className={styles.flow} aria-label="Architecture de traitement">
              <span>Navigateur</span><b>→</b><span>Next.js</span><b>→</b><span>API FastAPI</span><b>→</b><span>Services Python</span><b>→</b><span>tarife.xlsx</span>
            </div>
            <p>
              FastAPI prüft Antworten mit Pydantic-Modellen. Das
              CORS-Middleware erlaubt dem Frontend den API-Aufruf von seiner
              eigenen Domain aus. Controller koordinieren die Dienste und geben
              eindeutige HTTP-Fehler zurück, wenn Daten nicht gelesen werden
              können.
            </p>
          </section>

          <section id="donnees">
            <p className={styles.sectionNumber}>05 — Daten und Preise</p>
            <h2>Eine zentrale Preisquelle</h2>
            <p>
              Die fachlichen Daten liegen zentral in
              <code> backend/tarife.xlsx</code>. Das Backend liest sie mit
              Pandas und OpenPyXL, wandelt sie in strukturierte Objekte um und
              sendet sie anschließend an das Frontend.
            </p>
            <ul className={styles.checkList}>
              <li>Kategorien und Produktgruppen</li>
              <li>Formate, Papiere, Grammaturen und Veredelungen</li>
              <li>Mindestmengen, Höchstmengen und Auflagenstaffeln</li>
              <li>Produktionspreise, Gewicht und Portoinformationen</li>
            </ul>
            <p>
              Durch diese Trennung lässt sich der Preiskatalog aktualisieren,
              ohne Konfigurationsseiten neu schreiben zu müssen.
            </p>
          </section>

          <section id="api">
            <p className={styles.sectionNumber}>06 — API und Integration</p>
            <h2>Kommunikation zwischen Frontend und Backend</h2>
            <p>
              Der HTTP-Client bündelt die Anfragen und verwendet die
              Umgebungsvariable <code>NEXT_PUBLIC_API_URL</code>. Ohne diese
              Variable nutzt das Frontend die URL des gehosteten Backends.
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Endpoint</th><th>Funktion</th></tr></thead>
                <tbody>
                  {endpointRows.map(([endpoint, purpose]) => (
                    <tr key={endpoint}><td><code>{endpoint}</code></td><td>{purpose}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="lancement">
            <p className={styles.sectionNumber}>07 — Lokale Entwicklung</p>
            <h2>Projekt starten</h2>
            <div className={styles.commands}>
              <div>
                <h3>Backend — port 8000</h3>
                <pre><code>{`cd backend
source .venv/bin/activate
uvicorn app.main:app --reload`}</code></pre>
              </div>
              <div>
                <h3>Frontend — port 3000</h3>
                <pre><code>{`cd frontend
npm install
npm run dev`}</code></pre>
              </div>
            </div>
            <p>
              Um die lokale API zu verwenden, tragen Sie
              <code>NEXT_PUBLIC_API_URL=http://localhost:8000/api</code> dans
              die Datei <code>frontend/.env.local</code> ein und starten Sie
              den Next.js-Server anschließend neu. Die interaktive
              FastAPI-Dokumentation ist unter
              <code>http://localhost:8000/docs</code> verfügbar.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
