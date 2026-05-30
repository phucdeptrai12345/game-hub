import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'GameZone privacy policy — how we handle your data and what information we collect.',
};

const LAST_UPDATED = 'May 2025';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-black text-fg mb-3">{title}</h2>
      <div className="text-muted leading-relaxed font-semibold text-[0.95rem] space-y-3">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-black text-fg title-display uppercase tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted font-semibold text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <Section title="What we collect">
          <p>
            GameZone does not require account registration and does not collect personal information
            such as names, email addresses, or passwords to use the site.
          </p>
          <p>
            Like most websites, our server logs may record standard technical information including
            IP addresses, browser type, pages visited, and timestamps. This data is used solely for
            operating and improving the service.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            We store a small cookie to remember your theme preference (light or dark mode). No
            tracking cookies are set by GameZone itself.
          </p>
          <p>
            Third-party services embedded on this site (such as game providers and advertisers) may
            set their own cookies subject to their own privacy policies.
          </p>
        </Section>

        <Section title="Games and third-party content">
          <p>
            Games on GameZone are provided by third-party developers and platforms. When you play a
            game, your browser communicates directly with the game provider's servers. Their privacy
            practices are governed by their own policies, not ours.
          </p>
        </Section>

        <Section title="Advertising">
          <p>
            GameZone may display third-party advertisements. Ad networks may use cookies and similar
            technologies to serve relevant ads based on your browsing behavior. You can opt out of
            interest-based advertising through your browser settings or industry opt-out tools.
          </p>
        </Section>

        <Section title="Children">
          <p>
            GameZone is not directed at children under 13. We do not knowingly collect information
            from children under 13.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Reach us through the <a href="/contact" className="text-accent hover:text-accent-hover transition-colors duration-150">contact page</a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
