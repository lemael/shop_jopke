export interface Kartenmailing {
    papier: string;
    veredelung: string;
}

export type TypLocalKartenmailing =
    | 'post_din_lan_98'
    | 'post_din_lan_105'
    | 'post_maxi'
    | 'postkarte_maxi'
    | 'post_din_a6'
    | 'post_din_a5'
    | 'post_din_a4';

export type TypOnlineKartenmailing =
    | 'postkarte-din-lang-210x98'
    | 'postkarte-din-lang-210x105'
    | 'postkarte-maxi-235x125'
    | 'unser-bestseller-karte-maxi'
    | 'postkarte-din-a6-148x105'
    | 'postkarte-din-a5-210x148'
    | 'postkarte-din-a4-297x210';
