import type { Page } from '@playwright/test';
import { cliquerWeiter } from '../../../utils/onlineVersion/cliquerWeiter';
import type { Selfmailer, TypOnlineSelfmailer } from '../../../types/Selfmailer';
export type ChoixPiecesJointes = 'flyer' | 'brochure';
import { testerCombinaisonsPiecesJointesSelfmailer } from '../../../utils/onlineVersion/Selfmailer/testerSelfmailer';
import { configurerAuflage } from '../../../utils/onlineVersion/configureAuflage';
import { configureUmfang, configureGrammatur, configurePerforation } from '../../../utils/onlineVersion/Selfmailer/configureSelfmailer';



class OnlineConfiguratorPageSelfmailer {
    private page: Page;
    private type: TypOnlineSelfmailer;
    private quantite1: number;
    private selfmailer: Selfmailer;

  constructor(page: Page, type: TypOnlineSelfmailer,
    quantite1: number,
    selfmailer: Selfmailer
  ) {
    this.page = page;
    this.type = type;
    this.quantite1 = quantite1;
    this.selfmailer = selfmailer;
  }


  async öffnenPage(url: string) {
    const urlAdapt = `${url}/${this.type}/overview`;
    await this.page.goto(urlAdapt);
    await this.page.locator('body').waitFor();
    console.log('Page ouverte :', this.page.url());
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

async configurerAuflage(): Promise<void> {
  await configurerAuflage(this.page, this.quantite1);
}
async configurerUmfang(): Promise<void> {
  await configureUmfang(this.page, this.selfmailer);
}

async configurerGrammatur(): Promise<void> {
  await configureGrammatur(this.page, this.selfmailer);
}
async configurerPerforation(): Promise<void> {
  await configurePerforation(this.page, this.selfmailer);
}


async cliquerWeiter(): Promise<void> {
  await cliquerWeiter(this.page);
}

async testerCombinaisonsPiecesJointes(): Promise<void> {
  await testerCombinaisonsPiecesJointesSelfmailer(
    this.page,
    this.quantite1,
    this.selfmailer
  );
}
}

export { OnlineConfiguratorPageSelfmailer };