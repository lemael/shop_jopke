from typing import List, Optional
from fastapi import APIRouter, Query
from app.controllers.tarife_controller import tarife_controller
from app.models.tarife import (
    ArtikelTarifDetails,
    AnschreibenPreiseMap,
    FlyerPreiseMap,
    AntwortkartePreiseMap,
    BroschuerePreiseMap,
)

router = APIRouter(prefix="/api/tarife", tags=["Tarife"])

@router.get("/all", response_model=List[ArtikelTarifDetails])
def get_all():
    return tarife_controller.get_all_artikel()

@router.get("/kategorie/{kategorie_name}", response_model=List[ArtikelTarifDetails])
def get_by_kategorie(kategorie_name: str):
    return tarife_controller.get_by_kategorie(kategorie_name)

@router.get("/gruppe/{produkt_gruppe}", response_model=List[ArtikelTarifDetails])
def get_by_produkt_gruppe(produkt_gruppe: str):
    return tarife_controller.get_by_produkt_gruppe(produkt_gruppe)

# Maps spécifiques au configurateur Next.js (avec support optionnel du filtrage par produkt_gruppe)
@router.get("/map/anschreiben", response_model=AnschreibenPreiseMap)
def get_anschreiben_map(produkt_gruppe: Optional[str] = Query(None)):
    if produkt_gruppe:
        return tarife_controller.get_anschreiben_map_by_produkt_gruppe(produkt_gruppe)
    return tarife_controller.get_anschreiben_map()

@router.get("/map/flyer", response_model=FlyerPreiseMap)
def get_flyer_map(produkt_gruppe: Optional[str] = Query(None)):
    if produkt_gruppe:
        return tarife_controller.get_flyer_map_by_produkt_gruppe(produkt_gruppe)
    return tarife_controller.get_flyer_map()

@router.get("/map/antwortkarte", response_model=AntwortkartePreiseMap)
def get_antwortkarte_map(produkt_gruppe: Optional[str] = Query(None)):
    if produkt_gruppe:
        return tarife_controller.get_antwortkarte_map_by_produkt_gruppe(produkt_gruppe)
    return tarife_controller.get_antwortkarte_map()

@router.get("/map/broschuere", response_model=BroschuerePreiseMap)
def get_broschuere_map(produkt_gruppe: Optional[str] = Query(None)):
    if produkt_gruppe:
        return tarife_controller.get_broschuere_map_by_produkt_gruppe(produkt_gruppe)
    return tarife_controller.get_broschuere_map()