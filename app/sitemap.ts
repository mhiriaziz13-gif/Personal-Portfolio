import type { MetadataRoute } from 'next';
import { getPortfolioContent } from '@/lib/cms';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getPortfolioContent();
  const routes = ['', '/projects', '/experience', '/about', '/resume', '/contact'];
  return [
    ...routes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: route === '' ? 1 : 0.7 })),
    ...projects.map((project) => ({ url: `${baseUrl}/projects/${project.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 })),
  ];
}
