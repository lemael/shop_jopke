export const AUFLAGE_STAFFELN = [500, 1000, 2000, 3000, 5000, 10000, 20000, 50000, 100000, 150000, 200000];

/** Filtert die Standard-Auflagenstaffeln auf den fuer eine Variante gueltigen Bereich. */
export function auflagenFuer(mindestmenge: number | null | undefined, maximalmenge: number | null | undefined): number[] {
  const min = mindestmenge ?? 0;
  const max = maximalmenge ?? Infinity;
  return AUFLAGE_STAFFELN.filter((a) => a >= min && a <= max);
}
