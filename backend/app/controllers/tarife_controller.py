from typing import List, Optional
from fastapi import HTTPException
from app.services.tarife_service import tarife_service
from app.models.tarife import (
    ArtikelTarifDetails,
    AnschreibenPreiseMap,
    FlyerPreiseMap,
    AntwortkartePreiseMap,
    BroschuerePreiseMap,
)

class TarifeController:
    def __init__(self, service=tarife_service):
        self.service = service

    def get_all_artikel(self) -> List[ArtikelTarifDetails]:
        artikel = self.service.get_all_artikel_details()
        if artikel is None:
            raise HTTPException(status_code=500, detail="Fichier Excel indisponible ou illisible")
        return artikel

    def get_by_kategorie(self, kategorie: str) -> List[ArtikelTarifDetails]:
        artikel = self.service.get_artikel_by_kategorie(kategorie)
        if artikel is None:
            raise HTTPException(status_code=500, detail="Fichier Excel indisponible ou illisible")
        return artikel

    def get_by_produkt_gruppe(self, produkt_gruppe: str) -> List[ArtikelTarifDetails]:
        artikel = self.service.get_artikel_by_produkt_gruppe(produkt_gruppe)
        if artikel is None:
            raise HTTPException(status_code=500, detail="Fichier Excel indisponible ou illisible")
        return artikel

    # --- Maps globales pour le configurateur frontend ---

    def get_anschreiben_map(self) -> AnschreibenPreiseMap:
        data = self.service.get_anschreiben_preise_map()
        if data is None:
            raise HTTPException(status_code=500, detail="Données Anschreiben indisponibles")
        return data

    def get_flyer_map(self) -> FlyerPreiseMap:
        data = self.service.get_flyer_preise_map()
        if data is None:
            raise HTTPException(status_code=500, detail="Données Flyer indisponibles")
        return data

    def get_antwortkarte_map(self) -> AntwortkartePreiseMap:
        data = self.service.get_antwortkarte_preise_map()
        if data is None:
            raise HTTPException(status_code=500, detail="Données Antwortkarte indisponibles")
        return data

    def get_broschuere_map(self) -> BroschuerePreiseMap:
        data = self.service.get_broschuere_preise_map()
        if data is None:
            raise HTTPException(status_code=500, detail="Données Broschüre indisponibles")
        return data

    # --- Maps filtrées par produkt_gruppe ---

    def get_anschreiben_map_by_produkt_gruppe(self, produkt_gruppe: str) -> AnschreibenPreiseMap:
        data = self.service.get_anschreiben_preise_map_by_produkt_gruppe(produkt_gruppe)
        if data is None:
            raise HTTPException(status_code=500, detail=f"Données Anschreiben indisponibles pour {produkt_gruppe}")
        return data

    def get_flyer_map_by_produkt_gruppe(self, produkt_gruppe: str) -> FlyerPreiseMap:
        data = self.service.get_flyer_preise_map_by_produkt_gruppe(produkt_gruppe)
        if data is None:
            raise HTTPException(status_code=500, detail=f"Données Flyer indisponibles pour {produkt_gruppe}")
        return data

    def get_antwortkarte_map_by_produkt_gruppe(self, produkt_gruppe: str) -> AntwortkartePreiseMap:
        data = self.service.get_antwortkarte_preise_map_by_produkt_gruppe(produkt_gruppe)
        if data is None:
            raise HTTPException(status_code=500, detail=f"Données Antwortkarte indisponibles pour {produkt_gruppe}")
        return data

    def get_broschuere_map_by_produkt_gruppe(self, produkt_gruppe: str) -> BroschuerePreiseMap:
        data = self.service.get_broschuere_preise_map_by_produkt_gruppe(produkt_gruppe)
        if data is None:
            raise HTTPException(status_code=500, detail=f"Données Broschüre indisponibles pour {produkt_gruppe}")
        return data

tarife_controller = TarifeController()