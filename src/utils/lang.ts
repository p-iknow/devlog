import { LOCALES } from "@/config/locale";

const langSuffixPattern = new RegExp(`\\.(${LOCALES.join("|")})$`);

export function stripLangFromId(id: string): string {
  return id.replace(langSuffixPattern, "");
}
