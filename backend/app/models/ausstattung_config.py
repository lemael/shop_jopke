from typing import List, Optional
from pydantic import BaseModel

class StaffelTranche(BaseModel):
    min: int
    max: int
    fixpreis: float
    preisPro1000: float
    lz_standard: Optional[str] = None
    lz_express: Optional[str] = None
    aufschlag_express_in_prozent: Optional[float] = None


class AusstattungConfig(BaseModel):
    # Active la compatibilité nom d'attribut / alias pour Pydantic v2
    # model_config = ConfigDict(populate_by_name=True, from_attributes=True)
    produkt_gruppe: Optional[str] = None

    kategorie: Optional[str] = None
    kategorie_beschreibung: Optional[str] = None

    produkt_gruppe_2: Optional[str] = None
    kategorie_2: Optional[str] = None
    kategorie_beschreibung_2: Optional[str] = None

    produkt_gruppe_3: Optional[str] = None
    kategorie_3: Optional[str] = None
    kategorie_beschreibung_3: Optional[str] = None

    produkt_gruppe_4: Optional[str] = None
    kategorie_4: Optional[str] = None

    produkt_nummer: Optional[str] = None
    name: Optional[str] = None
    beschreibung: Optional[str] = None
    pdf: Optional[str] = None

    huelle: Optional[str] = None
    anschreiben: Optional[str] = None
    flyer: Optional[str] = None
    broschuere: Optional[str] = None
    antwortkarte: Optional[str] = None

    endformat: Optional[str] = None
    offenes_format: Optional[str] = None
    umfang: Optional[str] = None

    papier: Optional[str] = None
    grammatur: Optional[str] = None
    oberflaeche: Optional[str] = None

    papier_2: Optional[str] = None
    grammatur_2: Optional[str] = None
    oberflaeche_2: Optional[str] = None

    farbigkeit: Optional[str] = None
    vorderseite: Optional[str] = None
    rueckseite: Optional[str] = None

    verarbeitung: Optional[str] = None
    perforation: Optional[str] = None
    veredelung: Optional[str] = None
    upload: Optional[str] = None

    mindestmenge: Optional[int] = None
    maximalmenge: Optional[int] = None
    # Configuration explicite du champ float
    gewicht_in_g: Optional[float] = None

    mindest_versandklasse: Optional[str] = None


    tranchen: List[StaffelTranche] = []