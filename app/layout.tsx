import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { SiteChrome } from '@/components/site-chrome';
import { getPortfolioContent } from '@/lib/cms';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const googleTagId = 'G-NXZE2F87JD';

function safeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Ahmed Aziz Mhiri | Marketing Data Analysis, BI and Automation', template: '%s | Ahmed Aziz Mhiri' },
  description: 'Portfolio of Ahmed Aziz Mhiri, focused on marketing data analysis, business intelligence, process automation, commercial analytics and digital marketing.',
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', locale: 'en_US', url: '/', title: 'Ahmed Aziz Mhiri | Marketing Data Analysis, BI and Automation', description: 'Data, automation, marketing and operations work for clearer processes and better-informed commercial decisions.', images: [{ url: '/og-cover.svg', width: 1200, height: 630, alt: 'Ahmed Aziz Mhiri portfolio cover' }] },
  twitter: { card: 'summary_large_image', title: 'Ahmed Aziz Mhiri', description: 'Marketing data analysis, business intelligence, commercial analytics, automation and digital marketing.' },
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
        <SpeedInsights />
        <Analytics />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} strategy="afterInteractive" />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleTagId}');
          `}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      </body>
    </html>
  );
}
