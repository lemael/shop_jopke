import { Page } from "@playwright/test";

import { testerCombinaisonsPiecesJointes } from "../../../utils/local/Selfmailer/testerSelfmailer";
import { Selfmailer, TypLocalSelfmailer } from "../../../types/Selfmailer";
import { configurePerforation, configureGrammatur, configureUmfang } from "../../../utils/local/Selfmailer/configurerSelfmailer";

export class LocalConfiguratorPageSelfmailer {
  private page: Page;
  private url: string;

  private type: TypLocalSelfmailer;
 
  private selfmailer: Selfmailer;
  private quantite: number;
 
  constructor(
    page: Page,
    url: string,
    type: TypLocalSelfmailer,
    quantite: number,
    selfmailer: Selfmailer,

    ) {
      this.page = page;
      this.url = url;
      this.quantite = quantite;
      this.selfmailer = selfmailer;
      this.type = type;
    
    }

    async öffnenPage(type: TypLocalSelfmailer) {
      this.type = type;
      const urlAdapt = `${this.url}/${this.type}`;
      await this.page.goto(urlAdapt);
      await this.page.locator('body').waitFor();
      console.log('Page ouverte :', this.page.url());
     
   }



  async configurerUmfang(): Promise<void> {
    
    await configureUmfang(
      this.page,
      this.selfmailer
    );

  }

  async configurerGrammatur(): Promise<void> {
    await configureGrammatur(
      this.page,
      this.selfmailer
    );
  }

  async configurerPerforation(): Promise<void> {
   
    await configurePerforation(
      this.page,
      this.selfmailer
    );
  }


  
  async testerCombinaisonsPiecesJointes(): Promise<void> {
    await testerCombinaisonsPiecesJointes(
      this.page,
      this.quantite,
      this.selfmailer
    );
  }
}
