'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { navItems } from '@/data/site';
import type { Profile } from '@/lib/cms-types';
import { Icon } from './icons';

export function SiteHeader({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="site-header">
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
      <div className="shell nav-wrap">
        <Link href="/" className="brand" aria-label={`${profile.name} home`}>
          <span className="brand-mark">AAM</span>
          <span className="brand-name">{profile.name}</span>
        </Link>
        <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
        <nav className={open ? 'nav-links nav-links-open' : 'nav-links'} aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} className={active ? 'nav-link active' : 'nav-link'}>{item.label}</Link>;
          })}
          <Link href="/resume" className="nav-cv"><Icon name="download" /> Download CV</Link>
        </nav>
      </div>
    </header>
  );
}
