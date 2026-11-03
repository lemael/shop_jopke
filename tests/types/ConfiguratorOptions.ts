import type { Flyer } from './Flyer';
import type { Brochure } from './Brochure';
import type { Anschreiben } from './Anschreiben';
import type { Huelle } from './Huelle';
export type AuswahlderAnhänge =
  | 'flyer'
  | 'brochure'
  | 'les-deux';

export interface ConfiguratorOptions {
  choix: AuswahlderAnhänge;
  auflage: number;


  flyer?: Flyer;
  brochure?: Brochure;
  huelle: Huelle;

  anschreiben?: Anschreiben;
}
