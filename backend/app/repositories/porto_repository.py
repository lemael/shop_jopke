import logging
import re
from pathlib import Path
from typing import List, Optional, TypedDict

import openpyxl

from app.config import EXCEL_FILE_PATH

logger = logging.getLogger(__name__)


class PortoZeile(TypedDict):
    versandklasse: str
    beschreibung: str
    gewicht_min_g: float
    gewicht_max_g: float
    tarif: float


class PortoRepository:
    """Lit la feuille « Porto » de tarife.xlsx (tarifs Dialogpost par Versandklasse)."""

    SHEET_NAME = "Porto"
    # Valeur de secours si le texte "Zuschlag = 0,18 EUR je Sdg." n'est pas trouvé.
    EASY_ZUSCHLAG_PAR_DEFAUT = 0.18

    def __init__(self, file_path: str = str(EXCEL_FILE_PATH), sheet_name: str = SHEET_NAME):
        self.file_path = file_path
        self.sheet_name = sheet_name
        self._zeilen: Optional[List[PortoZeile]] = None
        self._easy_zuschlag: float = self.EASY_ZUSCHLAG_PAR_DEFAUT
        self.load_data()

    def load_data(self) -> Optional[List[PortoZeile]]:
        if not Path(self.file_path).exists():
            logger.error(f"Fichier Excel introuvable à l'emplacement : {self.file_path}")
            print(f"❌ ERROR: Fichier introuvable à l'emplacement : {self.file_path}")
            return None

        try:
            wb = openpyxl.load_workbook(self.file_path, data_only=True, read_only=True)
            ws = wb[self.sheet_name]

            zeilen: List[PortoZeile] = []
            for row in ws.iter_rows(values_only=True):
                libelle, gewicht, tarif = (list(row) + [None, None, None])[:3]

                # Lignes de tarif : "A = Karte Standard (1) bis 235 x 125 x 0,5 mm" | "bis 20" | 0.36
                match = re.match(r"^\s*([A-Z])\s*=\s*(.+)$", str(libelle or ""))
                if match and isinstance(tarif, (int, float)):
                    gewicht_min, gewicht_max = self._parse_gewicht(str(gewicht))
                    zeilen.append(
                        PortoZeile(
                            versandklasse=match.group(1),
                            beschreibung=match.group(2).strip(),
                            gewicht_min_g=gewicht_min,
                            gewicht_max_g=gewicht_max,
                            tarif=float(tarif),
                        )
                    )
                    continue

                # Ligne Dialogpost Easy : "Zuschlag = 0,18 EUR je Sdg."
                zuschlag = re.search(r"Zuschlag\s*=\s*([\d.,]+)", str(gewicht or ""))
                if zuschlag:
                    self._easy_zuschlag = float(zuschlag.group(1).replace(",", "."))

            wb.close()

            if not zeilen:
                print(f"❌ ERROR: Aucune Versandklasse trouvée dans la feuille '{self.sheet_name}'")
                return None

            self._zeilen = zeilen
            print(f"--- PORTO : {len(zeilen)} Versandklassen chargées, Easy-Zuschlag {self._easy_zuschlag} € ---")
            return self._zeilen

        except Exception as e:
            print(f"Erreur lors du chargement de la feuille '{self.sheet_name}': {e}")
            self._zeilen = None
            return None

    @staticmethod
    def _parse_gewicht(texte: str) -> tuple[float, float]:
        """'bis 20' -> (0, 20) ; '21 - 50' -> (21, 50) ; '501 - 1.000' -> (501, 1000)."""
        nombres = [float(n.replace(".", "")) for n in re.findall(r"\d[\d.]*", texte)]
        if len(nombres) >= 2:
            return nombres[0], nombres[1]
        if len(nombres) == 1:
            return 0.0, nombres[0]
        raise ValueError(f"Poids illisible dans la feuille Porto : {texte!r}")

    def get_all(self) -> Optional[List[PortoZeile]]:
        return self._zeilen

    def get_easy_zuschlag(self) -> float:
        return self._easy_zuschlag

    def is_loaded(self) -> bool:
        return self._zeilen is not None


porto_repository = PortoRepository()
