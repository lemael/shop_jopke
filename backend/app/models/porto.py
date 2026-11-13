from typing import List, Literal

from pydantic import BaseModel


class PortoRegel(BaseModel):
    """Une ligne de la feuille « Porto » de tarife.xlsx (une Versandklasse)."""

    versandklasse: str
    beschreibung: str
    gewicht_min_g: float
    gewicht_max_g: float

    # Tarif tel qu'il figure dans l'Excel (Dialogpost ab 5.000 Sdg.).
    tarif_excel: float
    # Tarif appliqué = tarif Excel + supplément jopke.de.
    tarif: float
    # Tarif Dialogpost Easy (petites quantités) = tarif + Easy-Zuschlag.
    tarif_easy: float
    # Dès cette quantité, il est moins cher de payer pour 5.000 Sendungen.
    ab_auflage_aufzahlung: int


class PortoKonfiguration(BaseModel):
    easy_zuschlag: float
    aufschlag_jopke: float
    mindestauflage_dialogpost: int
    regeln: List[PortoRegel]


class PortoBerechnung(BaseModel):
    auflage: int
    gewicht_g: float
    versandklasse: str
    modus: Literal["easy", "aufzahlung", "dialogpost"]
    tarif_pro_stueck: float
    porto: float
