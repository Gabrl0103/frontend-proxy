import { estimateTokensLocal } from '../utils/format';

export default function TokenEstimator({ prompt, quotaStatus }) {
  const estimated = estimateTokensLocal(prompt);
  if (!prompt || estimated === 0) return null;

  const remaining = quotaStatus?.tokensRemaining;
  const isUnlimited = !remaining || remaining > 999_999_999;
  const willExceed = !isUnlimited && estimated > remaining;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: willExceed ? '#fff3e0' : '#f3f4f6',
      border: `1px solid ${willExceed ? '#ffb74d' : '#e0e0e0'}`,
      borderRadius: 8, padding: '5px 10px', fontSize: '0.78rem',
    }}>
      <span style={{ color: willExceed ? '#e65100' : '#666' }}>
        {willExceed ? '⚠️' : '📊'} ~{estimated} tokens estimados
      </span>
      {willExceed && (
        <span style={{ color: '#e65100', fontWeight: 600 }}>— cuota insuficiente</span>
      )}
    </div>
  );
}
