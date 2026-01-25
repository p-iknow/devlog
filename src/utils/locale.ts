import { type Locale, defaultLocale } from "@/config/locale";

export function getLangPath(lang: Locale): string {
  return `/${lang}`;
}

export function isDefaultLocale(lang: Locale): boolean {
  return lang === defaultLocale;
}
