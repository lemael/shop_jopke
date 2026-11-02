export class LocalConfiguratorPage {

  constructor(private page: Page) {}

  async getPrices() {
    return {
      druck: await this.getPrice('price-druck'),
      porto: await this.getPrice('price-porto'),
      netto: await this.getPrice('price-netto'),
      mwst: await this.getPrice('price-mwst'),
      brutto: await this.getPrice('price-brutto'),
    };
  }

  private async getPrice(testId: string): Promise<number> {
    const text = await this.page
      .getByTestId(testId)
      .innerText();

    return Number(
      text
        .replace('€', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    );
  }
}