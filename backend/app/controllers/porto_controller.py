from typing import Optional

from fastapi import HTTPException

from app.models.porto import PortoBerechnung, PortoKonfiguration
from app.services.porto_service import porto_service


class PortoController:
    def __init__(self):
        self.service = porto_service

    def get_konfiguration(self) -> PortoKonfiguration:
        konfiguration = self.service.get_konfiguration()
        if konfiguration is None:
            raise HTTPException(status_code=500, detail="Feuille Porto indisponible ou illisible")
        return konfiguration

    def berechne(
        self,
        auflage: int,
        gewicht_g: float,
        mindest_versandklasse: Optional[str],
    ) -> PortoBerechnung:
        try:
            berechnung = self.service.berechne(auflage, gewicht_g, mindest_versandklasse)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        if berechnung is None:
            raise HTTPException(status_code=500, detail="Feuille Porto indisponible ou illisible")
        return berechnung


porto_controller = PortoController()
