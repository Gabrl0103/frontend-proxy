import { getPlanStyle } from '../utils/format';

export default function PlanBadge({ plan, size = 'md' }) {
  const style = getPlanStyle(plan);
  const sizes = {
    sm: { fontSize: '0.7rem', padding: '2px 8px' },
    md: { fontSize: '0.78rem', padding: '4px 12px' },
    lg: { fontSize: '0.9rem', padding: '6px 16px' },
  };

  return (
    <span style={{
      display: 'inline-block',
      background: style.bg,
      color: style.color,
      border: `1.5px solid ${style.border}`,
      borderRadius: '20px',
      fontWeight: 700,
      letterSpacing: '0.06em',
      ...sizes[size],
    }}>
      {style.label}
    </span>
  );
}
