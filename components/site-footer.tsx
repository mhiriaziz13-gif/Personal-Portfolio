import Link from 'next/link';
import { navItems } from '@/data/site';
import type { Profile } from '@/lib/cms-types';
import { Icon } from './icons';

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">Data, automation and business operations.</p>
          <h2>{profile.tagline}</h2>
          <p className="footer-copy">A portfolio focused on marketing data analysis, business intelligence, customer journeys, process automation and commercial operations.</p>
        </div>
        <div className="footer-links">
          <p className="footer-label">Navigate</p>
          {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </div>
        <div className="footer-links">
          <p className="footer-label">Connect</p>
          <a href={`mailto:${profile.email}`}><Icon name="mail" /> {profile.email}</a>
          <a href={profile.linkedIn} target="_blank" rel="noreferrer"><Icon name="linkedin" /> LinkedIn</a>
          <Link href="/resume"><Icon name="download" /> Download CV</Link>
        </div>
      </div>
      <div className="shell footer-base"><span>(c) {new Date().getFullYear()} {profile.name}</span><span>{profile.location}</span></div>
    </footer>
  );
}
