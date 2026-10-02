import { useState } from "react";
import rawTranslations from "@/data/translations.yaml";
import { courses, findCourse, findLevel, levels } from "@/lib/courses";
import { formatCertificateDate } from "@/lib/date";
import type { Lang, Localized, Option, Translations } from "@/types/certificate";

export const translations = rawTranslations as Translations;

const todayIso = () => new Date().toISOString().split("T")[0];

// Selects always show Russian titles, whatever language the certificate is in.
const optionTitle = (title: Localized<string>) => title.ru ?? title.en ?? "";

function getCourseOptions(): Option[] {
  return courses.map((course) => ({ id: course.id, title: optionTitle(course.title) }));
}

function getDefaultCourseId(): string | undefined {
  const candidates = courses.map((c) => c.id);
  const saved = localStorage.getItem("selectedCourse");
  if (saved && candidates.includes(saved)) return saved;
  return candidates[0];
}

// Levels follow the order of levels.yaml, not the order inside the course file.
function getLevelOptions(courseId: string | undefined): Option[] {
  const available = new Set(findCourse(courseId)?.levels.map((l) => l.id));
  return levels.filter((l) => available.has(l.id)).map((l) => ({ id: l.id, title: optionTitle(l.short) }));
}

function getDefaultLevel(courseId: string | undefined): string | undefined {
  const options = getLevelOptions(courseId).map((l) => l.id);
  if (options.length === 0) return undefined;
  const saved = courseId ? localStorage.getItem(`selectedLevel-${courseId}`) : null;
  if (saved && options.includes(saved)) return saved;
  return options[0];
}

export function useCertificateForm() {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "ru");
  const [courseId, setCourseIdState] = useState<string | undefined>(getDefaultCourseId);
  const [level, setLevelState] = useState<string | undefined>(() => getDefaultLevel(courseId));
  const [date, setDate] = useState(todayIso());
  const [name, setName] = useState("");

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const setCourseId = (newCourseId: string) => {
    setCourseIdState(newCourseId);
    localStorage.setItem("selectedCourse", newCourseId);

    const newLevel = getDefaultLevel(newCourseId);
    setLevelState(newLevel);
    if (newLevel) localStorage.setItem(`selectedLevel-${newCourseId}`, newLevel);
  };

  const setLevel = (newLevel: string) => {
    setLevelState(newLevel);
    if (courseId) localStorage.setItem(`selectedLevel-${courseId}`, newLevel);
  };

  const langData = translations[lang];
  const course = findCourse(courseId);
  const courseLevel = course?.levels.find((l) => l.id === level);
  const levelDefinition = findLevel(level);
  const skills = courseLevel?.skills[lang]?.filter((t) => t.trim()) ?? [];

  return {
    lang,
    setLang,
    date,
    setDate,
    name,
    setName,
    courseId,
    setCourseId,
    level,
    setLevel,
    langData,
    courseOptions: getCourseOptions(),
    levelOptions: getLevelOptions(courseId),
    courseTitle: courseLevel?.courseTitle?.[lang] ?? course?.title[lang] ?? "",
    template: course?.template ?? "topics",
    skills,
    levelCaption: levelDefinition?.caption[lang] ?? "",
    certLevelLabel: levelDefinition?.title[lang] ?? "",
    formattedDate: formatCertificateDate(date, lang),
    // "Бычкова Юлия · Основы цифрового рисования · Начальный", in the certificate's language.
    fileName: [name.trim(), course?.title[lang], levelDefinition?.short[lang]].filter(Boolean).join(" · "),
  };
}
