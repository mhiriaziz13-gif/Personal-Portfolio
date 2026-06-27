import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { PageHero } from '@/components/page-hero';
import { ContactForm } from '@/components/contact-form';
import { Icon } from '@/components/icons';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'Contact', description: 'Contact Ahmed Aziz Mhiri about analytics, business intelligence, automation, digital marketing and commercial operations opportunities.', alternates: { canonical: '/contact' }, openGraph: { title: 'Contact | Ahmed Aziz Mhiri', description: 'Contact Ahmed about analytics, automation, digital marketing and Europe-focused opportunities.' } };

export default async function ContactPage() {
  const nonce = (await headers()).get('x-nonce') || undefined;
  const { profile } = await getPortfolioContent();
  return <><PageHero eyebrow="Contact" title="Get in touch." intro="For recruitment conversations, project discussions or professional contact related to analytics, automation, commercial operations, digital marketing or business systems." /><section className="section"><div className="shell contact-grid"><div className="contact-details"><p className="eyebrow">Direct contact</p><h2>Available for Europe-based opportunities from Summer 2027.</h2><p>Based in {profile.location}. Target countries include {profile.targetCountries.join(', ')}.</p><a href={`mailto:${profile.email}`} className="contact-link"><Icon name="mail" /><span><small>Email</small>{profile.email}</span></a><a href={profile.linkedIn} target="_blank" rel="noreferrer" className="contact-link"><Icon name="linkedin" /><span><small>Professional network</small>LinkedIn profile</span><Icon name="external" /></a></div><ContactForm nonce={nonce} turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} /></div></section></>;
}
