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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
      className="flex h-fit w-full flex-col gap-2 p-6 bg-white rounded-4xl border lg:w-92 lg:shrink-0"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="mb-3">
        <LanguageSwitch lang={lang} onChange={onLangChange} />
      </div>

      <Input
        type="text"
        placeholder="Имя ученика"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />

      <DateInput value={date} onChange={onDateChange} />
      
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

      <ToggleGroup
        size="sm"
        value={level ? [level] : []}
        onValueChange={(value) => {
          // Ignore clicks that would deselect the current level.
          const next = value[0];
          if (next) onLevelChange(next);
        }}
        variant="outline"
        spacing={1}
        className="w-full flex-wrap mt-2"
      >
        {levelOptions.map((lvl) => (
          <ToggleGroupItem key={lvl.id} value={lvl.id} className="text-xs h-7">
            {lvl.title}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Button
        variant="default"
        size="lg"
        className="w-full mt-4"
        onClick={onExport}
      >
        Экспорт в PDF
      </Button>
    </form>
  );
}
