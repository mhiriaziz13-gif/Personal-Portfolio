'use client';

import { useEffect, useState } from 'react';

export function HeroDataSculpture() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <div className={reducedMotion ? 'data-sculpture static' : 'data-sculpture'} aria-label="Abstract visual showing customer, operational and commercial data becoming business action" role="img">
      <div className="sculpture-grid" />
      <div className="sculpture-plane plane-a" />
      <div className="sculpture-plane plane-b" />
      <div className="sculpture-path path-a" />
      <div className="sculpture-path path-b" />
      <span className="signal-node node-a">Customer</span>
      <span className="signal-node node-b">Operations</span>
      <span className="signal-node node-c">Marketing</span>
      <span className="signal-node node-d">Insights</span>
      <span className="signal-node node-e">Growth</span>
      <div className="sculpture-caption"><span>Signals</span><i /><span>Actions</span></div>
    </div>
  );
}
