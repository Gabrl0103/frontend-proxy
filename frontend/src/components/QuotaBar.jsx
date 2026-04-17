import { formatTokens } from '../utils/format';

export default function QuotaBar({ status }) {
  if (!status) return null;

  const isUnlimited = status.totalQuota > 999_999_999;
  const pct = isUnlimited ? 0 : Math.min(100, status.usagePercentage);

  const barColor =
    pct >= 90 ? '#e53935' :
    pct >= 70 ? '#fb8c00' :
    '#43a047';

  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 6px #0001' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>Cuota Mensual de Tokens</span>
        <span style={{ fontSize: '0.82rem', color: '#666' }}>
          {isUnlimited ? '∞ Ilimitado' : `${formatTokens(status.tokensUsed)} / ${formatTokens(status.totalQuota)}`}
        </span>
      </div>

      <div style={{ background: '#f0f0f0', borderRadius: 8, height: 10, overflow: 'hidden' }}>
        <div style={{
          width: isUnlimited ? '100%' : `${pct}%`,
          height: '100%',
          background: isUnlimited
            ? 'linear-gradient(90deg,#880e4f,#e91e63)'
            : `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
          borderRadius: 8,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {!isUnlimited && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: '0.75rem', color: '#888' }}>
            {formatTokens(status.tokensRemaining)} restantes
          </span>
          <span style={{ fontSize: '0.75rem', color: pct >= 90 ? '#e53935' : '#888' }}>
            {pct.toFixed(1)}% usado
          </span>
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#aaa' }}>
        Reset: {status.resetDate}
      </div>
    </div>
  );
}
