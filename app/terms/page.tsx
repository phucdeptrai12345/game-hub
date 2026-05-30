import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'GameZone terms of use — rules for using the site and playing games.',
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

export default function TermsPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-black text-fg title-display uppercase tracking-tight mb-2">
          Terms of Use
        </h1>
        <p className="text-muted font-semibold text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <Section title="Acceptance">
          <p>
            By accessing or using GameZone, you agree to these Terms of Use. If you do not agree,
            please do not use the site.
          </p>
        </Section>

        <Section title="Use of the site">
          <p>
            GameZone is provided for personal, non-commercial entertainment. You may not use the
            site to scrape content, distribute malware, circumvent access controls, or engage in any
            activity that disrupts the service for other users.
          </p>
        </Section>

        <Section title="Games and content">
          <p>
            Games available on GameZone are provided by third-party developers. Intellectual
            property rights for individual games belong to their respective developers and publishers.
          </p>
          <p>
            GameZone makes no warranties about the accuracy, reliability, or fitness of any game or
            content on the site. Games are provided on an "as is" basis.
          </p>
        </Section>

        <Section title="Disclaimer of warranties">
          <p>
            GameZone is provided without warranties of any kind, express or implied. We do not
            guarantee uninterrupted access or that the service will be free from errors.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the maximum extent permitted by law, GameZone shall not be liable for any indirect,
            incidental, or consequential damages arising from use of the site.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms at any time. Continued use of GameZone after changes
            constitutes acceptance of the revised terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions? Visit our <a href="/contact" className="text-accent hover:text-accent-hover transition-colors duration-150">contact page</a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
