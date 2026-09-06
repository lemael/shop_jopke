export interface AusstattungConfigStaffel {
  min: number;
  max: number;
  fixpreis: number;
  preisPro1000: number;
  expressProzent?: number;
}

export interface AusstattungConfig {
  hatBroschuere: boolean;
  staffeln: AusstattungConfigStaffel[];
}