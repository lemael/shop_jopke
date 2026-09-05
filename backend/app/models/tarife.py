from pydantic import BaseModel
from typing import Dict, List, Optional

class StaffelTranche(BaseModel):
    min: int
    max: int
    fixpreis: float
    preisPro1000: float
    abweichende_lz_standard: Optional[str] = None
    abweichende_lz_express: Optional[str] = None

class ArtikelTarifDetails(BaseModel):
    # Informations produit
    kategorie: str
    produkt_gruppe: Optional[str] = None
    produkt_nummer: Optional[str] = None
    produkt_name: Optional[str] = None
    produkt_beschreibung: Optional[str] = None

    # Formats et spécifications papier
    endformat: Optional[str] = None
    offenes_format: Optional[str] = None
    umfang: Optional[str] = None
    papier: Optional[str] = None
    grammatur: Optional[str] = None
    oberflaeche: Optional[str] = None
    
    # Secondes spécifications papier (ex: Umschlag / Inhalt)
    papier_2: Optional[str] = None
    grammatur_2: Optional[str] = None
    oberflaeche_2: Optional[str] = None

    # Impression et verarbeitung
    farbigkeit: Optional[str] = None
    vorderseite: Optional[str] = None
    rueckseite: Optional[str] = None
    verarbeitung: Optional[str] = None
    perforation: Optional[str] = None
    upload: Optional[str] = None

    # Quantités, logistique et frais
    mindestmenge: Optional[int] = None
    maximalmenge: Optional[int] = None
    gewicht_in_g: Optional[float] = None
    versandklasse: Optional[str] = None

    # Tranches de prix (remplace les colonnes répétitives Fixpreis / Preis o/oo)
    tranchen: List[StaffelTranche]
# Type Aliases requis par tarife_service.py
AnschreibenPreiseMap = Dict[str, Dict[str, List[StaffelTranche]]]
FlyerPreiseMap = Dict[str, Dict[str, List[StaffelTranche]]]
AntwortkartePreiseMap = Dict[str, Dict[str, List[StaffelTranche]]]
BroschuerePreiseMap = Dict[str, Dict[str, List[StaffelTranche]]]