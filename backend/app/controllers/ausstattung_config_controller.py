from fastapi import HTTPException
from typing import List
from app.models.ausstattung_config import AusstattungConfig

from app.services.ausstattung_config_service import (ausstattung_config_service)
class AusstattungConfigController:
    def __init__(self):
        self.service = ausstattung_config_service

    def get_all(self) -> List[AusstattungConfig]:
        ausstattung= self.service.get_all()
        if ausstattung is None:
            raise HTTPException(status_code=500, detail="Fichier Excel indisponible ou illisible")
        return ausstattung

    def get_by_kategorie(
        self,
        kategorie: str
    ) -> List[AusstattungConfig]:
        ausstattung= self.service.get_by_kategorie(kategorie)
        if ausstattung is None:
            raise HTTPException(status_code=500, detail="Fichier Excel indisponible ou illisible")
        return ausstattung

    def get_by_produkt_gruppe(
        self,
        produkt_gruppe: str
    ) -> List[AusstattungConfig]:
        ausstattung= self.service.get_by_produkt_gruppe(produkt_gruppe)
        if ausstattung is None:
            raise HTTPException(status_code=500, detail="Fichier Excel indisponible ou illisible")
        return ausstattung

ausstattung_config_controller = AusstattungConfigController()