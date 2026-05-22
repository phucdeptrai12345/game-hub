'use client';

interface Props {
  slug: string;
  className?: string;
  size?: number;
}

export default function CategoryIcon({ slug, className = '', size = 16 }: Props) {
  const normSlug = slug.toLowerCase();

  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `shrink-0 ${className}`,
    'aria-hidden': true,
  };

  switch (normSlug) {
    case 'action':
      // Energy Bolt with trail
      return (
        <svg {...props}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 'puzzle':
      // Block shape interlocking
      return (
        <svg {...props}>
          <path d="M11.5 3H5a2 2 0 0 0-2 2v6.5" />
          <path d="M3 14v5a2 2 0 0 0 2 2h5" />
          <path d="M14 21h5a2 2 0 0 0 2-2v-5" />
          <path d="M21 11.5V5a2 2 0 0 0-2-2h-5" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.3" />
        </svg>
      );
    case 'racing':
      // Checkered steering wheel / speedometer
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 18a6 6 0 1 0-6-6" />
          <path d="M12 2v6" />
          <path d="M12 12l4-4" strokeWidth="2.8" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
    case 'sports':
      // Dribbling basketball / ball pattern
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1" />
          <path d="M6 12A6 6 0 0 1 18 12" />
          <path d="M12 6A6 6 0 0 1 12 18" />
          <path d="M6.5 6.5l11 11" />
        </svg>
      );
    case 'io':
      // Orbital globe grid
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      );
    case 'casual':
      // Gaming pad / controller outline
      return (
        <svg {...props}>
          <rect x="2" y="6" width="20" height="12" rx="4" fill="currentColor" fillOpacity="0.15" />
          <path d="M6 12h4M8 10v4" />
          <circle cx="15" cy="11" r="1" fill="currentColor" />
          <circle cx="17" cy="13" r="1" fill="currentColor" />
        </svg>
      );
    case 'shooting':
      // High-tech sniper target / crosshair
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      );
    case 'adventure':
      // Sword and path / Shield and compass
      return (
        <svg {...props}>
          <polygon points="3 11 11 3 21 13 13 21" />
          <path d="M9 15l-4.5 4.5M3 21l1.5-1.5M7.5 18l1.5-1.5" />
          <circle cx="13" cy="11" r="2.5" fill="currentColor" />
        </svg>
      );
    case 'skill':
      // Trophy / crown
      return (
        <svg {...props}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
          <path d="M12 2a5 5 0 0 1 5 5v5a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 'arcade':
      // Retro console cabinet
      return (
        <svg {...props}>
          <rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
          <path d="M4 14h16M4 8h16" />
          <circle cx="8" cy="11" r="1" fill="currentColor" />
          <circle cx="11" cy="11" r="1" fill="currentColor" />
          <path d="M15 10.5l2 1" />
        </svg>
      );
    case 'strategy':
      // Knight chess / shield
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case 'girls':
      // Diamond shape / Princess Crown
      return (
        <svg {...props}>
          <path d="M6 3h12l4 6-10 12L2 9z" fill="currentColor" fillOpacity="0.2" />
          <path d="M11 3l-3 6M13 3l3 6M2 9h20M12 21L8 9M12 21l4-12" />
        </svg>
      );
    case 'multiplayer':
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="currentColor" fillOpacity="0.1" />
          <circle cx="9" cy="7" r="4" fill="currentColor" fillOpacity="0.2" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case '3d':
      return (
        <svg {...props}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" fillOpacity="0.2" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5M2 7v10M12 12v10M22 7v10" />
        </svg>
      );
    case 'car':
      return (
        <svg {...props}>
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" fill="currentColor" fillOpacity="0.1" />
          <circle cx="7" cy="17" r="3" fill="currentColor" fillOpacity="0.2" />
          <circle cx="17" cy="17" r="3" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 'clicker':
      return (
        <svg {...props}>
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="currentColor" fillOpacity="0.2" />
          <path d="M13 13l6 6" />
        </svg>
      );
    case 'cooking':
      return (
        <svg {...props}>
          <path d="M6 18h12a2 2 0 0 0 2-2v-3a6 6 0 0 0-12 0v3a2 2 0 0 0 2 2z" fill="currentColor" fillOpacity="0.15" />
          <path d="M9 18v3M15 18v3M12 4a4 4 0 0 0-3.5 6h7A4 4 0 0 0 12 4z" />
        </svg>
      );
    case 'stickman':
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="2.5" fill="currentColor" fillOpacity="0.3" />
          <path d="M12 7.5v7.5M12 15l-3.5 5M12 15l3.5 5M8.5 10h7" />
        </svg>
      );
    default:
      // Default controller icon fallback
      return (
        <svg {...props}>
          <rect x="2" y="6" width="20" height="12" rx="4" />
          <circle cx="15" cy="12" r="1.5" />
          <path d="M6 12h4M8 10v4" />
        </svg>
      );
  }
}
