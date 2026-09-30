import rawLevels from "@/data/levels.yaml";
import type { Course, LevelDefinition } from "@/types/certificate";

const files = import.meta.glob<Course>("@/data/courses/*.yaml", { eager: true, import: "default" });

// Glob keys are file paths, so sorting by them applies the numeric filename prefix.
export const courses: Course[] = Object.keys(files)
  .sort()
  .map((path) => files[path]);

export const levels = rawLevels as LevelDefinition[];

export const findCourse = (id: string | undefined) => courses.find((c) => c.id === id);

export const findLevel = (id: string | undefined) => levels.find((l) => l.id === id);

// Catches typos in course files early: every level id must exist in levels.yaml.
for (const course of courses) {
  for (const level of course.levels) {
    if (!findLevel(level.id)) throw new Error(`Курс "${course.id}": неизвестный уровень "${level.id}"`);
  }
}
