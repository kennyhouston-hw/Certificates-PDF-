import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

interface ScaledPreviewProps {
  width: number;
  height: number;
  children: ReactNode;
}

// Shrinks fixed-size content to fit the available width. The content keeps its
// real size in the DOM, so the PDF export still captures it at full resolution.
export function ScaledPreview({ width, height, children }: ScaledPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / width));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-2xl shadow-2xl" style={{ maxWidth: width, height: height * scale }}>
      <div
        data-scale-wrapper
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
