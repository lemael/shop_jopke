import re
from typing import Dict, List, Optional, Tuple
import pandas as pd

from app.models.ausstattung_config import AusstattungConfig, StaffelTranche
from app.repositories.ausstattung_config_repository import (
    ausstattung_config_repository,
)


class AusstattungConfigService:
    """Service de traitement et de cartographie des configurations d'équipement (AusstattungConfig)."""

    PALIER_PATTERNS: List[Tuple[str, str, str, str, str, int, int]] = [
        (
            r"Extern\s*-\s*Fixpreis\s*1\.?\s*-\s*5\.000",
            r"Extern\s*-\s*Preis\s*o/oo\s*1\.?\s*-\s*5\.000",
            r"Extern\s*-\s*LZ\s*Standard$",
            r"Extern\s*-\s*LZ\s*Express$",
            r"Extern\s*-\s*Aufschlag\s*Express\s*in\s*%$",
            1,
            5000,
        ),
        (
            r"Extern\s*-\s*Fixpreis\s*5\.001\s*-\s*10\.000",
            r"Extern\s*-\s*Preis\s*o/oo\s*5\.001\s*-\s*10\.000",
            r"Extern\s*-\s*LZ\s*Standard\.1$",
            r"Extern\s*-\s*LZ\s*Express\.1$",
            r"Extern\s*-\s*Aufschlag\s*Express\s*in\s*%\.1$",
            5001,
            10000,
        ),
        (
            r"Extern\s*-\s*Fixpreis\s*10\.001\s*-\s*50\.000",
            r"Extern\s*-\s*Preis\s*o/oo\s*10\.001\s*-\s*50\.000",
            r"Extern\s*-\s*LZ\s*Standard\.2$",
            r"Extern\s*-\s*LZ\s*Express\.2$",
            r"Extern\s*-\s*Aufschlag\s*Express\s*in\s*%\.2$",
            10001,
            50000,
        ),
        (
            r"Extern\s*-\s*Fixpreis\s*50\.001\s*-\s*100\.000",
            r"Extern\s*-\s*Preis\s*o/oo\s*50\.001\s*-\s*100\.000",
            r"Extern\s*-\s*LZ\s*Standard\.3$",
            r"Extern\s*-\s*LZ\s*Express\.3$",
            r"Extern\s*-\s*Aufschlag\s*Express\s*in\s*%\.3$",
            50001,  # Corrigé de 5001 -> 50001
            100000,
        ),
    ]

    def __init__(self, repo=ausstattung_config_repository):
        self.repo = repo
        self._column_cache: Dict[Tuple[str, ...], Dict[str, List[str]]] = {}
        self._items_cache_df_id: Optional[int] = None
        self._items_cache: Optional[List[AusstattungConfig]] = None

    def _matching_columns(self, row: pd.Series, pattern: str) -> List[str]:
        columns = tuple(str(column) for column in row.index)
        mappings = self._column_cache.setdefault(columns, {})
        if pattern not in mappings:
            regex = re.compile(pattern, re.IGNORECASE)
            mappings[pattern] = [
                column
                for column in row.index
                if regex.search(self._clean_col_name(column))
            ]
        return mappings[pattern]

    def get_all(self) -> Optional[List[AusstattungConfig]]:
        df = self.repo.get_all()
        if df is None:
            return None

        if self._items_cache_df_id == id(df):
            return self._items_cache

        result = []
        for _, row in df.iterrows():
            try:
                mapped = self._map_row(row)
                if mapped:
                    result.append(mapped)
            except Exception as e:
                print(f"⚠️ Erreur de mapping sur une ligne : {e}")
                continue
        self._items_cache_df_id = id(df)
        self._items_cache = result
        return result

    def get_by_kategorie(self, kategorie: str) -> Optional[List[AusstattungConfig]]:
        all_items = self.get_all()
        if all_items is None:
            return None
        return [item for item in all_items if item.kategorie == kategorie]

    def get_by_produkt_gruppe(self, produkt_gruppe: str) -> Optional[List[AusstattungConfig]]:
        all_items = self.get_all()
        if all_items is None:
            return None
        return [item for item in all_items if item.produkt_gruppe == produkt_gruppe]

    def _map_row(self, row: pd.Series) -> AusstattungConfig:
        poids_val = self._get_float(row, r"Gewicht\s*in\s*g")

        return AusstattungConfig(
            produkt_gruppe=self._find_col(row, r"Produkt-Gruppe\s*1$"),
            kategorie=self._find_col(row, r"^Kategorie$"),
            kategorie_beschreibung=self._find_col(row, r"^Kategorie-Beschreibung$"),
            produkt_gruppe_2=self._find_col(row, r"Produkt-Gruppe\s*2$"),
            kategorie_2=self._find_col(row, r"^Kategorie\s*2$"),
            kategorie_beschreibung_2=self._find_col(row, r"^Kategorie-Beschreibung\s*2$"),
            produkt_gruppe_3=self._find_col(row, r"Produkt-Gruppe\s*3$"),
            kategorie_3=self._find_col(row, r"^Kategorie\s*3$"),
            kategorie_beschreibung_3=self._find_col(row, r"^Kategorie-Beschreibung\s*3$"),
            produkt_gruppe_4=self._find_col(row, r"Produkt-Gruppe\s*4$"),
            kategorie_4=self._find_col(row, r"Kategorie\s*4$"),
            produkt_nummer=self._find_col(row, r"Produkt-Nummer$"),
            name=self._find_col(row, r"Name$"),
            beschreibung=self._find_col(row, r"Beschreibung$"),
            pdf=self._find_col(row, r"PDF$"),
            huelle=self._find_col(row, r"Hülle$"),
            anschreiben=self._find_col(row, r"Anschreiben$"),
            flyer=self._find_col(row, r"Flyer$"),
            broschuere=self._find_col(row, r"Broschüre$"),
            antwortkarte=self._find_col(row, r"Antwortkarte$"),
            endformat=self._find_col(row, r"Endformat:?$"),
            offenes_format=self._find_col(row, r"Offenes Format:?$"),
            umfang=self._find_col(row, r"Umfang:?$"),
            papier=self._find_col(row, r"Inhalt\s*-\s*Papier:?$"),
            grammatur=self._find_col(row, r"Inhalt\s*-\s*Grammatur:?$"),
            oberflaeche=self._find_col(row, r"Inhalt\s*-\s*Oberfläche:?$"),
            papier_2=self._find_col(row, r"Umschlag\s*-\s*Papier:?$"),
            grammatur_2=self._find_col(row, r"Umschlag\s*-\s*Grammatur:?$"),
            oberflaeche_2=self._find_col(row, r"Umschlag\s*-\s*Oberfläche:?$"),
            farbigkeit=self._find_col(row, r"Umschlag\s*-\s*Farbigkeit:?$"),
            vorderseite=self._find_col(row, r"Umschlag\s*-\s*Vorderseite:?$"),
            rueckseite=self._find_col(row, r"Umschlag\s*-\s*Rückseite:?$"),
            verarbeitung=self._find_col(row, r"Umschlag\s*-\s*Verarbeitung:?$"),
            perforation=self._find_col(row, r"Umschlag\s*-\s*Perforation:?$"),
            veredelung=self._find_col(row, r"Umschlag\s*-\s*Veredelung:?$"),
            upload=self._find_col(row, r"Umschlag\s*-\s*Upload$"),
            mindestmenge=self._get_int(row, r"Umschlag\s*-\s*Mindestmenge$"),
            maximalmenge=self._get_int(row, r"Umschlag\s*-\s*Maximalmenge$"),
            gewicht_in_g=poids_val,
            mindest_versandklasse=self._find_col(
                row,
                r"Versandklasse zur Einordnung der Produktgröße\s*-\s*Mindest-Versandklasse$",
            ),
            lz_standard=self._find_col(row, r"^Extern\s*-\s*LZ\s*Standard$"),
            lz_express=self._find_col(row, r"^Extern\s*-\s*LZ\s*Express$"),
            tranchen=self._extract_tranchen(row),
        )

    def _extract_tranchen(self, row: pd.Series) -> List[StaffelTranche]:
        tranchen: List[StaffelTranche] = []

        for (
            fix_pat,
            p1000_pat,
            lz_std_pat,
            lz_exp_pat,
            aufschlag_pat,
            min_qty,
            max_qty,
        ) in self.PALIER_PATTERNS:

            fix_val_str = self._find_col(row, fix_pat)
            p1000_val_str = self._find_col(row, p1000_pat)

            if not fix_val_str or not p1000_val_str:
                continue

            try:
                fix_val = self._parse_float_value(fix_val_str)
                p1000_val = self._parse_float_value(p1000_val_str)

                lz_std = self._find_col(row, lz_std_pat)
                lz_exp = self._find_col(row, lz_exp_pat)
                aufschlag_str = self._find_col(row, aufschlag_pat)

                aufschlag_val = None
                if aufschlag_str:
                    try:
                        aufschlag_val = self._parse_float_value(aufschlag_str)
                    except (ValueError, TypeError):
                        aufschlag_val = None

                tranchen.append(
                    StaffelTranche(
                        min=min_qty,
                        max=max_qty,
                        fixpreis=fix_val,
                        preisPro1000=round(p1000_val, 2),
                        lz_standard=lz_std,
                        lz_express=lz_exp,
                        aufschlag_express_in_prozent=aufschlag_val,
                    )
                )

            except Exception:
                continue

        return tranchen

    def _find_col(self, row: pd.Series, pattern: str) -> Optional[str]:
        for column in self._matching_columns(row, pattern):
            value = row[column]
            if pd.notna(value):
                value_str = str(value).strip()
                if value_str and value_str.lower() != "nan":
                    return value_str

        return None

    def _get_int(self, row: pd.Series, pattern: str) -> Optional[int]:
        val = self._find_col(row, pattern)
        if not val:
            return None

        try:
            cleaned = re.sub(r"[^\d.,]", "", val)
            if not cleaned:
                return None

            if "," in cleaned and "." in cleaned:
                if cleaned.rfind(",") > cleaned.rfind("."):
                    cleaned = cleaned.replace(".", "").replace(",", ".")
                else:
                    cleaned = cleaned.replace(",", "")
            elif "," in cleaned:
                cleaned = cleaned.replace(",", ".")
            elif "." in cleaned:
                parts = cleaned.split(".")
                if len(parts) == 2 and len(parts[1]) == 3:
                    cleaned = "".join(parts)

            return int(float(cleaned))

        except (ValueError, TypeError):
            return None

    def _get_float(self, row: pd.Series, pattern: str) -> Optional[float]:
        for column in self._matching_columns(row, pattern):
            raw_value = row[column]

            if pd.isna(raw_value):
                continue

            if isinstance(raw_value, (float, int)):
                return float(raw_value)

            value = str(raw_value).strip()
            if not value or value.lower() == "nan":
                continue

            try:
                cleaned = value.replace(",", ".")
                match = re.search(r"\d+(?:\.\d+)?", cleaned)
                if match:
                    return float(match.group(0))

            except ValueError:
                continue

        return None

    @staticmethod
    def _clean_col_name(col_name: object) -> str:
        return re.sub(r"[\xa0\s\n\r]+", " ", str(col_name)).strip()

    @staticmethod
    def _parse_float_value(value: str) -> float:
        cleaned = str(value).strip()
        cleaned = re.sub(r"[^\d,.]", "", cleaned)

        if not cleaned:
            raise ValueError("Keine Zahl gefunden")

        if "," in cleaned and "." in cleaned:
            if cleaned.rfind(",") > cleaned.rfind("."):
                cleaned = cleaned.replace(".", "").replace(",", ".")
            else:
                cleaned = cleaned.replace(",", "")
        elif "," in cleaned:
            cleaned = cleaned.replace(",", ".")

        return float(cleaned)


ausstattung_config_service = AusstattungConfigService()