import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Lang } from "@/types/certificate";

interface LanguageSwitchProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export function LanguageSwitch({ lang, onChange }: LanguageSwitchProps) {
  return (
    <Tabs value={lang} onValueChange={(value) => onChange(value as Lang)}>
      <TabsList className="w-full">
        <TabsTrigger value="ru">RU</TabsTrigger>
        <TabsTrigger value="en">ENG</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
