import type { SVGProps } from 'react';

type IconName = 'arrow' | 'download' | 'external' | 'mail' | 'menu' | 'close' | 'linkedin' | 'chevron' | 'check';

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    external: <><path d="M14 3h7v7" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    linkedin: <><path d="M6.5 9.5v8" /><path d="M6.5 6.5v.01" /><path d="M10.5 17.5v-8" /><path d="M10.5 13c0-2 1.2-3.5 3.2-3.5s3.3 1.4 3.3 3.8v4.2" /><rect x="3" y="3" width="18" height="18" rx="2" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg {...common} {...props}>{paths[name]}</svg>;
}
