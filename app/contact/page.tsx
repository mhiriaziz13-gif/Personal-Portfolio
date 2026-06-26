import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { ContactForm } from '@/components/contact-form';
import { Icon } from '@/components/icons';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'Contact', description: 'Contact Ahmed Aziz Mhiri about marketing analytics, commercial analytics, business intelligence, automation and digital growth opportunities.', alternates: { canonical: '/contact' }, openGraph: { title: 'Contact | Ahmed Aziz Mhiri', description: 'Connect about analytics, automation, digital growth and Europe-focused opportunities.' } };

export default async function ContactPage() {
  const { profile } = await getPortfolioContent();
  return <><PageHero eyebrow="Contact" title="Start a professional conversation." intro="For recruiters, managers and collaborators interested in marketing analytics, commercial analytics, business intelligence, automation, revenue operations or digital growth." /><section className="section"><div className="shell contact-grid"><div className="contact-details"><p className="eyebrow">Direct contact</p><h2>For roles and collaborations from Summer 2027.</h2><p>Based in {profile.location} and open to Europe-based opportunities, especially in {profile.targetCountries.join(', ')}.</p><a href={`mailto:${profile.email}`} className="contact-link"><Icon name="mail" /><span><small>Email</small>{profile.email}</span></a><a href={profile.linkedIn} target="_blank" rel="noreferrer" className="contact-link"><Icon name="linkedin" /><span><small>Professional network</small>LinkedIn profile</span><Icon name="external" /></a></div><ContactForm /></div></section></>;
}