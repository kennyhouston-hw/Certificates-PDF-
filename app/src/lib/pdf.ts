import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const A4 = { width: 842, height: 595 };

export async function generateCertificatePdf(node: HTMLElement, fileName: string): Promise<void> {
  const canvas = await html2canvas(node, {
    scale: 4,
    useCORS: true,
    logging: false,
    onclone: async (doc, clonedNode) => {
      inlineStylesheets(doc);
      // The on-screen preview is scaled down to fit narrow screens; render the clone unscaled.
      doc.querySelectorAll<HTMLElement>("[data-scale-wrapper]").forEach((el) => {
        el.style.transform = "none";
      });
      // Reading the size forces layout, which starts loading the fonts from the inlined
      // @font-face rules; html2canvas only waited for fonts before this callback.
      const width = clonedNode.getBoundingClientRect().width;
      await doc.fonts.ready;
      // Without styles the certificate collapses into plain text; fail loudly instead of saving that.
      if (Math.round(width) !== A4.width) {
        throw new Error("стили страницы не применились. Обновите страницу и попробуйте ещё раз.");
      }
    },
  });

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [A4.width, A4.height],
  });

  pdf.addImage(canvas.toDataURL("image/jpeg", 0.8), "JPEG", 0, 0, A4.width, A4.height);
  pdf.save(`${toSafeFileName(fileName) || "certificate"}.pdf`);
}

// Drops characters that Windows or macOS don't allow in file names (e.g. ":" in course titles).
function toSafeFileName(name: string) {
  return name.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
}

// html2canvas copies <style> tags into its clone, but <link> stylesheets are re-downloaded
// there and it doesn't wait for them, so in some browsers it renders an unstyled page.
// Replace each linked stylesheet with the already loaded rules from the live page.
function inlineStylesheets(doc: Document) {
  const sheets = Array.from(document.styleSheets).filter((sheet) => sheet.href);

  doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => link.remove());

  for (const sheet of sheets) {
    const css = Array.from(sheet.cssRules, (rule) => rule.cssText).join("\n");
    const style = doc.createElement("style");
    // Relative url()s (fonts, images) are relative to the stylesheet, not to the page.
    style.textContent = css.replace(/url\((['"]?)(?!data:|blob:|https?:|#)([^'")]+)\1\)/g, (_, quote, path) => {
      return `url(${quote}${new URL(path, sheet.href!).href}${quote})`;
    });
    doc.head.appendChild(style);
  }
}
