interface ProductIconProps {
  iconId: string;
}

export default function ProductIcon({ iconId }: ProductIconProps) {
  switch (iconId) {
    case "silicone-set":
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="40" cy="40" r="36" stroke="url(#pg2)" strokeWidth="1" strokeDasharray="4 2" />
          <path d="M20 32 Q20 14 40 14 Q60 14 60 32 L58 60 Q58 68 40 68 Q22 68 22 60 Z" fill="url(#pbg2)" stroke="url(#ps2)" strokeWidth="1.5" />
          <ellipse cx="40" cy="32" rx="20" ry="7" fill="url(#ptop2)" stroke="url(#ps2)" strokeWidth="1" />
          <path d="M25 45 Q25 42 40 42 Q55 42 55 45" stroke="url(#pg2)" strokeWidth="1" fill="none" />
          <path d="M27 35 Q27 33 40 33 Q53 33 53 35" stroke="rgba(201,168,76,0.4)" strokeWidth="0.6" fill="none" />
          <defs>
            <linearGradient id="pg2" x1="4" y1="76" x2="76" y2="4" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1B6B47" />
              <stop offset="1" stopColor="#C9A84C" />
            </linearGradient>
            <linearGradient id="pbg2" x1="20" y1="14" x2="60" y2="68" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A2E22" />
              <stop offset="1" stopColor="#040A06" />
            </linearGradient>
            <linearGradient id="ptop2" x1="20" y1="25" x2="60" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#285C38" />
              <stop offset="1" stopColor="#1A2E22" />
            </linearGradient>
            <linearGradient id="ps2" x1="20" y1="14" x2="60" y2="68" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1B6B47" />
              <stop offset="0.5" stopColor="#C9A84C" />
              <stop offset="1" stopColor="#1B6B47" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "clinic-kit":
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="8" y="8" width="64" height="64" rx="12" stroke="url(#pg3)" strokeWidth="1" strokeDasharray="4 2" />
          <path d="M18 36 Q18 22 30 22 Q42 22 42 36 L41 54 Q41 60 30 60 Q19 60 19 54 Z" fill="url(#pbg3)" stroke="url(#ps3)" strokeWidth="1.2" />
          <ellipse cx="30" cy="36" rx="12" ry="4" fill="url(#ptop3)" stroke="url(#ps3)" strokeWidth="0.8" />
          <path d="M46 38 Q46 26 56 26 Q66 26 66 38 L65 54 Q65 60 56 60 Q47 60 47 54 Z" fill="url(#pbg3b)" stroke="url(#ps3)" strokeWidth="1.2" />
          <ellipse cx="56" cy="38" rx="10" ry="3.5" fill="url(#ptop3b)" stroke="url(#ps3)" strokeWidth="0.8" />
          <path d="M30 64 L30 70 M56 64 L56 70" stroke="url(#pg3)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M22 70 L64 70" stroke="url(#pg3)" strokeWidth="1.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="pg3" x1="4" y1="4" x2="76" y2="76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A84C" />
              <stop offset="1" stopColor="#1B6B47" />
            </linearGradient>
            <linearGradient id="pbg3" x1="18" y1="22" x2="42" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1D3A28" />
              <stop offset="1" stopColor="#060E0A" />
            </linearGradient>
            <linearGradient id="pbg3b" x1="46" y1="26" x2="66" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1D3A28" />
              <stop offset="1" stopColor="#060E0A" />
            </linearGradient>
            <linearGradient id="ptop3" x1="18" y1="32" x2="42" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2D5A3D" />
              <stop offset="1" stopColor="#1D3A28" />
            </linearGradient>
            <linearGradient id="ptop3b" x1="46" y1="34" x2="66" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2D5A3D" />
              <stop offset="1" stopColor="#1D3A28" />
            </linearGradient>
            <linearGradient id="ps3" x1="8" y1="8" x2="72" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A84C" />
              <stop offset="1" stopColor="#FFD97A" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "vacuum-kit":
    default:
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="40" cy="40" r="36" stroke="url(#pg1)" strokeWidth="1" strokeDasharray="4 2" />
          <path d="M22 34 Q22 18 40 18 Q58 18 58 34 L56 56 Q56 64 40 64 Q24 64 24 56 Z" fill="url(#pbg1)" stroke="url(#ps1)" strokeWidth="1.5" />
          <ellipse cx="40" cy="34" rx="18" ry="6" fill="url(#ptop1)" stroke="url(#ps1)" strokeWidth="1" />
          <path d="M28 42 Q28 40 40 40 Q52 40 52 42" stroke="url(#pg1)" strokeWidth="1" fill="none" />
          <defs>
            <linearGradient id="pg1" x1="4" y1="4" x2="76" y2="76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A84C" />
              <stop offset="1" stopColor="#1B6B47" />
            </linearGradient>
            <linearGradient id="pbg1" x1="22" y1="18" x2="58" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1D3A28" />
              <stop offset="1" stopColor="#060E0A" />
            </linearGradient>
            <linearGradient id="ptop1" x1="22" y1="28" x2="58" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2D5A3D" />
              <stop offset="1" stopColor="#1D3A28" />
            </linearGradient>
            <linearGradient id="ps1" x1="22" y1="18" x2="58" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A84C" />
              <stop offset="1" stopColor="#E8C96A" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
}
