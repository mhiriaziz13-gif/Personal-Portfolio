import type { Metadata } from 'next';
import './globals.css';
import { SiteChrome } from '@/components/site-chrome';
import { getPortfolioContent } from '@/lib/cms';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Ahmed Aziz Mhiri | Data-Driven Marketing & Commercial Analytics', template: '%s | Ahmed Aziz Mhiri' },
  description: 'Portfolio of Ahmed Aziz Mhiri - Data-Driven Marketing, Commercial Analytics, Business Intelligence, Automation and Digital Growth.',
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', locale: 'en_US', url: '/', title: 'Ahmed Aziz Mhiri | Data-Driven Marketing & Commercial Analytics', description: 'Turning data into commercial growth through analytics, automation and digital customer journeys.', images: [{ url: '/og-cover.svg', width: 1200, height: 630, alt: 'Ahmed Aziz Mhiri portfolio cover' }] },
  twitter: { card: 'summary_large_image', title: 'Ahmed Aziz Mhiri', description: 'Data-Driven Marketing, Commercial Analytics, Business Intelligence, Automation and Digital Growth.' },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await getPortfolioContent();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: profile.location.split(',')[0], addressCountry: 'TN' },
    jobTitle: profile.headline,
    sameAs: [profile.linkedIn],
    url: siteUrl,
  };
  return (
    <html lang="en">
      <body>
        <SiteChrome profile={profile}>{children}</SiteChrome>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </body>
    </html>
  );
}
