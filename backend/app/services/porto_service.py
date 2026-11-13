import math
from decimal import ROUND_HALF_UP, Decimal
from typing import List, Optional

from app.config import PORTO_AUFSCHLAG_JOPKE
from app.models.porto import PortoBerechnung, PortoKonfiguration, PortoRegel
from app.repositories.porto_repository import porto_repository


def _runden(wert: Decimal) -> float:
    return float(wert.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


class PortoService:
    """
    Calcul du Porto selon la feuille « Porto » de tarife.xlsx :

    - à partir de 5.000 Sendungen : Dialogpost, auflage × tarif ;
    - en dessous, si c'est moins cher : « Aufzahlung auf 5.000 Sdg. », 5.000 × tarif ;
    - sinon Dialogpost Easy : auflage × (tarif + Easy-Zuschlag).

    jopke.de applique des tarifs supérieurs de 0,01 € à ceux de l'Excel
    (ex. classe B : 0,39 € au lieu de 0,38 €) : ce supplément est ajouté au tarif.
    """

    MINDESTAUFLAGE_DIALOGPOST = 5000

    def __init__(self, repo=porto_repository, aufschlag_jopke: float = PORTO_AUFSCHLAG_JOPKE):
        self.repo = repo
        self.aufschlag_jopke = Decimal(str(aufschlag_jopke))

    def get_konfiguration(self) -> Optional[PortoKonfiguration]:
        regeln = self.get_regeln()
        if regeln is None:
            return None
        return PortoKonfiguration(
            easy_zuschlag=self.repo.get_easy_zuschlag(),
            aufschlag_jopke=float(self.aufschlag_jopke),
            mindestauflage_dialogpost=self.MINDESTAUFLAGE_DIALOGPOST,
            regeln=regeln,
        )

    def get_regeln(self) -> Optional[List[PortoRegel]]:
        zeilen = self.repo.get_all()
        if zeilen is None:
            return None

        easy_zuschlag = Decimal(str(self.repo.get_easy_zuschlag()))
        regeln: List[PortoRegel] = []

        for zeile in zeilen:
            tarif = Decimal(str(zeile["tarif"])) + self.aufschlag_jopke
            tarif_easy = tarif + easy_zuschlag
            # Même formule que la feuille « Ermittlung Portoaufzhlg. » :
            # ROUNDUP(5000 × tarif / (tarif + 0,18)).
            ab_auflage = math.ceil(self.MINDESTAUFLAGE_DIALOGPOST * tarif / tarif_easy)

            regeln.append(
                PortoRegel(
                    versandklasse=zeile["versandklasse"],
                    beschreibung=zeile["beschreibung"],
                    gewicht_min_g=zeile["gewicht_min_g"],
                    gewicht_max_g=zeile["gewicht_max_g"],
                    tarif_excel=zeile["tarif"],
                    tarif=float(tarif),
                    tarif_easy=float(tarif_easy),
                    ab_auflage_aufzahlung=ab_auflage,
                )
            )

        return regeln

    def bestimme_versandklasse(
        self,
        regeln: List[PortoRegel],
        gewicht_g: float,
        mindest_versandklasse: Optional[str] = None,
    ) -> PortoRegel:
        """
        Classe selon le poids, sans jamais descendre sous la Mindest-Versandklasse
        de l'article (colonne « Mindest-Versandklasse » de « Hauptartikel & Vorauswahl »).
        """
        reihenfolge = [regel.versandklasse for regel in regeln]

        nach_gewicht = next(
            (regel for regel in regeln if gewicht_g <= regel.gewicht_max_g),
            None,
        )
        if nach_gewicht is None:
            raise ValueError(f"Aucune Versandklasse pour un poids de {gewicht_g} g")

        if mindest_versandklasse:
            mindest = mindest_versandklasse.strip().upper()
            if mindest not in reihenfolge:
                raise ValueError(f"Versandklasse inconnue : {mindest_versandklasse}")
            if reihenfolge.index(mindest) > reihenfolge.index(nach_gewicht.versandklasse):
                return regeln[reihenfolge.index(mindest)]

        return nach_gewicht

    def berechne(
        self,
        auflage: int,
        gewicht_g: float,
        mindest_versandklasse: Optional[str] = None,
    ) -> Optional[PortoBerechnung]:
        regeln = self.get_regeln()
        if regeln is None:
            return None

        regel = self.bestimme_versandklasse(regeln, gewicht_g, mindest_versandklasse)
        tarif = Decimal(str(regel.tarif))
        tarif_easy = Decimal(str(regel.tarif_easy))

        if auflage >= self.MINDESTAUFLAGE_DIALOGPOST:
            modus, tarif_pro_stueck = "dialogpost", tarif
            porto = auflage * tarif
        elif auflage >= regel.ab_auflage_aufzahlung:
            modus, tarif_pro_stueck = "aufzahlung", tarif
            porto = self.MINDESTAUFLAGE_DIALOGPOST * tarif
        else:
            modus, tarif_pro_stueck = "easy", tarif_easy
            porto = auflage * tarif_easy

        return PortoBerechnung(
            auflage=auflage,
            gewicht_g=gewicht_g,
            versandklasse=regel.versandklasse,
            modus=modus,
            tarif_pro_stueck=float(tarif_pro_stueck),
            porto=_runden(porto),
        )


porto_service = PortoService()
