import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/DateInput";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import type { Lang, Option, Translations } from "@/types/certificate";

interface CertificateFormProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  date: string;
  onDateChange: (date: string) => void;
  name: string;
  onNameChange: (name: string) => void;
  courseId: string | undefined;
  onCourseChange: (courseId: string) => void;
  courseOptions: Option[];
  level: string | undefined;
  onLevelChange: (level: string) => void;
  levelOptions: Option[];
  onExport: () => void;
  langData: Translations[Lang];
}

// Lets the select trigger show the option title instead of its id.
const toItems = (options: Option[]) => options.map((o) => ({ value: o.id, label: o.title }));

export function CertificateForm({
  lang,
  onLangChange,
  date,
  onDateChange,
  name,
  onNameChange,
  courseId,
  onCourseChange,
  courseOptions,
  level,
  onLevelChange,
  levelOptions,
  onExport,
  langData,
}: CertificateFormProps) {
  return (
    <form
      className="flex h-fit w-full flex-col gap-3 p-6 bg-white rounded-4xl border lg:w-92 lg:shrink-0"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="mb-2">
        <LanguageSwitch lang={lang} onChange={onLangChange} />
      </div>

      <DateInput value={date} onChange={onDateChange} />
      <Input
        type="text"
        placeholder="Имя ученика"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />

      <Select value={courseId} items={toItems(courseOptions)} onValueChange={(value) => value && onCourseChange(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={langData.selectCourseOption ?? "Выберите курс"} />
        </SelectTrigger>
        <SelectContent className="min-w-fit">
          {courseOptions.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={level} items={toItems(levelOptions)} onValueChange={(value) => value && onLevelChange(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите уровень" />
        </SelectTrigger>
        <SelectContent>
          {levelOptions.map((lvl) => (
            <SelectItem key={lvl.id} value={lvl.id}>
              {lvl.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="default"
        size="lg"
        className="w-full"
        onClick={onExport}
      >
        Экспорт в PDF
      </Button>
    </form>
  );
}
