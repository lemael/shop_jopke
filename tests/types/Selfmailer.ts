export interface Selfmailer {
    type: string;
    umfang: string;
    grammatur: string;
    perforation: string;
}

export type TypLocalSelfmailer = 'levi' | 'inata' | 'klappe_alba' | 'mikro' | 'megalo' | 'andigo' | 'afisa' | 'alvaro' | 'bestseller_levi';
export type TypOnlineSelfmailer = 'din-lang-selfmailer-levi' | 'maxi-selfmailer-inata' | 'maxi-selfmailer-mit-klappe-alba' | 'din-a6-selfmailer-mikro' | 'din-a5-selfmailer-megalo' | 'din-lang-poster-selfmailer-andigo' | 'din-a5-poster-selfmailer-afisa' | 'din-lang-minikatalog-alvaro' | 'unser-bestseller-levi';