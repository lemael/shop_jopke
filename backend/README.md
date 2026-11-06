# Backend — API de tarifs de mailing

Ce dossier contient le backend de l'application `shop_jopke` (partie `backend/` du dépôt).
Il expose une API REST alimentée par un fichier Excel, consommée par le frontend React/Next.js.

## 1. Aperçu technique

| Élément | Valeur |
|---|---|
| Framework | FastAPI (Python 3.12) |
| Serveur d'application | Uvicorn |
| Port | `8000` |
| Données source | Fichier Excel `tarife.xlsx` |
| Langue des données | Allemande (produits, catégories, désignations) |
| Déploiement cible | Docker (Railway) |

## 2. Structure du projet

```text
backend/
  app/
    config.py                  # Chargement .env, chemins, gestion CORS
    main.py                    # Création de l'application FastAPI
    routers/                   # Exposition HTTP (health, tarifs, config)
    controllers/               # Couches d'orchestration (règles métier légères)
    services/                  # Logique de transformation des données
    repositories/              # Lecture et parsing du fichier Excel
    models/                    # Schémas de données Pydantic (API / réponses)
  tarife.xlsx                  # Fichier de données (source unique des tarifs)
  requirements.txt             # Dépendances Python
  Dockerfile                   # Image conteneurisée
  .env                         # Variables d'environnement (à ne pas commiter)
```

### Principe de séparation des couches

- **Repository** (`app/repositories/excel_repository.py`) : lit le fichier Excel
  avec `pandas`, exporte un `DataFrame`. C'est la seule couche qui touche au disque.
- **Service** (`app/services/*.py`) : contient la vraie logique métier :
  extraction des tranches de prix, filtrage par catégorie / produit,
  reconstruction des cartes de tarifs pour le configurateur frontend.
- **Controller** (`app/controllers/*.py`) : orchestre le service, traduit les
  résultats `None` en `HTTPException 500`.
- **Router** (`app/routers/*.py`) : exposition HTTP via FastAPI, avec les
  endpoints et les réponses validées par les modèles Pydantic.

## 3. Configuration

Le fichier `.env` (liste en exclusivité, jamais commité) comprend :

| Variable | Valeur par défaut | Rôle |
|---|---|---|
| `EXCEL_FILE_PATH` | `tarife.xlsx` | Chemin du fichier de données |
| `SHEET_NAME` | `Einzelteile und Beilagen` | Feuille Excel à charger |
| `ALLOWED_ORIGINS` | (CSV) | Origines autorisées pour CORS (`frontend` + `localhost`) |

Le backend est censé tourner avec un environnement de production où `tarife.xlsx`
est monté dans le conteneur et les variables `.env` injectées par l'outil de déploiement.

## 4. Démarrage en local

1. Créer un environnement Python virtuel (Python 3.12 recommandé) :

   ```bash
   python3.12 -m venv .venv
   source .venv/bin/activate
   ```

2. Installer les dépendances :

   ```bash
   pip install -r requirements.txt
   ```

3. Lancer l'application :

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. Vérifier que le service démarre et charge l'Excel :

   ```bash
   curl http://localhost:8000/api/health
   # Réponse attendue : {"status":"ok","excel_loaded":true}
   ```

Le `reload` est actif pour le développement ; en production, démarrer sans
`--reload` (voir `Dockerfile`).

## 5. Container et déploiement

### Dockerfile

- Base : `python:3.12-slim`
- `WORKDIR /app`
- `EXPOSE 8000`
- Commande : `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Variables d'optimisation : `PYTHONDONTWRITEBYTECODE=1`, `PYTHONUNBUFFERED=1`

### docker-compose.yml

Définit deux services :

- `backend` : build du `Dockerfile`, port mappé `8000:8000`, `restart: unless-stopped`
- `frontend` : build du `Dockerfile` frontend, port `3000:80`, `depends_on` le backend

> Note : la ligne `env_file` de `docker-compose.yml` pointe vers un chemin
> incertain (`./backend/ .venv`). À vérifier avant un déploiement : le backend
> attend pluôt un fichier `.env` avec les variables `EXCEL_FILE_PATH`,
> `SHEET_NAME`, `ALLOWED_ORIGINS`.

## 6. Endpoints de l'API

Tout le routing commence par `/api` (prefix `routers`).

### Santé

| Méthode | Chemin | Réponse |
|---|---|---|
| `GET` | `/api/health` | `{"status": "ok", "excel_loaded": bool}` |

### Tarifs de produits

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/tarife/all` | Tous les articles du fichier |
| `GET` | `/api/tarife/kategorie/{kategorie}` | Articles filtrés par catégorie |
| `GET` | `/api/tarife/gruppe/{produkt_gruppe}` | Articles filtrés par groupe produit |

