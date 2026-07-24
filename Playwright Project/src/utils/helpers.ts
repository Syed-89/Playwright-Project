/**
 * Generic, dependency-free helpers used across tests.
 * Keeping these separate from page objects avoids polluting POM classes
 * with unrelated concerns.
 */

/** Returns true if the given array is sorted according to the comparator. */
export function isSorted<T>(items: T[], comparator: (a: T, b: T) => number): boolean {
  for (let i = 0; i < items.length - 1; i++) {
    if (comparator(items[i], items[i + 1]) > 0) return false;
  }
  return true;
}

/** Parses a currency string like "$29.99" into a number. */
export function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9.]/g, ''));
}

/** Generates a unique string suffix, useful for test data isolation (e.g. emails). */
export function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}
