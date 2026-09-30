import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { CertificateTemplate, Lang, Translations } from "@/types/certificate";

// Public files resolved against the build base, not the domain root.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

interface CertificatePreviewProps {
  name: string;
  courseTitle: string;
  skills: string[];
  formattedDate: string;
  levelCaption: string;
  certLevelLabel: string;
  template: CertificateTemplate;
  lang: Lang;
  langData: Translations[Lang];
}

export const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  function CertificatePreview(
    { name, courseTitle, skills, formattedDate, levelCaption, certLevelLabel, template, lang, langData },
    ref,
  ) {
    const competencies = template === "competencies";
    // Long topic lists (Blender, mental arithmetic) and competencies go into two columns, as in the Figma layouts.
    const columns = competencies || skills.length > 6 ? splitInHalf(skills) : [skills];

    return (
      <div
        ref={ref}
        className="relative w-[842px] h-[595px] overflow-hidden bg-white text-foreground"
      >
        <div
          className="absolute top-0 left-0 flex h-full w-[200px] items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${asset("img/header.svg")})` }}
        >
          <div className="flex -rotate-90 flex-col items-center justify-center gap-2">
            <h1 className="text-[48px]/10 tracking-widest text-white uppercase">
              {langData.crtTitle}
            </h1>
            <div className="mt-2 text-center text-[12px]/5 tracking-[2px] text-white uppercase">
              {certLevelLabel}
            </div>
          </div>
        </div>

        <p className="absolute top-[40px] right-[40px] z-1 text-right text-xs/5 *:tracking-normal text-foreground">
          {formattedDate}
        </p>
        {/* Flows top to bottom so a two-line name pushes the rest down instead of overlapping it. */}
        <div className="absolute top-[112px] left-[240px] z-1 flex w-[562px] flex-col text-foreground">
          <p className="text-[10px]/3 tracking-wider text-foreground/60 uppercase">
            {langData.cptConfirm}
          </p>
          <p className="mt-2 text-[28px]/8">{name}</p>
          <p className="mt-8 text-[10px]/3 tracking-wider text-foreground/60 uppercase">
            {levelCaption}
          </p>
          <p className="mt-2 text-[18px]/6">{courseTitle && `«${courseTitle}»`}</p>
          <p className="mt-[30px] text-[10px]/3 tracking-wider text-foreground/60 uppercase">
            {competencies ? langData.cptCompetencies : langData.cptSkills}
          </p>
          <div
            id="txtSkills"
            className={cn(
              "mt-2 grid gap-6",
              columns.length > 1 && "grid-cols-2",
              competencies ? "text-[10px]/[14px]" : "text-xs/5",
            )}
          >
            {columns.map((column, i) => (
              <ul key={i}>
                {column.map((skill) => (
                  <li key={skill} className={cn(competencies && "mb-1.5")}>
                    {competencies ? <Competency text={skill} /> : skill}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <p className="absolute bottom-[84px] left-[240px] z-1 text-xs/5 tracking-wide">
          {langData.txtCeo}
        </p>
        <p className="absolute bottom-[68px] left-[240px] z-1 w-full max-w-[562px] text-[10px]/3 tracking-wide text-foreground/50">
          {langData.cptCeo}
        </p>
        <p className="absolute bottom-[40px] left-[240px] z-1 w-full max-w-[562px] text-[8px]/3 tracking-wide text-foreground/40">
          {langData.cptInfo}
        </p>

        <img
          className="pointer-events-none absolute top-0 left-[200px] z-0 h-full object-cover"
          src={asset("img/background.png")}
          alt=""
        />
        <img
          className="absolute top-[40px] left-[240px] z-1 w-[129px]"
          src={asset("img/logo.svg")}
          alt="logo"
        />
        <img
          className="absolute right-[40px] bottom-[66px] z-1 aspect-square w-[88px]"
          src={asset("img/holo.png")}
          alt="holo"
        />
        {lang === "ru" ? (
          <img
            className="absolute right-[136px] bottom-[66px] z-1 aspect-square w-[88px]"
            src={asset("img/stamp.png")}
            alt="stamp"
          />
        ) : (
          <img
            className="absolute top-[482px] left-[429px] z-1 w-[118px]"
            src={asset("img/sign.png")}
            alt="signature"
          />
        )}
      </div>
    );
  },
);

// Speed reading items read "Lead-in: description"; the lead-in is set in bold.
function Competency({ text }: { text: string }) {
  const colon = text.indexOf(":");
  if (colon === -1) return text;
  return (
    <>
      <b className="font-semibold">{text.slice(0, colon + 1)}</b>
      {text.slice(colon + 1)}
    </>
  );
}

// Fills the left column first, like the Figma layouts. CSS columns would instead
// pick the split with the shortest height, which can leave the left column shorter.
function splitInHalf<T>(items: T[]): T[][] {
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
}
