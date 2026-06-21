interface CategoryIconProps {
  iconId: string;
}

export default function CategoryIcon({ iconId }: CategoryIconProps) {
  switch (iconId) {
    case "kits":
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="10" y="16" width="36" height="28" rx="6" stroke="url(#cg2)" strokeWidth="1.5" fill="rgba(27,107,71,0.08)" />
          <path d="M20 16 L20 12 Q20 10 22 10 L34 10 Q36 10 36 12 L36 16" stroke="url(#cg2)" strokeWidth="1.5" fill="none" />
          <circle cx="28" cy="30" r="6" stroke="url(#cg2)" strokeWidth="1" fill="none" />
          <defs>
            <linearGradient id="cg2" x1="10" y1="10" x2="46" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1B6B47" />
              <stop offset="1" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "accessories":
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 28 L28 10 L44 28 L44 48 L12 48 Z" stroke="url(#cg3)" strokeWidth="1.5" fill="rgba(27,107,71,0.08)" />
          <path d="M22 48 L22 36 Q22 32 28 32 Q34 32 34 36 L34 48" stroke="url(#cg3)" strokeWidth="1.5" fill="none" />
          <defs>
            <linearGradient id="cg3" x1="12" y1="10" x2="44" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A84C" />
              <stop offset="1" stopColor="#1B6B47" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "consumables":
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="28" cy="28" r="18" stroke="url(#cg4)" strokeWidth="1.5" fill="rgba(27,107,71,0.08)" />
          <path d="M20 28 L26 34 L36 22" stroke="url(#cg4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="cg4" x1="10" y1="10" x2="46" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1B6B47" />
              <stop offset="1" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "cups":
    default:
      return (
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M14 24 Q14 12 28 12 Q42 12 42 24 L40 42 Q40 48 28 48 Q16 48 16 42 Z" stroke="url(#cg1)" strokeWidth="1.5" fill="rgba(27,107,71,0.08)" />
          <ellipse cx="28" cy="24" rx="14" ry="5" stroke="url(#cg1)" strokeWidth="1" fill="none" />
          <defs>
            <linearGradient id="cg1" x1="14" y1="12" x2="42" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A84C" />
              <stop offset="1" stopColor="#1B6B47" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
}
