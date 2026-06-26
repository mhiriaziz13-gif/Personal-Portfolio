import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Icon } from '@/components/icons';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'About', description: 'About Ahmed Aziz Mhiri, a Business Intelligence graduate and Big Data Analytics and E-Commerce master\'s student focused on data, marketing, operations and commercial performance.', alternates: { canonical: '/about' }, openGraph: { title: 'About | Ahmed Aziz Mhiri', description: 'A business intelligence foundation applied to analytics, digital growth and automation.' } };

export default async function AboutPage() {
  const { profile } = await getPortfolioContent();
  return <><PageHero eyebrow="About" title="Data, marketing and operations, connected to business decisions." intro="A profile shaped by business intelligence, digital marketing, process automation and the practical decisions that make teams more effective." /><section className="section"><div className="shell about-grid"><div className="about-portrait"><img src={profile.portraitUrl} alt="Portrait of Ahmed Aziz Mhiri" width="1003" height="1003" /></div><div className="about-copy"><p className="eyebrow">Profile</p><h2>{profile.aboutHeading}</h2><p>{profile.summary}</p><p>{profile.aboutBody}</p><p>{profile.longTermObjective}</p><div className="about-facts"><article><span>Based in</span><strong>{profile.location}</strong></article><article><span>Focus</span><strong>Analytics, growth and automation</strong></article><article><span>Availability</span><strong>{profile.availability}</strong></article></div><div className="hero-actions"><Link href="/projects" className="button button-primary">View Selected Projects <Icon name="arrow" /></Link><Link href="/resume" className="button button-secondary"><Icon name="download" /> Download CV</Link></div></div></div></section></>;
}