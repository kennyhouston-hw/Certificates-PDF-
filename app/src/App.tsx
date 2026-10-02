import { useRef, useState } from "react";
import { CertificateForm } from "@/components/CertificateForm";
import { CertificatePreview } from "@/components/CertificatePreview";
import { ErrorDialog } from "@/components/ErrorDialog";
import { ScaledPreview } from "@/components/ScaledPreview";
import { useCertificateForm } from "@/hooks/useCertificateForm";
import { generateCertificatePdf } from "@/lib/pdf";

function App() {
  const form = useCertificateForm();
  const previewRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!form.name.trim()) {
      setError(form.langData.studentNameRequired);
      return;
    }

    if (!previewRef.current) return;

    try {
      await generateCertificatePdf(previewRef.current, form.fileName);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`${form.langData.pdfErrorMessagePrefix ?? "Ошибка:"} ${message}`);
    }
  };

  return (
    <main className="flex min-h-screen items-top sm:items-center justify-center p-5 bg-white">
      <div className="container flex w-full flex-col justify-center gap-2 sm:gap-6 lg:flex-row">

        <section className="flex min-w-0 flex-2 flex-col items-center justify-center p-4 sm:p-20 bg-muted/40 border border-dashed rounded-4xl">
          <ScaledPreview width={842} height={595}>
            <CertificatePreview
              ref={previewRef}
              name={form.name}
              courseTitle={form.courseTitle}
              skills={form.skills}
              formattedDate={form.formattedDate}
              levelCaption={form.levelCaption}
              certLevelLabel={form.certLevelLabel}
              template={form.template}
              lang={form.lang}
              langData={form.langData}
            />
          </ScaledPreview>
        </section>

        <CertificateForm
          lang={form.lang}
          onLangChange={form.setLang}
          date={form.date}
          onDateChange={form.setDate}
          name={form.name}
          onNameChange={form.setName}
          courseId={form.courseId}
          onCourseChange={form.setCourseId}
          courseOptions={form.courseOptions}
          level={form.level}
          onLevelChange={form.setLevel}
          levelOptions={form.levelOptions}
          onExport={handleExport}
          langData={form.langData}
        />
      </div>

      <ErrorDialog open={error !== null} message={error ?? ""} onOpenChange={(open) => !open && setError(null)} />
    </main>
  );
}

export default App;
