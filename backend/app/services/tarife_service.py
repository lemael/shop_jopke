import pandas as pd
import re
from typing import List, Dict, Optional
from app.repositories.excel_repository import excel_repository
from app.models.tarife import (
    StaffelTranche,
    AnschreibenPreiseMap,
    FlyerPreiseMap,
    BroschuerePreiseMap,
    AntwortkartePreiseMap,
    ArtikelTarifDetails,
)

class TarifeService:
    def __init__(self, repo=excel_repository):
        self.repo = repo

    def _find_col(self, row: pd.Series, pattern: str) -> Optional[str]:
        """Recherche une colonne par regex insensible aux espaces et à la casse."""
        for col in row.index:
            col_str = str(col)
            if re.search(pattern, col_str, re.IGNORECASE):
                val = row[col]
                if pd.notna(val):
                    val_str = str(val).strip()
                    if val_str and val_str.lower() != "nan":
                        return val_str
        return None

    def _extract_tranchen(self, row: pd.Series) -> List[StaffelTranche]:
        tranchen: List[StaffelTranche] = []
        paliers = [
            (r"Extern.*Fixpreis.*1\s*-\s*5\.000", r"Extern.*Preis o/oo.*1\s*-\s*5\.000", 1, 5000),
            (r"Extern.*Fixpreis.*5\.001\s*-\s*10\.000", r"Extern.*Preis o/oo.*5\.001\s*-\s*10\.000", 5001, 10000),
            (r"Extern.*Fixpreis.*10\.001\s*-\s*50\.000", r"Extern.*Preis o/oo.*10\.001\s*-\s*50\.000", 10001, 50000),
            (r"Extern.*Fixpreis.*50\.001\s*-\s*100\.000", r"Extern.*Preis o/oo.*50\.001\s*-\s*100\.000", 50001, 100000),
        ]

        for fix_pattern, p1000_pattern, min_qty, max_qty in paliers:
            fix_val_str = self._find_col(row, fix_pattern)
            p1000_val_str = self._find_col(row, p1000_pattern)

            if fix_val_str is not None and p1000_val_str is not None:
                try:
                    fix_val = float(fix_val_str.replace(",", "."))
                    p1000_val = float(p1000_val_str.replace(",", "."))
                    tranchen.append(
                        StaffelTranche(
                            min=min_qty,
                            max=max_qty,
                            fixpreis=fix_val,
                            preisPro1000=round(p1000_val, 2),
                        )
                    )
                except ValueError:
                    continue
        return tranchen

    def _map_row_to_details(self, row: pd.Series) -> ArtikelTarifDetails:
        def get_int(pattern: str) -> Optional[int]:
            val = self._find_col(row, pattern)
            if val:
                try:
                    return int(float(val.replace(",", ".")))
                except ValueError:
                    return None
            return None

        def get_float(pattern: str) -> Optional[float]:
            val = self._find_col(row, pattern)
            if val:
                try:
                    return float(val.replace(",", "."))
                except ValueError:
                    return None
            return None

        return ArtikelTarifDetails(
            kategorie=self._find_col(row, r"Kategorie") or "",
            produkt_gruppe=self._find_col(row, r"Produkt-Gruppe"),
            produkt_nummer=self._find_col(row, r"Produkt-Nummer"),
            produkt_name=self._find_col(row, r"Produkt-Name"),
            produkt_beschreibung=self._find_col(row, r"Produkt-Beschreibung"),
            endformat=self._find_col(row, r"Endformat"),
            offenes_format=self._find_col(row, r"Offenes Format"),
            umfang=self._find_col(row, r"Umfang"),
            papier=self._find_col(row, r"Inhalt.*Papier"),
            grammatur=self._find_col(row, r"Inhalt.*Grammatur"),
            oberflaeche=self._find_col(row, r"Inhalt.*Oberfläche"),
            papier_2=self._find_col(row, r"Umschlag.*Papier"),
            grammatur_2=self._find_col(row, r"Umschlag.*Grammatur"),
            oberflaeche_2=self._find_col(row, r"Umschlag.*Oberfläche"),
            farbigkeit=self._find_col(row, r"Farbigkeit"),
            vorderseite=self._find_col(row, r"Vorderseite"),
            rueckseite=self._find_col(row, r"Rückseite"),
            verarbeitung=self._find_col(row, r"Verarbeitung"),
            perforation=self._find_col(row, r"Perforation"),
            upload=self._find_col(row, r"Upload"),
            mindestmenge=get_int(r"Mindestmenge"),
            maximalmenge=get_int(r"Maximalmenge"),
            gewicht_in_g=get_float(r"Gewicht in g"),
            versandklasse=self._find_col(row, r"Versandklasse"),
            tranchen=self._extract_tranchen(row),
        )

    def get_all_artikel_details(self) -> Optional[List[ArtikelTarifDetails]]:
        df = self.repo.get_all()
        if df is None:
            return None
        return [self._map_row_to_details(row) for _, row in df.iterrows()]

    def get_artikel_by_kategorie(self, kategorie: str) -> Optional[List[ArtikelTarifDetails]]:
        df = self.repo.get_all()
        if df is None:
            return None
        
        kat_col = [c for c in df.columns if "Kategorie" in c]
        if not kat_col:
            return []
            
        df_filtered = df[df[kat_col[0]].astype(str).str.contains(kategorie, case=False, na=False)]
        return [self._map_row_to_details(row) for _, row in df_filtered.iterrows()]

    def get_artikel_by_produkt_gruppe(self, produkt_gruppe: str) -> Optional[List[ArtikelTarifDetails]]:
        df = self.repo.get_all()
        if df is None:
            return None
            
        grp_col = [c for c in df.columns if "Produkt-Gruppe" in c]
        if not grp_col:
            return []
            
        df_filtered = df[df[grp_col[0]].astype(str).str.contains(produkt_gruppe, case=False, na=False)]
        return [self._map_row_to_details(row) for _, row in df_filtered.iterrows()]

    # =========================================================================
    # 1. ANSCHREIBEN
    # =========================================================================

    def get_anschreiben_preise_map(self) -> Optional[AnschreibenPreiseMap]:
        """Récupère tous les tarifs Anschreiben par Kategorie."""
        items = self.get_artikel_by_kategorie("Anschreiben")
        return self._build_anschreiben_map(items)

    def get_anschreiben_preise_map_by_produkt_gruppe(self, produkt_gruppe: str) -> Optional[AnschreibenPreiseMap]:
        """Récupère les tarifs Anschreiben filtrés par Produkt-Gruppe."""
        items = self.get_artikel_by_produkt_gruppe(produkt_gruppe)
        return self._build_anschreiben_map(items)

    def _build_anschreiben_map(self, items: Optional[List[ArtikelTarifDetails]]) -> Optional[AnschreibenPreiseMap]:
        if not items:
            return {}

        result: AnschreibenPreiseMap = {}
        for item in items:
            grammatur = item.grammatur or "Standard"
            farbigkeit = item.farbigkeit or "4/0-farbig"

            if grammatur not in result:
                result[grammatur] = {}
            result[grammatur][farbigkeit] = item.tranchen

        return result

    # =========================================================================
    # 2. FLYER
    # =========================================================================

    def get_flyer_preise_map(self) -> Optional[FlyerPreiseMap]:
        """Récupère tous les tarifs Flyer par Kategorie."""
        items = self.get_artikel_by_kategorie("Flyer")
        return self._build_flyer_map(items)

    def get_flyer_preise_map_by_produkt_gruppe(self, produkt_gruppe: str) -> FlyerPreiseMap:
        # 1. On ne récupère QUE les articles appartenant exactement à cette produkt_gruppe
        items = self.get_artikel_by_produkt_gruppe(produkt_gruppe)
        if not items:
            return {}

        result: FlyerPreiseMap = {}
        for item in items:
            # On ne traite que si c'est un flyer
            if item.kategorie and "Flyer" in item.kategorie:
                umfang = item.umfang or "2 Seiten"
                
                # Construction de la clé composite nettoyée (ex: "170 g/m² matt")
                grammatur = item.grammatur or ""
                oberflaeche = item.oberflaeche or ""
                papier_key = f"{grammatur} {oberflaeche}".strip() or "Standard"

                if umfang not in result:
                    result[umfang] = {}
                
                # On n'ajoute la clé QUE si des tranches de prix existent pour cette ligne
                if item.tranchen:
                    result[umfang][papier_key] = item.tranchen

        return result
    # =========================================================================
    # 3. ANTWORTKARTE
    # =========================================================================

    def get_antwortkarte_preise_map(self) -> Optional[AntwortkartePreiseMap]:
        """Récupère tous les tarifs Antwortkarte par Kategorie."""
        items = self.get_artikel_by_kategorie("Antwortkarte")
        return self._build_antwortkarte_map(items)
    def get_antwortkarte_preise_map_by_produkt_gruppe(self, produkt_gruppe: str) -> AntwortkartePreiseMap:
            """Récupère les tarifs Antwortkarte filtrés par Produkt-Gruppe."""
            items = self.get_artikel_by_produkt_gruppe(produkt_gruppe)
            return self._build_antwortkarte_map(items)

    def _build_antwortkarte_map(self, items: Optional[List[ArtikelTarifDetails]]) -> AntwortkartePreiseMap:
        if not items:
            return {}

        result: AntwortkartePreiseMap = {}
        for item in items:
            # 1. Filtrage strict sur la catégorie
            if item.kategorie and "Antwortkarte" in item.kategorie:
                # 2. Clé niveau 1 : Endformat (ex: "210 x 99 mm")
                endformat = item.endformat or "Standard"

                # 3. Clé niveau 2 : Composite Grammatur + Oberflaeche (ex: "170 g/m² matt")
                grammatur = item.grammatur or ""
                oberflaeche = item.oberflaeche or ""
                papier_key = f"{grammatur} {oberflaeche}".strip() or "Standard"

                if endformat not in result:
                    result[endformat] = {}

                # 4. Insertion des tranches de prix uniquement si elles existent
                if item.tranchen:
                    result[endformat][papier_key] = item.tranchen

        return result

    # =========================================================================
    # 4. BROSCHÜRE
    # =========================================================================

    def get_broschuere_preise_map(self) -> Optional[BroschuerePreiseMap]:
        """Récupère tous les tarifs Broschüre par Kategorie."""
        items = self.get_artikel_by_kategorie("Broschüre")
        return self._build_broschuere_map(items)

    def get_broschuere_preise_map_by_produkt_gruppe(self, produkt_gruppe: str) -> Optional[BroschuerePreiseMap]:
        """Récupère les tarifs Broschüre filtrés par Produkt-Gruppe."""
        items = self.get_artikel_by_produkt_gruppe(produkt_gruppe)
        return self._build_broschuere_map(items)

    def _build_broschuere_map(self, items: Optional[List[ArtikelTarifDetails]]) -> Optional[BroschuerePreiseMap]:
        if not items:
            return {}

        result: BroschuerePreiseMap = {}
        for item in items:
            umfang = item.umfang or "Standard"
            papier_key = f"{item.grammatur or ''} / {item.grammatur_2 or ''}".strip(" /") or "Standard"

            if umfang not in result:
                result[umfang] = {}
            result[umfang][papier_key] = item.tranchen

        return result

tarife_service = TarifeService()