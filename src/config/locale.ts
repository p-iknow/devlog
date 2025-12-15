/**
 * Default locale of the site, defined in the Astro config
 */
export const EnLocale = "en" as const;
type EnLocale = typeof EnLocale;

export const KoLocale = "ko" as const;
type KoLocale = typeof KoLocale;

/**
 * List of available locales, defined in the Astro config
 */
export const LOCALES = [EnLocale, KoLocale] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Default locale (used for URL without prefix)
 */
export const defaultLocale: Locale = EnLocale;

/**
 * List of available locales, with the explicit format
 */
export const LOCALE = {
  en: "en-US",
  ko: "ko-KR",
} as const satisfies Record<Locale, string>;

/**
 * Get the language path prefix for a given locale
 * Default locale (en) has no prefix
 */
export function getLangPath(lang: Locale): string {
  return lang === defaultLocale ? "" : `/${lang}`;
}

/**
 * Check if a locale is the default locale
 */
export function isDefaultLocale(lang: Locale): boolean {
  return lang === defaultLocale;
}
