export interface ConfigurationComparee {
  huellentyp: string;
  ausstattung: string;
  auflage: string;
  farbigkeitHuelle: string;
  grammaturAnschreiben: string;
  farbigkeitAnschreiben: string;
  anzahlFlyer: string;
  flyer1: string;
}

export interface PrixCompare {
  produit: string;
  porto: string;
  totalNet: string;
  tva: string;
  totalBrut: string;
}

export interface ProduitOnline {
  nom: string;
  caracteristiques: Record<string, string>;
}

export interface PrixOnline {
  produit: string;
  porto: string;
  totalNet: string;
  tva: string;
  totalBrut: string;
}

export interface RecapitulationOnline {
  prix: PrixOnline;
  quantite: string;
  produits: ProduitOnline[];
}