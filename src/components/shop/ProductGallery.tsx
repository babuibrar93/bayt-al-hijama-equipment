"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/classes";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

const LENS = 150;
const ZOOM = 2.4;

interface LensState {
  x: number;
  y: number;
  bgX: number;
  bgY: number;
  bgW: number;
  bgH: number;
}

/** Detail-page gallery: full image, hover magnifier, and selectable thumbnails. */
export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const photos = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<LensState | null>(null);
  const src = photos[active] ?? null;

  const hideLens = () => setLens(null);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      !window.matchMedia("(min-width: 640px) and (hover: hover) and (pointer: fine)")
        .matches
    ) {
      return;
    }
    const frame = frameRef.current;
    const img = frame?.querySelector("img");
    if (!frame || !img || !src || !img.naturalWidth) {
      hideLens();
      return;
    }

    const rect = img.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const scale = Math.min(
      rect.width / img.naturalWidth,
      rect.height / img.naturalHeight,
    );
    const drawnW = img.naturalWidth * scale;
    const drawnH = img.naturalHeight * scale;
    const offsetX = (rect.width - drawnW) / 2;
    const offsetY = (rect.height - drawnH) / 2;
    const x = event.clientX - rect.left - offsetX;
    const y = event.clientY - rect.top - offsetY;

    if (x < 0 || y < 0 || x > drawnW || y > drawnH) {
      hideLens();
      return;
    }

    const cursorX = event.clientX - frameRect.left;
    const cursorY = event.clientY - frameRect.top;
    const lensX = Math.min(
      Math.max(cursorX - LENS / 2, 0),
      frameRect.width - LENS,
    );
    const lensY = Math.min(
      Math.max(cursorY - LENS / 2, 0),
      frameRect.height - LENS,
    );

    setLens({
      x: lensX,
      y: lensY,
      bgW: drawnW * ZOOM,
      bgH: drawnH * ZOOM,
      bgX: cursorX - lensX - x * ZOOM,
      bgY: cursorY - lensY - y * ZOOM,
    });
  };

  return (
    <div className="min-w-0 max-w-full">
      <div
        ref={frameRef}
        className="relative aspect-square w-full max-w-full overflow-hidden rounded-lg border border-glass-border bg-white sm:aspect-[4/3] sm:cursor-zoom-in"
        onMouseMove={src ? onMove : undefined}
        onMouseLeave={hideLens}
      >
        {src ? (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            priority={active === 0}
            fetchPriority={active === 0 ? "high" : "auto"}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className={cn("object-contain", lens && "cursor-zoom-in")}
          />
        ) : (
          <EmptyFrame />
        )}
        {lens && src ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 rounded-md border border-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
            style={{
              width: LENS,
              height: LENS,
              left: lens.x,
              top: lens.y,
              backgroundColor: "#fff",
              backgroundImage: `url("${src.replace(/"/g, "%22")}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${lens.bgW}px ${lens.bgH}px`,
              backgroundPosition: `${lens.bgX}px ${lens.bgY}px`,
            }}
          />
        ) : null}
      </div>

      {photos.length > 1 && (
        <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1 sm:mt-4 sm:gap-3">
          {photos.map((img, index) => {
            const selected = index === active;
            return (
              <button
                key={`${img}-${index}`}
                type="button"
                onClick={() => {
                  setActive(index);
                  hideLens();
                }}
                aria-label={`Show image ${index + 1} of ${photos.length}`}
                aria-pressed={selected}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white sm:h-[4.5rem] sm:w-[4.5rem]",
                  selected
                    ? "border-gold ring-1 ring-gold"
                    : "border-glass-border hover:border-white/30",
                )}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyFrame() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <svg
        viewBox="0 0 120 120"
        className="h-1/3 w-1/3 text-gold/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <ellipse cx="60" cy="46" rx="30" ry="26" />
        <path d="M38 64c0 14 9 26 22 26s22-12 22-26" />
        <line x1="60" y1="20" x2="60" y2="8" />
      </svg>
    </div>
  );
}
