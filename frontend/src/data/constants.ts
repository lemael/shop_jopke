const DETAIL_STAFFEL_PUNKTE = [500, 1000, 5000, 10000, 50000, 100000];

const AUFLAGE_STAFFEL = [500, 1000, 2000, 3000, 5000, 10000, 20000, 50000, 100000];

/** Express-Aufpreis als Prozentsatz des Druckpreises, je Auflagenstaffel. Verifiziert (Fensterhülle+Anschreiben). */
const EXPRESS_PROZENT_STAFFEL: Record<number, number> = {
  500: 0.25, 1000: 0.25, 2000: 0.25, 3000: 0.25, 5000: 0.25,
  10000: 0.17, 20000: 0.15, 50000: 0.15, 100000: 0.14,
};

 const tranchePunkte: [number, number][] = [
    [5000, 10000],
    [10000, 50000],
    [50000, 100000],
  ];
export { DETAIL_STAFFEL_PUNKTE, AUFLAGE_STAFFEL, EXPRESS_PROZENT_STAFFEL, tranchePunkte };