import type { Lang } from "@/types/certificate";

const MONTH_NAMES: Record<Lang, string[]> = {
  ru: [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

export function formatCertificateDate(dateValue: string, lang: Lang): string {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  const day = date.getDate();
  const year = date.getFullYear();
  const monthName = MONTH_NAMES[lang]?.[date.getMonth()] ?? MONTH_NAMES.en[date.getMonth()];

  return `${day} ${monthName}, ${year}`;
}
