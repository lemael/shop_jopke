import pandas as pd
from typing import Optional
from app.config import EXCEL_FILE_PATH, SHEET_NAME

class ExcelRepository:
    def __init__(self, file_path: str = str(EXCEL_FILE_PATH), sheet_name: str = SHEET_NAME):
        self.file_path = file_path
        self.sheet_name = sheet_name
        self._df: Optional[pd.DataFrame] = None
        self.load_data()

    def load_data(self) -> Optional[pd.DataFrame]:
        try:
            # 1. Utiliser header=[1, 2] pour fusionner la ligne supérieure et la ligne inférieure des entêtes
            df = pd.read_excel(self.file_path, sheet_name=self.sheet_name, header=[1, 2])
            
            # 2. Combiner les 2 niveaux d'entêtes en nettoyant les Unnamed et retours à la ligne
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

            # 3. Supprimer les lignes complètement vides
            df = df.dropna(how="all")

            # 4. Nettoyer les valeurs texte
            string_cols = df.select_dtypes(include=["object"]).columns
            df[string_cols] = df[string_cols].apply(lambda x: x.str.strip() if hasattr(x, "str") else x)

            print("--- NOMS DE COLONNES COMBINÉS ET PROPRES ---")
            print(list(df.columns))
            print("--- PREMIÈRE LIGNE DE DONNÉES RÉELLES ---")
            print(df.head(1))
            print("-------------------------------------------")

            self._df = df
            return self._df
        except Exception as e:
            print(f"Erreur lors du chargement de la feuille '{self.sheet_name}': {e}")
            self._df = None
            return None

    def get_all(self) -> Optional[pd.DataFrame]:
        return self._df

    def is_loaded(self) -> bool:
        return self._df is not None

excel_repository = ExcelRepository()