### Cartes de prix pour le configurateur (Next.js)

Les cartes sont des structures imbriquées qui correspondent aux composants de
sélection du frontend. Elles sont construites à partir des tranches de prix
(`tranchen`) des articles.

| Méthode | Chemin | Structure de la réponse |
|---|---|---|
| `GET` | `/api/tarife/map/anschreiben?gruppe=` | `{grammatur: {farbigkeit: [tranches]}}` |
| `GET` | `/api/tarife/map/flyer?gruppe=` | `{umfang: {papier: [tranches]}}` |
| `GET` | `/api/tarife/map/antwortkarte?gruppe=` | `{endformat: {papier: [tranches]}}` |
| `GET` | `/api/tarife/map/broschuere?gruppe=` | `{umfang: {papier: [tranches]}}` |

L'optional `gruppe` filtre les résultats par `produkt_gruppe`.

### Configuration d'exception (AusstattungConfig)

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/ausstattung-config/all` | Toutes les configurations |
| `GET` | `/api/ausstattung-config/kategorie/{kategorie}` | Filtre par catégorie |
| `GET` | `/api/ausstattung-config/gruppe/{produkt_gruppe}` | Filtre par groupe produit |

## 7. Les données : `tarife.xlsx`

Le fichier Excel est la source unique de la donnée tarifaire.

- Lecture : `pd.read_excel(..., header=[1, 2])` — les en-têtes sont sur **deux
  lignes**. Elles sont fusionnées en noms de colonnes du type
  `Kategorie - Produkt-Name`, `Inhalt - Papier`, `Umschlag - Grammatur`, etc.
- Les colonnes fusionnées sont nettoyées (retraits de lignes, suppression des
  noms temporaires `Unnamed`).
- Les lignes entièrement vides sont retirées.
- Les valeurs textuelles sont trimées.

### Tranches de prix (`tranchen`)

Plutôt que des colonnes répétées `Fixpreis` / `Preis o/oo` pour chaque palier,
les données sont modélisées en **tranches** représentées par le modèle
`StaffelTranche` :

```python
class StaffelTranche(BaseModel):
    min: int        # Quantité minimale de la palière
    max: int        # Quantité maximale de la palière
    fixpreis: float # Prix fixe pour la quantité
    preisPro1000: float  # Prix au tranche de 1000
```

Les paliers attendus sont 1–5000, 5001–10000, 10001–50000, 50001–100000. Le
service extrait, pour chaque ligne, la colonne `Fixpreis` et la colonne `Preis o/oo`
correspondantes, et les convertit en `StaffelTranche`.

## 8. Conversion des nombres

Les fichiers d'export allemands utilisent la virgule comme séparateur décimal
(`1.234,56`). Le service normalise ces valeurs avec une méthode `_parse_float_value`
(et `_get_float` pour les colonnes numériques) qui remplace la virgule par un point
et gère les formats insectés (`1.000`, `1,000`, `1,234.56`).

## 9. Modèles Pydantic (réponses)

Models exposés dans les réponses JSON :

- `ArtikelTarifDetails` — un article tarifaire complet (produit, spécifications
  papier, quantités, tranches de prix).
- `StaffelTranche` — détail d'une palière tarifaire.
- `AnschreibenPreiseMap`, `FlyerPreiseMap`, `AntwortkartePreiseMap`,
  `BroschuerePreiseMap` — types d'alias pour les cartes de prix.
- `AusstattungConfig` — configuration d'exception avec ses propres spécifications.

## 10. Points d'attention

- Le fichier `.env` contient des données sensibles (origines, éventuellement des
  clés) : ne jamais le commiter. En production, l'environnement est injecté par
  l'outil de déploiement.
- Le contenu total de l'Excel est chargé en mémoire à chaque démarrage. Le
  service met en cache les résultats après la première lecture d'une feuille.
- Les noms de fichiers et de variables sont en allemand dans le code
  (`Einzelteile und Beilagen`, `Produkt-Nummer`, `Grammatur`, `Fixpreis`…).
  Personne d'autre sur l'équipe doit les renommer sans accepter la casse
  allemande.
