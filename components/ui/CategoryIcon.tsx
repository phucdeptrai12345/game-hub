'use client';

interface Props {
  slug: string;
  className?: string;
  size?: number;
}

export default function CategoryIcon({ slug, className = '', size = 20 }: Props) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `shrink-0 ${className}`,
    'aria-hidden': true,
  };

  switch (slug.toLowerCase()) {
    case 'action':
      return <svg {...p}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.25"/></svg>;
    case 'puzzle':
      return <svg {...p}><path d="M11.5 3H5a2 2 0 00-2 2v6.5M3 14v5a2 2 0 002 2h5M14 21h5a2 2 0 002-2v-5M21 11.5V5a2 2 0 00-2-2h-5"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.25"/></svg>;
    case 'racing':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 10-6-6"/><path d="M12 2v6"/><path d="M12 12l4-4" strokeWidth="2.8"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>;
    case 'sports':
      return <svg {...p}><circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1"/><path d="M6 12A6 6 0 0118 12M12 6A6 6 0 0112 18M6.5 6.5l11 11"/></svg>;
    case 'io':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/><path d="M2 12h20"/></svg>;
    case 'casual':
      return <svg {...p}><rect x="2" y="6" width="20" height="12" rx="4" fill="currentColor" fillOpacity="0.15"/><path d="M6 12h4M8 10v4"/><circle cx="15" cy="11" r="1" fill="currentColor"/><circle cx="17" cy="13" r="1" fill="currentColor"/></svg>;
    case 'shooting':
      return <svg {...p}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>;
    case 'adventure':
      return <svg {...p}><polygon points="3 11 11 3 21 13 13 21"/><path d="M9 15l-4.5 4.5M3 21l1.5-1.5"/><circle cx="13" cy="11" r="2.5" fill="currentColor" fillOpacity="0.3"/></svg>;
    case 'skill':
      return <svg {...p}><path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a5 5 0 015 5v5a5 5 0 01-10 0V7a5 5 0 015-5z" fill="currentColor" fillOpacity="0.2"/></svg>;
    case 'arcade':
      return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" fillOpacity="0.1"/><path d="M4 14h16M4 8h16"/><circle cx="8" cy="11" r="1" fill="currentColor"/><circle cx="11" cy="11" r="1" fill="currentColor"/></svg>;
    case 'strategy':
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15"/><path d="M12 8v8M8 12h8"/></svg>;
    case 'girls':
      return <svg {...p}><path d="M6 3h12l4 6-10 12L2 9z" fill="currentColor" fillOpacity="0.2"/><path d="M11 3l-3 6M13 3l3 6M2 9h20M12 21L8 9M12 21l4-12"/></svg>;
    case 'multiplayer':
      return <svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" fill="currentColor" fillOpacity="0.1"/><circle cx="9" cy="7" r="4" fill="currentColor" fillOpacity="0.2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
    case '3d':
      return <svg {...p}><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" fillOpacity="0.2"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5M2 7v10M12 12v10M22 7v10"/></svg>;
    case 'car':
      return <svg {...p}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2" fill="currentColor" fillOpacity="0.1"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
    case 'clicker':
      return <svg {...p}><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="currentColor" fillOpacity="0.2"/><path d="M13 13l6 6"/></svg>;
    case 'cooking':
      return <svg {...p}><path d="M6 18h12a2 2 0 002-2v-3a6 6 0 00-12 0v3a2 2 0 002 2z" fill="currentColor" fillOpacity="0.15"/><path d="M9 18v3M15 18v3M12 4a4 4 0 00-3.5 6h7A4 4 0 0012 4z"/></svg>;
    case 'stickman':
      return <svg {...p}><circle cx="12" cy="5" r="2.5" fill="currentColor" fillOpacity="0.3"/><path d="M12 7.5v7.5M12 15l-3.5 5M12 15l3.5 5M8.5 10h7"/></svg>;
    case 'fighting':
      return <svg {...p}><path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8" fill="currentColor" fillOpacity="0.1"/><path d="M18 11a2 2 0 012 2v2a6 6 0 01-6 6H8a8 8 0 01-8-8V6a2 2 0 012-2 2 2 0 012 2v4.5"/></svg>;
    case 'running':
      return <svg {...p}><circle cx="13" cy="4" r="2"/><path d="M7 22l2-4 3 2 3-6 3 3M5 12l2-3 3 2 2-3"/></svg>;
    case 'hypercasual':
      return <svg {...p}><path d="M12 22V12M12 12a5 5 0 005-5 5 5 0 00-5-5 5 5 0 00-5 5 5 5 0 005 5z" fill="currentColor" fillOpacity="0.15"/><path d="M5 17.5A7.5 7.5 0 0019 17.5"/></svg>;
    case 'zombie':
      return <svg {...p}><circle cx="12" cy="11" r="8" fill="currentColor" fillOpacity="0.1"/><path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 005 0"/><path d="M12 3v2M4.22 5.22l1.42 1.42M19.78 5.22l-1.42 1.42"/></svg>;
    case 'beauty':
      return <svg {...p}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor" fillOpacity="0.2"/></svg>;
    case 'simulation':
      return <svg {...p}><path d="M3 21h18M3 10h18M5 21V10M19 21V10M3 10l9-7 9 7" fill="currentColor" fillOpacity="0.1"/><path d="M9 21v-6h6v6"/></svg>;
    case 'kids':
      return <svg {...p}><circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;
    case 'soccer':
      return <svg {...p}><circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1"/><path d="M12 2l3 9-8-5.5h10L9 11l3-9z" fill="currentColor" fillOpacity="0.3"/></svg>;
    case '2player':
      return <svg {...p}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" fill="currentColor" fillOpacity="0.1"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
    case 'platformer':
      return <svg {...p}><rect x="2" y="18" width="20" height="3" rx="1" fill="currentColor" fillOpacity="0.3"/><rect x="6" y="12" width="8" height="3" rx="1" fill="currentColor" fillOpacity="0.2"/><circle cx="12" cy="7" r="2.5" fill="currentColor" fillOpacity="0.25"/><path d="M12 9.5v2.5M9.5 14H14"/></svg>;
    case 'horror':
      return <svg {...p}><path d="M9 10.5V19a3 3 0 006 0v-8.5" fill="currentColor" fillOpacity="0.1"/><path d="M9 10.5C9 7.46 10.34 5 12 5s3 2.46 3 5.5"/><path d="M6.5 10C5.12 10 4 11.12 4 12.5S5.12 15 6.5 15H9M17.5 10c1.38 0 2.5 1.12 2.5 2.5S18.88 15 17.5 15H15"/></svg>;
    default:
      return <svg {...p}><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4M8 10v4"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/></svg>;
  }
}
