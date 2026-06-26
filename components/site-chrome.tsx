'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Profile } from '@/lib/cms-types';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

export function SiteChrome({ profile, children }: { profile: Profile; children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return <main id="main-content">{children}</main>;

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader profile={profile} />
    <main id="main-content">{children}</main>
    <SiteFooter profile={profile} />
  </>;
}
