import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact GameZone — send us a message about bugs, suggestions, or general feedback.',
};

export default function ContactPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="max-w-lg">
        <h1 className="text-3xl font-black text-fg title-display uppercase tracking-tight mb-2">
          Contact
        </h1>
        <p className="text-muted font-semibold text-sm mb-10">
          Questions, feedback, or bug reports
        </p>

        <div className="space-y-5 text-muted leading-relaxed font-semibold text-[0.95rem]">
          <p>
            Have a question, found a bug, or want to suggest a game? We'd love to hear from you.
          </p>
          <p>
            Reach us by email at{' '}
            <a
              href="mailto:hello@gamezone.fun"
              className="text-accent hover:text-accent-hover transition-colors duration-150 font-bold"
            >
              hello@gamezone.fun
            </a>
            . We read every message and aim to respond within a few business days.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-border/60 space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-muted">Common topics</p>
          <ul className="space-y-2 text-sm font-semibold text-muted">
            <li>Game not loading or crashing</li>
            <li>Suggest a game to add</li>
            <li>Report inappropriate content</li>
            <li>Advertising and partnership inquiries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
