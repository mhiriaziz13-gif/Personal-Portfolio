import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { ContactForm } from '@/components/contact-form';
import { Icon } from '@/components/icons';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'Contact', description: 'Contact Ahmed Aziz Mhiri for Europe-focused opportunities in Marketing Analytics, Commercial Analytics, BI, Digital Growth and Automation.', alternates: { canonical: '/contact' }, openGraph: { title: 'Contact | Ahmed Aziz Mhiri', description: 'Connect regarding Europe-focused roles in analytics, automation and digital growth.' } };

export default async function ContactPage() {
  const { profile } = await getPortfolioContent();
  return <><PageHero eyebrow="Contact" title="Start a professional conversation." intro="Open to connecting with teams and professionals working in Marketing Analytics, Commercial Analytics, Business Intelligence, E-Commerce, Revenue Operations and Digital Growth." /><section className="section"><div className="shell contact-grid"><div className="contact-details"><p className="eyebrow">Direct contact</p><h2>For opportunities from Summer 2027.</h2><p>Based in {profile.location} and available for Europe-based opportunities in {profile.targetCountries.join(', ')}.</p><a href={`mailto:${profile.email}`} className="contact-link"><Icon name="mail" /><span><small>Email</small>{profile.email}</span></a><a href={profile.linkedIn} target="_blank" rel="noreferrer" className="contact-link"><Icon name="linkedin" /><span><small>Professional network</small>LinkedIn profile</span><Icon name="external" /></a></div><ContactForm /></div></section></>;
}
