import type { Page } from '@playwright/test';

import { testerKartenmailingOnline } from '../../../utils/onlineVersion/Kartenmailing/testerKartenmailing';
import type { Kartenmailing, TypOnlineKartenmailing } from '../../../types/Kartenmailing';

export class OnlineConfiguratorPageKartenmailing {
  private page: Page;
  private type: TypOnlineKartenmailing;
  private quantite: number;
  private kartenmailing: Kartenmailing;

  constructor(
    page: Page,
    type: TypOnlineKartenmailing,
    quantite: number,
    kartenmailing: Kartenmailing
  ) {
    this.page = page;
    this.type = type;
    this.quantite = quantite;
    this.kartenmailing = kartenmailing;
  }

  async öffnenPage(url: string): Promise<void> {
    await this.page.goto(`${url}/${this.type}/overview`);
    await this.page.locator('body').waitFor();
    console.log('Page ouverte :', this.page.url());
  }

  // Le bandeau cookies recouvre le bouton "Produkt konfigurieren".
  async accepterCookiesNecessaires(): Promise<void> {
    const bouton = this.page.getByText('Nur notwendige akzeptieren', { exact: true });

    if (await bouton.isVisible().catch(() => false)) {
      await bouton.click();
      await this.page.locator('#cookieNotice').waitFor({ state: 'hidden' });
    }
  }

  async testerKartenmailing(): Promise<void> {
    await testerKartenmailingOnline(this.page, this.quantite, this.kartenmailing);
  }
}
