from typing import List

from fastapi import APIRouter, HTTPException

from app.controllers.ausstattung_config_controller import (
    ausstattung_config_controller
)

from app.models.ausstattung_config import AusstattungConfig


router = APIRouter(
    prefix="/api/ausstattung-config",
    tags=["Ausstattung Config"]
)


@router.get(
    "/all",
    response_model=List[AusstattungConfig]
)
def get_all():
    return ausstattung_config_controller.get_all()

def get_all():
    try:
        data = ausstattung_config_controller.get_all()
        if data is None:
            raise HTTPException(
                status_code=500,
                detail="Impossible de lire les données du fichier Excel. Vérifiez les logs backend."
            )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get(
    "/kategorie/{kategorie_name}",
    response_model=List[AusstattungConfig]
)
def get_by_kategorie(kategorie_name: str):
    return ausstattung_config_controller.get_by_kategorie(
        kategorie_name
    )


@router.get(
    "/gruppe/{produkt_gruppe}",
    response_model=List[AusstattungConfig]
)
def get_by_produkt_gruppe(produkt_gruppe: str):
    return ausstattung_config_controller.get_by_produkt_gruppe(
        produkt_gruppe
    )