import type { Page } from '@playwright/test';
import { cliquerWeiter } from '../utils/cliquerWeiter';
import type { Huelle, TypHuelle } from '../types/Huelle';
import type { Anschreiben } from '../types/Anschreiben';
import type { Flyer, FlyerNummer } from '../types/Flyer';
import type { Brochure } from '../types/Brochure';
import { configureUmfangFlyer, configureGrammaturFlyer, configureOberflächeFlyer } from '../utils/configureFlyer';
import { choisirTypeHuelle, configureFarbigkeitHuelle } from '../utils/configureHuelle';
import { configureGrammaturAnschreiben, configureFarbigkeitAnschreiben } from '../utils/configureAnschreiben';
export type ChoixPiecesJointes = 'flyer' | 'brochure' | 'les-deux';
import { expect } from '@playwright/test';
import { testerCombinaisonsPiecesJointes } from '../utils/testerCombinaisonsPiecesJointes';
import { configurerAuflage } from '../utils/configureAuflage';


class OnlineConfiguratorPage {
    private page: Page;
    private choix: ChoixPiecesJointes;
    private quantite1: number;
    private huelle: Huelle;
    private anschreiben?: Anschreiben;
    private flyer?: Flyer;
    private brochure?: Brochure;

  constructor(page: Page, choix: ChoixPiecesJointes,
    quantite1: number,
    huelle: Huelle,
    anschreiben?: Anschreiben,
    flyer?: Flyer,
    brochure?: Brochure,
    
  ) {
    this.page = page;
    this.choix = choix;
    this.quantite1 = quantite1;
    this.huelle = huelle;
    this.anschreiben = anschreiben;
    this.flyer = flyer;
    this.brochure = brochure;
    
  }

   getFlyer() : Flyer | undefined {
    return this.flyer;
  }
  getBrochure() : Brochure | undefined {
    return this.brochure;
  }
  getHuelle() : Huelle {
    return this.huelle;
  }
  getAnschreiben() : Anschreiben | undefined {
    return this.anschreiben;
  }
  async ouvrirPage(url: string) {
    await this.page.goto(url);
    await this.page.locator('body').waitFor();
    console.log('Page ouverte :', this.page.url());
  }

  async choisirTypeHuelle(type: TypHuelle): Promise<void> {
    await choisirTypeHuelle(this.page, type);
  }


  async inspecterPage(nom: string) {
    const body = await this.page.locator('body').innerText();
    const html = await this.page.locator('body').innerHTML();

    console.log(`\n===== ${nom} =====`);
    console.log(body);

    console.log(html);
  }


    async accepterCookiesNecessaires() {
        const bouton = this.page.getByText(
            'Nur notwendige akzeptieren',
            { exact: true }
        );

        if (await bouton.isVisible().catch(() => false)) {
            await bouton.click();
            await this.page.locator('#cookieNotice').waitFor({
            state: 'hidden'
            });
        }
    }

async configurerAuflage(quantite: number): Promise<void> {
  await configurerAuflage(this.page, quantite);
}
async configurerAnschreiben(): Promise<void> {
  if (!this.anschreiben) {
    throw new Error('Anschreiben non configuré');
  }
  await configureGrammaturAnschreiben(
    this.page,
    this.anschreiben
  );
  await configureFarbigkeitAnschreiben(
    this.page,
    this.anschreiben
  );

}
async configurerFarbigkeitHuelle(): Promise<void> {
  await configureFarbigkeitHuelle(
    this.page,
    this.huelle
  );
}

async configurerFlyer(): Promise<void> {
  if (!this.flyer) {
    throw new Error('Flyer non configuré');
  }
  await configureUmfangFlyer(
    this.page,
    this.flyer
  );
  await configureGrammaturFlyer(
    this.page,
    this.flyer
  );
  await configureOberflächeFlyer(
    this.page,
    this.flyer
  );
}

async cliquerWeiter(): Promise<void> {
  await cliquerWeiter(this.page);
}

async testerCombinaisonsPiecesJointes(combinaison: any, quantite1: number, numeroFlyer: FlyerNummer): Promise<void> {
  await testerCombinaisonsPiecesJointes(
    this.page,
    numeroFlyer,
    combinaison,
    quantite1,
    this.huelle!,
    this.anschreiben!,
    this.flyer!,
    this.brochure!
  );
}
}

export { OnlineConfiguratorPage };