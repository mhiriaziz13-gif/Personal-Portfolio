import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Icon } from '@/components/icons';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'About', description: 'About Ahmed Aziz Mhiri, a Business Intelligence graduate and Big Data Analytics and E-Commerce master\'s student focused on data, marketing, operations, automation and commercial performance.', alternates: { canonical: '/about' }, openGraph: { title: 'About | Ahmed Aziz Mhiri', description: 'A business intelligence background applied to analytics, digital marketing, operations and automation.' } };

export default async function AboutPage() {
  const { profile } = await getPortfolioContent();
  return <><PageHero eyebrow="About" title="Data, marketing, operations and automation." intro="A short profile of Ahmed Aziz Mhiri: Business Intelligence graduate, Big Data Analytics and E-Commerce master\'s student, and early-career professional focused on practical analytics work." /><section className="section"><div className="shell about-grid"><div className="about-portrait"><img src={profile.portraitUrl} alt="Portrait of Ahmed Aziz Mhiri" width="1003" height="1003" /></div><div className="about-copy"><p className="eyebrow">Profile</p><h2>{profile.aboutHeading}</h2><p>{profile.aboutBody}</p><p>{profile.longTermObjective}</p><p>I am especially interested in work that helps teams understand performance, improve customer journeys, reduce manual checks and make commercial follow-up easier to trust.</p><div className="about-facts"><article><span>Based in</span><strong>{profile.location}</strong></article><article><span>Focus</span><strong>Analytics, operations and automation</strong></article><article><span>Availability</span><strong>{profile.availability}</strong></article></div><div className="hero-actions"><Link href="/projects" className="button button-primary">View Selected Projects <Icon name="arrow" /></Link><Link href="/resume" className="button button-secondary"><Icon name="download" /> Download CV</Link></div></div></div></section></>;
}
