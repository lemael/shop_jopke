export interface ConfigurationCompareeSelfmailer {
  typ: string;
  auflage: string;
  umfang: string;
  grammatur: string;
  perforation: string;
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
  nomProduit: string;
  caracteristiques: Record<string, string>;
}