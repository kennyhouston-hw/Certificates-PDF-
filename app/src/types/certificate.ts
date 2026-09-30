export type Lang = "ru" | "en";

export type Localized<T> = Partial<Record<Lang, T>>;

// "competencies" — two-column list with a bold lead-in, used by speed reading courses.
export type CertificateTemplate = "topics" | "competencies";

export interface LevelDefinition {
  id: string;
  title: Localized<string>;
  caption: Localized<string>;
}

export interface CourseLevel {
  id: string;
  courseTitle?: Localized<string>;
  skills: Localized<string[]>;
}

export interface Course {
  id: string;
  template?: CertificateTemplate;
  title: Localized<string>;
  levels: CourseLevel[];
}

export interface Option {
  id: string;
  title: string;
}

export type Translations = Record<Lang, Record<string, string>>;
