export function ProjectCover({ type, imageUrl }: { type: 'automation' | 'journey' | 'architecture'; imageUrl?: string | null }) {
  const labels = type === 'automation'
    ? ['Invoice', 'Booking', 'Rules', 'JSON', 'Audit']
    : type === 'journey'
      ? ['Discover', 'Visit', 'Book', 'Engage', 'Return']
      : ['Users', 'Interface', 'Services', 'Knowledge', 'Secure'];
  const style = imageUrl ? { backgroundImage: `linear-gradient(135deg, rgba(9, 21, 36, 0.72), rgba(13, 27, 47, 0.35)), url(${JSON.stringify(imageUrl)})` } : undefined;
  return (
    <div className={`project-cover cover-${type}${imageUrl ? ' project-cover-image' : ''}`} style={style} aria-hidden="true">
      <span className="cover-index">0{type === 'automation' ? '1' : type === 'journey' ? '2' : '3'}</span>
      <div className="cover-line" />
      <div className="cover-nodes">
        {labels.map((label, i) => <span className={`cover-node n${i + 1}`} key={label}>{label}</span>)}
      </div>
      <div className="cover-pulse" />
    </div>
  );
}
