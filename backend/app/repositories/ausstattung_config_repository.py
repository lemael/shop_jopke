import re
from typing import Optional
import pandas as pd

from app.config import EXCEL_FILE_PATH


class AusstattungConfigRepository:
    SHEET_NAME = "Hauptartikel & Vorauswahl"

    def __init__(
        self,
        file_path: str = str(EXCEL_FILE_PATH),
        sheet_name: str = SHEET_NAME
    ):
        self.file_path = file_path
        self.sheet_name = sheet_name
        self._df: Optional[pd.DataFrame] = None
        self.load_data()

    def load_data(self) -> Optional[pd.DataFrame]:
        # Vérification préalable de l'existence du fichier
        if not Path(self.file_path).exists():
            logger.error(f"Fichier Excel introuvable à l'emplacement : {self.file_path}")
            print(f"❌ ERROR: Fichier introuvable à l'emplacement : {self.file_path}")
            return None
        try:
            # 1. Lecture avec double en-tête
            df = pd.read_excel(
                self.file_path,
                sheet_name=self.sheet_name,
                header=[1, 2]
            )

            # 2. Combiner et nettoyer les noms de colonnes
            new_columns = []
            for col in df.columns:
                top = str(col[0]).replace("\n", " ").strip() if "Unnamed:" not in str(col[0]) else ""
                bottom = str(col[1]).replace("\n", " ").strip() if "Unnamed:" not in str(col[1]) else ""

                if top and bottom:
                    new_columns.append(f"{top} - {bottom}")
                elif bottom:
                    new_columns.append(bottom)
                elif top:
                    new_columns.append(top)
                else:
                    new_columns.append("")

            df.columns = new_columns

            # 3. Supprimer les lignes entièrement vides
            df = df.dropna(how="all")

            # 4. Nettoyage des chaînes de caractères (espaces inutiles)
            string_cols = df.select_dtypes(include=["object"]).columns
            df[string_cols] = df[string_cols].apply(
                lambda x: x.str.strip() if hasattr(x, "str") else x
            )

            # 5. NETTOYAGE TOLÉRANT (Casse, espaces, tirets multiples/spéciaux)
            pattern = r"^zeilen[\s\-_–—]*vorlage$"

            first_col = df.columns[0]
            if first_col:
                mask_vorlage = df[first_col].astype(str).str.contains(
                    pattern, regex=True, flags=re.IGNORECASE, na=False
                )
                df = df[~mask_vorlage]

            self._df = df
            
            # Affichage automatique au chargement
            self.print_column_titles()

            return self._df

        except Exception as e:
            print(f"Erreur lors du chargement de la feuille '{self.sheet_name}': {e}")
            self._df = None
            return None

    def get_all(self) -> Optional[pd.DataFrame]:
        return self._df

    def is_loaded(self) -> bool:
        return self._df is not None

    def print_column_titles(self):
        if self._df is not None:
            print("--- TITRES DES COLONNES CHARGÉES ---")
            print(list(self._df.columns))
            print("------------------------------------")


ausstattung_config_repository = AusstattungConfigRepository()