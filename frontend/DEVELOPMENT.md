# Développement — Frontend `shop_jopke`

Ce document décrit la construction du frontend (dossier `frontend/`), son architecture, son fonctionnement et la procédure de travail. Il est à lire en parallèle de la doc du backend (`backend/README.md`) et des specs de tests (`tests/`).

> Source de vérité : le code du dépôt, les fichiers de configuration, et l'historique git. Les commandes et chemins sont ceux confirmés sur cette machine.

---

## 1. Vue d'ensemble

Le frontend est le site vitrine et formulaire de commande pour `jopke.de` (vêtement mailing / création de mailing sur mesure). Il permet à un client de configurer : un mailing **kuvertiert** (avec anschrift, anschreiben, flyer, brochure, réponse-carte), un mailing **selfmailer** ou un mailing **kartenmailing**. Le cœur de l'interface est un **configureur en étapes** qui calcule les prix en temps réel.

| Élément | Valeur |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16.2.9 (App Router, Turbopack en dev) |
| Interface | React 19.2.4 |
| État global | [Zustand](https://zustand.docs.pmnd.rs) 5.0.15 |
| Styles | Tailwind CSS 4 + PostCSS |
| API cliente | `fetch` (appel REST) |
| Serveur d'app | Node.js / `next start` (prod) / `next dev --turbopack` (dev) |
| Déploiement | Docker (voir `frontend/Dockerfile`), exposé derrière le `docker-compose.yml` avec le backend |

### Dépendances principales

`package.json` :

```json
"dependencies": {
  "next": "16.2.9",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "resend": "^6.17.2",          // envoi d'email (contact / commande)
  "zustand": "^5.0.15"
},
"devDependencies": {
  "@tailwindcss/postcss": "^4",
  "tailwindcss": "^4",
  "typescript": "^5",
  "eslint": "^9",
  "eslint-config-next": "16.2.9",
  "playwright": "^1.51.1",
  "husky": "^9.1.7"
}
```

---

## 2. Comment créer / lancer le projet

### 2.1 Prérequis

- **Node.js** (version indiquée par `engines` de `package.json` si présent, sinon la version utilisée pour le build)
- **npm** ou **pnpm** (les scripts sont écrits pour `npm`; le fichier `package-lock.json` existe)
- **Backend** en cours d'exécution (voir `backend/README.md`) — le frontend consomme une API REST

### 2.2 Installation

```bash
cd frontend
npm install
```

### 2.3 Variables d'environnement

Copier `.env.local.example` → `.env.local` et adapter `NEXT_PUBLIC_API_URL` si le backend n'est pas celui de production.

```bash
cp .env.local.example .env.local
```

Voir `src/config/env.ts` : `NEXT_PUBLIC_API_URL` (par défaut `https://backend-production-b4b03.up.railway.app/api`).

### 2.4 Lancer en développement / build / production

D'après `package.json` :

| Script | Rôle |
|---|---|
| `npm run dev` | Développement avec Turbopack (`NODE_OPTIONS='--max-old-space-size=4096' next dev --turbopack`) |
| `npm run build` | Build Produite (`next build --webpack`) |
| `npm run start` | Serveur production (`next start -p ${PORT:-3000}`) |
| `npm run lint` | ESLint |
| `npm run extract:jopke-fensterhuelle` | Génère une configuration depuis un JSON (script dédié) |
| `npm run extract:jopke-fensterhuelle-antwortkarte` | Idem, avec réponse-carte |
| `npm run extract:jopke-fensterhuelle-antwortkarte-gruppen` | Idem, version groupée |
| `npm run vergleich:antwortkarte-gruppen` | Comparaison de prix (script dédié) |

Lancer `http://localhost:3000` après `npm run dev`.

### 2.5 Docker

`frontend/Dockerfile` : image basée sur Node, expose le port 3000, lance `npm run start`. Le `docker-compose.yml` lie le service `frontend` (port `3000:3000`) au service `backend` (`8000:8000`, `depends_on`), avec un `env_file` pointant vers un chemin à vérifier avant déploiement (note présente dans le README du backend).

---

## 3. Structure du projet

```
frontend/
├── app/                      # Route pages (App Router)
│   ├── layout.tsx            # Root layout (police Open Sans, meta)
│   ├── page.tsx              # Raccourci vers views/homeView
│   ├── shop/                 # Pages de détail de famille de mailing
│   ├── agb/ / datenschutz/ / impressum/ / kontakt/ / hilfe/
│   ├── api/                  # API route (bestellung, kontakt)
│   ├── theme/                # Feuilles CSS globales (buttons, colors, sizes, typography)
│   └── globals.css
├── components/               # Composants réutilisables
│   ├── home/                 # Header, Hero, Footer, TopInfoBar, FeaturesStrip
│   ├── ui/                   # ChoiceButton, ChoiceGroup
│   ├── AuflageAuswahl.tsx
│   ├── BestellModal.tsx
│   ├── ConfiguratorUI.tsx
│   ├── KartenmailingKonfigurator.tsx
│   ├── KontaktModal.tsx
│   ├── KuvertiertesMailingKonfigurator.tsx
│   ├── ProductCard.tsx
│   ├── SelfmailerKonfigurator.tsx
│   └── ...
├── config/env.ts             # Lecture NEXT_PUBLIC_API_URL
├── data/                     # Spécifications statiques
│   ├── ausstatung_config.ts
│   ├── constants.ts
│   ├── homepageProducts.ts
│   ├── kuvertiertesMailing.ts      # Steps du configureur (ALL_STEPS, sets)
│   ├── selfmailing.ts
│   └── ...
├── lib/                      # Logique métier / calculs
│   ├── auflage.ts, gewicht.ts
│   ├── homepagePreise.ts
│   ├── kartenmailingPreis.ts
│   ├── kuvertiertesmailingPreis.ts   # berechnePreis (coûts)
│   ├── mailer.ts, mailing.ts
│   ├── porto.ts, selfmailerPreis.ts
│   └── ...
├── services/                 # Services d'abstraction API
│   ├── ausstattungConfigService.ts
│   └── tarifeService.ts
├── stores/                   # Zustand
│   ├── useConfiguratorStore.ts
│   ├── useKartenmailingConfiguratorStore.ts
│   └── useSeflmailerConfiguratorStore.ts   # (nom légèrement cassé : "Selfmailer")
├── types/                    # Schemas TypeScript
│   ├── artickTarifDetails.ts
│   ├── ausstattungConfig.ts
│   ├── kartenmailing/
│   ├── kuvertiertesMailing/
│   ├── selfmailer/
│   └── ...
├── api/                      # Clients API (fetch)
│   ├── ausstattungConfigApi.ts
│   ├── client.ts
│   └── tarifeApi.ts
├── views/                    # Vues de pages
│   ├── hilfe.tsx
│   ├── homeView.tsx
│   └── kontakt.tsx
├── scripts/                  # Scripts Node (génération/configuration)
│   ├── extract-jopke-fensterhuelle*.mjs
│   ├── generateConfig.mjs
│   └── vergleich-prix-antwortkarte-gruppen.mjs
├── main.tsx                  # Boucle d'initialisation React
├── app.tsx                   # Enveloppe racine (rend Home)
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── eslint.config.mjs
```

> Remarque : les noms de fichiers sont en allemand (ex. `KuvertiertesMailingKonfigurator`, `anschreibenFarbigkeiten`) — ce sont des conventions du projet, à préserver.

---

## 4. Architecture globale

```
┌──────────────┐     REST fetch      ┌──────────────────┐
│   Next.js    │ ─────────────────►  │  Backend FastAPI │
│  (frontend)  │                       │  (tarifs, config)│
│              │ ◄──────────────────  │                  │
│  - App Router │   app/api/route.ts  └──────────────────┘
│  - configureur│
│  - Zustand    │   store → lib → calculs
│  - Tailwind   │
└──────────────┘
```

### Couche 1 — Routes / vues
- `app/layout.tsx` définit la page racine (police, meta, `<html>`/`<body>`).
- `app/page.tsx` ré-exporte `Home` (`src/views/homeView.tsx`).
- `src/app.tsx` de nouveau enveloppe `Home` (point d'entrée racine).
- Les pages de détail de famille (`shop/*`) utilisent les données dynamiques (groupe produit) et les calculs de prix.

### Couche 2 — État : Zustand (`useConfiguratorStore`)
Le flux de configuration est géré par un store Zustand central. Les états courants :
- `gruppe` / `familieSlug` / `name` / `beschreibung` — contexte de la sélection d'un produit
- `cfg` (type `Config`) — valeurs saisies par l'utilisateur (hüllentyp, ausstattung, auflage, farbigkeit, flyer..., broschuere..., antwortkarte..., verarbeitungszeit)
- `currentStep` — étape active du configureur
- `artikelTarife`, `ausstattungConfigs` — données chargées via API
- `preis()` — getter dérivé qui appelle `berechnePreis` avec l'ensemble des choix

### Couche 3 — Présentation (`components/`, `views/`)
- `ConfiguratorUI.tsx` / `KuvertiertesMailingKonfigurator.tsx` / `SelfmailerKonfigurator.tsx` — les tableaux de bord de configuration.
- `ProductCard.tsx`, `CategorySection.tsx`, `home/*` — homepage.
- `KontaktModal.tsx`, `BestellModal.tsx` — formulaires de commande/contact.

### Couche 4 — Données & calculs
- `src/data/` : constantes statiques, définitions des étapes, listes produit.
- `src/lib/` : calculs de prix, porto, grammage, tranches d'achat.
- `src/api/` + `src/services/` : appels réseau vers le backend.

### Couche 5 — API backend (externe)
FastAPI (`backend/`) exposant : `/api/tarife/*`, `/api/ausstattung-config/*`, `/api/health`. Voir `backend/README.md`.

---

## 5. Le configureur : fonctionnement détaillé

Le cœur de l'application est un **configureur en étapes** qui s'adapte au produit choisi.

### 5.1 Définition des étapes (`src/data/kuvertiertesMailing.ts`)

Les étapes sont définies dans un tableau `ALL_STEPS` :

```
Hüllentyp → Ausstattung → Auflage → Farbigkeit Hülle → Anzahl Flyer →
Grammatur Anschreiben → Farbigkeit Anschreiben → Umfang Flyer → Grammatur Flyer → Oberfläche Flyer →
Umfang Broschüre → Grammatur Broschüre (Inhalt) → Oberfläche Broschüre (Inhalt) →
Oberfläche Broschüre (Umschlag) → Grammatur Broschüre (Umschlag) →
Endformat Antwortkarte → Grammatur Antwortkarte → Oberfläche Antwortkarte → Übersicht
```

Des ensembles `Set` (FLYER_STEPS, BROSCHUERE_STEPS, ANTWORTKARTE_STEPS) déterminent les étapes spécifiques à une famille. Les étapes comme `Anzahl Flyer` déclenchent des étapes **dynamiques** (`Flyer 1 - Umfang`, `Flyer 1 - Grammatur`, `Flyer 1 - Oberfläche`, etc.) en fonction du nombre de flyers choisi.

### 5.2 États du store

- `selectHuellentyp()` → passe à l'étape `Ausstattung`
- `selectAusstattung()` → passe à `Auflage`
- `selectAuflage()` → appelle `next()`
- `selectHuelleFarbigkeit()` → `next()`
- `selectAnschreibenGrammatur()` / `Farbigkeit` / `Anzahl Flyer` / ... → `next()`
- `selectBroschuereUmfang()` → met à jour les listes disponibles d'ordinateurs, puis `next()`
- `selectBroschuereInhaltOberflaeche()` → vérifie la compatibilité de l'odorant précédent et `next()`
- `selectAntwortkarteEndformat()` / `Grammatur()` / `Oberflaeche()` → `next()`
- `goTo(step)` : aller à une étape (par navigation)
- `next()` : avancer à l'étape suivante si valide
- `reset()` : remettre le configureur à zéro

### 5.3 Validation de l'étape

`isStepValid(step)` vérifie que les champs requis sont remplis :
- `Hüllentyp` : `cfg.huellentyp` non vide
- `Ausstattung` : `cfg.ausstattung` non vide
- `Auflage` : `cfg.auflage > 0`
- `Farbigkeit Hülle` : `cfg.huelleFarbigkeit` non vide
- `Grammatur Anschreiben` / `Farbigkeit Anschreiben` : champs non vides
- `Anzahl Flyer` : `cfg.anzahlFlyer > 0`

### 5.4 Affectation des étapes par accessoires

`hatAnschreiben()`, `hatBroschuere()`, `hatAntwortkarte()`, `hatFlyer()` déterminent si une étape est visible :
- ces getters lisent `selectedAusstattungConfig()` (une configuration issue de l'API)
- si l'accessoire est abscent, les étapes associées sont masquées

### 5.5 Calcul du prix

`getter preis()` appelle `berechnePreis()` (dans `src/lib/kuvertiertesmailingPreis.ts`), passant :
- le slug de la famille (`familieSlug`)
- toutes les options de `cfg`
- les `artikelTarife` et `selectedAusstattungConfig`

Le résultat est une structure de prix (fixe + variable, porto, ...). Un `console.table` est laissé dans le getter pour le débogage.

---

## 6. Données & API

### 6.1 Connexion à l'API

`src/api/client.ts` expose `apiClient<T>(endpoint, options)` qui fait un `fetch` vers `${ENV.API_URL}${endpoint}` avec un header `Content-Type: application/json` et lève une erreur `Erreur API [status]` sur un code non-OK.

`src/config/env.ts` : `ENV.API_URL` se lit de `NEXT_PUBLIC_API_URL`, avec une valeur par défaut en production (`https://backend-production-b4b03.up.railway.app/api`).

### 6.2 Services de données (`src/services/`)

- `tarifeService` — appels `/api/tarife/*` (tous, par catégorie, par groupe produit) et map de prix (`/api/tarife/map/*` : anschreiben, flyer, antwortkarte, broschuere)
- `ausstattungConfigService` — appels `/api/ausstattung-config/*` pour les configurations d'exception (par groupe produit, catégorie, kategorien)

### 6.3 Chargement initial (`loadOptions` du store)

Quand on change de groupe (`setGruppe`), le store charge en parallèle :
- `ausstattungConfigService.getAll()`
- `tarifeService.getAll()`
- `tarifeService.getAnschreibenOptions(A${gruppe})`
- `tarifeService.getFlyerOptions(F${gruppe})`
- `tarifeService.getBroschuereOptions(B${gruppe})`
- `tarifeService.getAntwortkarteOptions(AK${gruppe})`

Les résultats sont normalisés (extraction des grammatur, umfang, etc.) puis stockés dans le store pour alimenter les composants et le calcul de prix.

### 6.4 Types

`src/types/` définit :
- `artikelTarifDetails.ts` — un article tarifaire
- `ausstattungPreisTranche.ts` — configuration d'exception
- `kartenmailer/`, `kuvertiertesMailing/`, `selfmailer/` — structures par famille de produit
- `preisDetails.ts` — résultats de prix
- `staffelPreis.ts` — tranches tarifaires (paliers Fixpreis / Preis o/oo)

---

## 7. Génération des configurations (scripts)

`scripts/generateConfig.mjs` est un script CLI qui lit des fichiers JSON (dans `tmp/`) et écrit une configuration générée dans `src/lib/mailingPreis.ts`. Il calcule notamment des paliers de prix (staffeln) à partir de 2 points de prix (500 et 1000) :

```
Prix500 = fixpreis + 0.5 * preisPro1000
Prix1000 = fixpreis + 1.0 * preisPro1000
→ preisPro1000 = (Prix1000 - Prix500) / 0.5
→ fixpreis = Prix1000 - preisPro1000
```

`scripts/extract-jopke-fensterhuelle*.mjs` extrait des configurations pour les fenêtre-hülle à partir de fichiers JSON projets. `scripts/vergleich-prix-antwortkarte-gruppen.mjs` compare les prix.

> Le script `generateConfig.mjs` affiche la config générée dans la console ; elle est destinée à être copiée/collée dans `mailingPreis.ts` (l'ancienne méthode, toujours utilisée telle quelle).

---

## 8. Design system / CSS

`src/app/theme/` : fichiers CSS partiels pour `buttons.css`, `colors.css`, `sizes.css`, `typography.css`. `src/app/globals.css` est la feuille de style globale. Les composants s'appuient dessus, et Tailwind CSS 4 (via `@tailwindcss/postcss` + `tailwindcss`) est la couche d'utilitaires.

---

## 9. Déploiement

- **Docker** : `frontend/Dockerfile` (Node image, port 3000, `npm run start`).
- **Compose** : `docker-compose.yml` orchestre `backend` + `frontend` (frontend → backend).
- **Production** : l'environnement est injecté (variables `.env`), sur Railway (backend référé par l'URL par défaut).
- **Tests** : Playwright (`tests/`) s'exécute souvent dans un pipeline dédié.

---

## 10. Tests

Répertoire `tests/` : spec Playwright (`inspect-compare.spec.ts`, `inspect-local.spec.ts`, `inspect-webseite.spec.ts`, `playwright*.spec.ts`), un `playwright.config.ts`, et un dossier `test-results/` (output). Le README du workspace indique qu'un `tests/test-results/.last-run.json` peut être ignoré par le `.gitignore` racine (son `node_modules` imbriqué n'est pas stagé).

---

## 11. Conventions & points d'attention

1. **Terminologie allemande** : les noms de fichiers, fonctions et variables sont en allemand (`gültig`, `Kategorie`, `Grammatur`, `Fixpreis`, `Umfang`, `Hülle`). Ne pas les renommer sans coordination.
2. **Quatre familles de mailing** : `Kuvertiertes Mailing`, `Selfmailer`, `Kartenmailing`, et les variantes `Fensterhülle` (extraites par script). Chaque famille peut avoir sa propre logique de prix et de steps.
3. **La config d'exception** (`AusstattungConfig`) est la source de la présence/absence des accessoires (anschreiben, flyer, brochure, réponse-carte) dans le configureur.
4. **Les prix sont calculés côté frontend** mais issus du backend (`berechnePreis` utilise `artikelTarife` et les options API).
5. **Le porto** (`lib/porto.ts`) et `berrechnePreis` incluent une frais additionnel (voir commit `fix: Correct porto variable declaration`); vérifier que cet ajout est cohérent côté backend avant toute modification.
6. **Variables d'environnement sensibles** (`.env`, `.env.local`) : jamais commitées. Seuls `.env.example` (modeste) est versionné.
7. **Le store** est le seul état d'API-clients ; ne pas dupliquer les appels HTTP dans les composants.
8. **SSE/turbopack** : en dev, `next dev --turbopack`; en build, `next build --webpack` (attention aux différences de mode de construction).
9. **Tests** : `tests/` est un environnement de scénario (HTML statique + specs) — ne pas le confondre avec les tests d'unité.
10. **Husky** est activé pour les hooks Git (`.gitignore` + `husky` installé).

---

## 12. Références rapides

| Question | Où chercher |
|---|---|
| Démarrer le frontend | `frontend/README.md` (script `dev`) |
| Architecture | Ce document, sections 3–4 |
| Le configureur | `src/stores/useConfiguratorStore.ts`, `src/data/kuvertiertesMailing.ts` |
| Les types du mailing kuvertiert | `src/types/kuvertiertesMailing/` |
| Les calculs de prix | `src/lib/kuvertiertesmailingPreis.ts`, `src/lib/porto.ts` |
| L'API cliente | `src/api/client.ts`, `src/services/` |
| Les scripts (extract/generate) | `scripts/` |
| Le backend / les API | `backend/README.md` |
| Les tests | `tests/` |

---

*Document généré à partir du dépôt `shop_jopke` (branch `main`) tel qu'il est sur cette machine. Tout ce qui est indiqué comme "confirmé" provient des fichiers du dépôt ; les remarques de configuration (versions Node, `.env`) sont basées sur ce qui est présent et diffusé.*
