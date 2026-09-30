import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const A4 = { width: 842, height: 595 };

export async function generateCertificatePdf(node: HTMLElement): Promise<void> {
  const canvas = await html2canvas(node, {
    scale: 4,
    useCORS: true,
    logging: false,
    // The on-screen preview is scaled down to fit narrow screens; render the clone unscaled.
    onclone: (doc) => {
      doc.querySelectorAll<HTMLElement>("[data-scale-wrapper]").forEach((el) => {
        el.style.transform = "none";
      });
    },
  });

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [A4.width, A4.height],
  });

  pdf.addImage(canvas.toDataURL("image/jpeg", 0.8), "JPEG", 0, 0, A4.width, A4.height);
  pdf.save("certificate.pdf");
}
