import { format } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import type { Locale } from "@/config/locale";

const dateLocales = {
  en: enUS,
  ko: ko,
} as const;

export function formatDate(date: Date, pattern: string, lang: Locale): string {
  return format(date, pattern, { locale: dateLocales[lang] });
}

export function formatDateShort(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDateLocalized(date: Date, lang: Locale): string {
  const pattern = lang === "ko" ? "yyyy년 M월 d일" : "MMM d, yyyy";
  return format(date, pattern, { locale: dateLocales[lang] });
}
