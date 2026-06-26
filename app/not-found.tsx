import Link from 'next/link';

export default function NotFound() {
  return <section className="page-hero"><div className="shell"><p className="eyebrow">404</p><h1>That page is not available.</h1><p className="page-intro">Return to the portfolio to explore projects, experience and CV formats.</p><Link href="/" className="button button-primary">Back to Home</Link></div></section>;
}