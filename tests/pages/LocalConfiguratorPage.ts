import { Page } from "@playwright/test";
import { Huelle, TypHuelle } from "../types/Huelle";
import { Anschreiben } from "../types/Anschreiben";
import { Brochure } from "../types/Brochure";
import { AuswahlderAnhänge } from "../types/ConfiguratorOptions";
import { wählenTypeHuelle, configureFarbigkeitHuelle } from "../utils/local/configureHuelle";
import { configurerAuflage } from "../utils/local/configureAuflage";
import { configureFarbigkeitAnschreiben, configureGrammaturAnschreiben } from "../utils/onlineVersion/configureAnschreiben";
import { configureGrammaturFlyer, configureOberflächeFlyer, configureUmfangFlyer } from "../utils/onlineVersion/configureFlyer";
import { testerCombinaisonsPiecesJointes } from "../utils/local/testerCombinaisonsPiecesJointes";
import { Flyer, FlyerNummer } from "../types/Flyer";

export class LocalConfiguratorPage {
  private page: Page;
  private url: string;
  private huelle: Huelle;
  private type: TypHuelle;
  private anschreiben: Anschreiben;
  private brochure: Brochure;
  private flyer: Flyer;
  private quantite: number;
  private austattung: string;
  constructor(
    page: Page,
    url: string,
    type: TypHuelle,
    quantite: number,
    austattung: string,
    huelle: Huelle,
    anschreiben: Anschreiben,
    brochure: Brochure,
    flyer: Flyer
    ) {
      this.page = page;
      this.url = url;
      this.quantite = quantite;
      this.austattung = austattung;
      this.huelle = huelle;
      this.type = type;
      this.anschreiben = anschreiben;
      this.brochure = brochure;
      this.flyer = flyer;
    }

    async öffnenPage() {
      await this.page.goto(this.url);
      await this.page.locator('body').waitFor();
      console.log('Page ouverte :', this.page.url());
     
   }

  async wählenTypeHuelle(): Promise<void> {
    await wählenTypeHuelle(this.page, this.type);
  }

  async configurerAuflage(): Promise<void> {
      await configurerAuflage(this.page, this.quantite);
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


  
  async testerCombinaisonsPiecesJointes(): Promise<void> {
    await testerCombinaisonsPiecesJointes(
      this.page,
      this.quantite,
      this.austattung,
      this.huelle!,
      this.anschreiben!,
      this.flyer!,
      this.brochure!
    );
  }
}
