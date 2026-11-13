import type { Page } from '@playwright/test';

import { testerKartenmailing } from '../../../utils/local/Kartenmailing/testerKartenmailing';
import type { Kartenmailing, TypLocalKartenmailing } from '../../../types/Kartenmailing';

export class LocalConfiguratorPageKartenmailing {
  private page: Page;
  private url: string;
  private type: TypLocalKartenmailing;
  private quantite: number;
  private kartenmailing: Kartenmailing;

  constructor(
    page: Page,
    url: string,
    type: TypLocalKartenmailing,
    quantite: number,
    kartenmailing: Kartenmailing
  ) {
    this.page = page;
    this.url = url;
    this.type = type;
    this.quantite = quantite;
    this.kartenmailing = kartenmailing;
  }

  async öffnenPage(): Promise<void> {
    await this.page.goto(`${this.url}/${this.type}`);
    await this.page.locator('body').waitFor();
    console.log('Page ouverte :', this.page.url());
  }

  async testerKartenmailing(): Promise<void> {
    await testerKartenmailing(this.page, this.quantite, this.kartenmailing);
  }

  /**
   * Le bloc "Ihre Auswahl" ne contient pas l'Endformat :
   * on le lit dans le tableau de l'Übersicht.
   */
  async lireEndformat(): Promise<string> {
    const ligne = this.page.getByRole('row', { name: /^Endformat/ });
    return (await ligne.getByRole('cell').nth(1).innerText()).trim();
  }
}
