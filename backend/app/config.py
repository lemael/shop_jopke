# Variables de configuration (ex: chemin Excel)

from pathlib import Path
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Charger le fichier .env
load_dotenv(BASE_DIR / ".env")
# Définition des variables avec valeurs de secours (fallbacks)
EXCEL_FILE_PATH = BASE_DIR / os.getenv("EXCEL_FILE_PATH", "tarife.xlsx")
SHEET_NAME = os.getenv("SHEET_NAME", "Einzelteile und Beilagen")

# Gérer la liste des origines autorisées (séparées par une virgule)
origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
ALLOWED_ORIGINS = [origin.strip() for origin in origins_str.split(",") if origin.strip()]