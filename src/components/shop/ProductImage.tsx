import Image from "next/image";
import { cn } from "@/lib/classes";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  /** Mark as LCP/priority image (e.g. product detail hero). */
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Renders a product image with next/image, or a branded placeholder when no
 * image is available. The wrapper enforces a square aspect ratio to avoid CLS.
 */
export default function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
}: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden bg-gradient-to-br from-green-deep/40 to-black",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <Placeholder />
      )}
    </div>
  );
}

function Placeholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        className="h-1/2 w-1/2 text-gold/40"
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
