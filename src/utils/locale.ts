import { type Locale, defaultLocale, LOCALES } from "@/config/locale";

export function getLangPath(lang: Locale): string {
  return `/${lang}`;
}

export function isDefaultLocale(lang: Locale): boolean {
  return lang === defaultLocale;
}

/**
 * 현재 경로에서 언어 prefix를 대상 언어로 변경한 경로 반환
 * @example getAlternatePath("/en/posts/hello", "ko") → "/ko/posts/hello"
 */
export function getAlternatePath(
  currentPath: string,
  targetLang: Locale
): string {
  let basePath = currentPath;
  for (const locale of LOCALES) {
    const prefix = `/${locale}`;
    if (basePath.startsWith(prefix)) {
      basePath = basePath.substring(prefix.length) || "/";
      break;
    }
  }

  return `/${targetLang}${basePath === "/" ? "" : basePath}`;
}
