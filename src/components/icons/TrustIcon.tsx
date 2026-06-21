interface TrustIconProps {
  iconId: string;
}

export default function TrustIcon({ iconId }: TrustIconProps) {
  switch (iconId) {
    case "shield":
      return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M24 4L6 12V24C6 34.5 13.9 44.3 24 47C34.1 44.3 42 34.5 42 24V12L24 4Z" stroke="url(#tg1)" strokeWidth="1.5" fill="none" />
          <path d="M16 24L21 29L32 18" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="tg1" x1="6" y1="4" x2="42" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A84C" />
              <stop offset="1" stopColor="#1B6B47" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "delivery":
      return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 20C8 12.3 14.3 6 22 6H26C33.7 6 40 12.3 40 20V28C40 35.7 33.7 42 26 42H22C14.3 42 8 35.7 8 28V20Z" stroke="url(#tg2)" strokeWidth="1.5" fill="none" />
          <path d="M16 24H32M24 16V32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="tg2" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1B6B47" />
              <stop offset="1" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="24" cy="24" r="18" stroke="url(#tg3)" strokeWidth="1.5" fill="none" />
          <path d="M24 14V24L30 30" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="tg3" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A84C" />
              <stop offset="1" stopColor="#1B6B47" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "community":
    default:
      return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 20L24 8L36 20V38C36 39.1 35.1 40 34 40H14C12.9 40 12 39.1 12 38V20Z" stroke="url(#tg4)" strokeWidth="1.5" fill="none" />
          <path d="M20 40V30H28V40" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="tg4" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1B6B47" />
              <stop offset="1" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
}
