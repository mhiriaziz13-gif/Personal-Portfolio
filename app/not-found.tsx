import Link from 'next/link';

export default function NotFound() {
  return <section className="page-hero"><div className="shell"><p className="eyebrow">404</p><h1>That page is not available.</h1><p className="page-intro">Return to the portfolio overview to explore projects, experience and CVs.</p><Link href="/" className="button button-primary">Back to home</Link></div></section>;
}
