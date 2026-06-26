import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Icon } from '@/components/icons';
import { getPortfolioContent } from '@/lib/cms';

export const metadata: Metadata = { title: 'About', description: 'About Ahmed Aziz Mhiri - a Master’s student in Big Data Analytics & E-Commerce with a Business Intelligence background.', alternates: { canonical: '/about' }, openGraph: { title: 'About | Ahmed Aziz Mhiri', description: 'Business Intelligence foundation applied to data, growth and automation.' } };

export default async function AboutPage() {
  const { profile } = await getPortfolioContent();
  return <><PageHero eyebrow="About" title="A business intelligence foundation, applied to commercial growth." intro="A profile shaped by data, digital marketing, automation and the practical business decisions behind them." /><section className="section"><div className="shell about-grid"><div className="about-portrait"><img src={profile.portraitUrl} alt="Portrait of Ahmed Aziz Mhiri" width="1003" height="1003" /></div><div className="about-copy"><p className="eyebrow">Profile</p><h2>{profile.aboutHeading}</h2><p>{profile.summary}</p><p>{profile.aboutBody}</p><p>{profile.longTermObjective}</p><div className="about-facts"><article><span>Based in</span><strong>{profile.location}</strong></article><article><span>Focus</span><strong>Data, growth & automation</strong></article><article><span>Availability</span><strong>{profile.availability}</strong></article></div><div className="hero-actions"><Link href="/projects" className="button button-primary">View projects <Icon name="arrow" /></Link><Link href="/resume" className="button button-secondary"><Icon name="download" /> Resume centre</Link></div></div></div></section></>;
}
