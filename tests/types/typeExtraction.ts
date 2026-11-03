export interface ConfigurationComparee {
  huellentyp: string;
  ausstattung: string;
  auflage: string;
  farbigkeitHuelle: string;
  grammaturAnschreiben: string;
  farbigkeitAnschreiben: string;
  anzahlFlyer: string;
  flyers: string;
  farbigkeitBrochure: string;
  umfangBrochure: string;
  grammaturBrochure: string;
  oberflaecheBrochure: string;
}

export interface PrixCompare {
  produit: string;
  porto: string;
  express: string;
  totalNet: string;
  tva: string;
  totalBrut: string;
  gewichtProSendung: string;
  gesamtgewicht: string;
}

export interface ProduitOnline {
  nom: string;
  caracteristiques: Record<string, string>;
}

export interface PrixOnline {
  produit: string;
  porto: string;
  standard: string;
  express: string;
  totalNet: string;
  tva: string;
  totalBrut: string;
  gewichtProSendung: string;
  gesamtgewicht: string;
}

export interface RecapitulationOnline {
  prix: PrixOnline;
  quantite: string;
  produits: ProduitOnline[];
}