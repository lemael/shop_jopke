from typing import Optional

from fastapi import APIRouter, Query

from app.controllers.porto_controller import porto_controller
from app.models.porto import PortoBerechnung, PortoKonfiguration

router = APIRouter(prefix="/api/porto", tags=["Porto"])


@router.get("/regeln", response_model=PortoKonfiguration)
def get_regeln():
    """Tarifs par Versandklasse (feuille « Porto » de tarife.xlsx + supplément jopke.de)."""
    return porto_controller.get_konfiguration()


@router.get("/berechnen", response_model=PortoBerechnung)
def berechnen(
    auflage: int = Query(..., gt=0, description="Nombre de Sendungen"),
    gewicht_g: float = Query(..., ge=0, description="Poids d'une Sendung en g"),
    versandklasse: Optional[str] = Query(
        None, description="Mindest-Versandklasse de l'article (A–H)"
    ),
):
    return porto_controller.berechne(auflage, gewicht_g, versandklasse)
