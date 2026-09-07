import os
from pathlib import Path
from dotenv import load_dotenv

# Revenir à la racine absolue de l'application (/app)
# Si ce fichier est dans app/core/config.py -> 3 fois .parent (app/core -> app -> /app)
# Si ce fichier est dans app/config.py -> 2 fois .parent
BASE_DIR = Path(__file__).resolve().parent.parent

# Charger le .env seulement s'il existe (évite de bloquer en prod)
env_file = BASE_DIR / ".env"
if env_file.exists():
    load_dotenv(env_file)

# Définir le chemin d'accès vers le fichier Excel à la racine du conteneur (/app/tarife.xlsx)
excel_filename = os.getenv("EXCEL_FILE_PATH", "tarife.xlsx")

# Si le chemin spécifié est absolu, on le garde, sinon on le lie à BASE_DIR
EXCEL_FILE_PATH = Path(excel_filename) if Path(excel_filename).is_absolute() else BASE_DIR / excel_filename

SHEET_NAME = os.getenv("SHEET_NAME", "Einzelteile und Beilagen")

# Gestion propre des origines CORS
origins_str = os.getenv(
    "ALLOWED_ORIGINS", 
    "https://frontend-production-d09b.up.railway.app,http://localhost:3000,http://localhost:5173"
)
ALLOWED_ORIGINS = [origin.strip() for origin in origins_str.split(",") if origin.strip()]