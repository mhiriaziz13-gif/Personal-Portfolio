'use client';

import { useState } from 'react';
import type { ValueCard } from '@/lib/cms-types';

export function ValueExplorer({ cards }: { cards: ValueCard[] }) {
  const [active, setActive] = useState(0);
  const current = cards[active] || cards[0];

  if (!current) return null;

  return <div className="value-explorer"><div className="value-grid" role="tablist" aria-label="Areas of contribution">{cards.map((card, index) => <button type="button" role="tab" aria-selected={active === index} aria-controls={`value-panel-${index}`} id={`value-tab-${index}`} className={active === index ? 'value-card value-card-active' : 'value-card'} onClick={() => setActive(index)} key={card.id || card.title}><span>{card.kicker}</span><strong>{card.title}</strong><small>{card.body}</small></button>)}</div><aside className="value-detail" role="tabpanel" id={`value-panel-${active}`} aria-labelledby={`value-tab-${active}`}><p className="eyebrow">{current.kicker} / Focus</p><h3>{current.title}</h3><p>{current.detail}</p></aside></div>;
}
