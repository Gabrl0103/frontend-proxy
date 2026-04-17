import { Zap } from 'lucide-react';

export default function RateLimitCounter({ status, secondsLeft, isBlocked }) {
  if (!status) return null;

  const isUnlimited = status.requestsPerMinuteLimit >= 2_000_000_000;
  const used = status.requestsInCurrentMinute;
  const limit = isUnlimited ? '∞' : status.requestsPerMinuteLimit;

  return (
    <div style={{
      background: isBlocked ? '#fff3e0' : '#fff',
      border: isBlocked ? '1.5px solid #fb8c00' : '1px solid #eee',
      borderRadius: 14,
      padding: '14px 20px',
      boxShadow: '0 1px 6px #0001',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Zap size={15} color={isBlocked ? '#fb8c00' : '#888'} />
        <span style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
          Rate Limit por Minuto
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: '1.6rem', fontWeight: 700, color: isBlocked ? '#fb8c00' : '#333' }}>
          {used}
        </span>
        <span style={{ color: '#999', fontSize: '0.85rem' }}>/ {limit} req/min</span>
      </div>

      {isBlocked && (
        <div style={{
          marginTop: 8,
          background: '#fff3e0',
          borderRadius: 8,
          padding: '6px 10px',
          fontSize: '0.8rem',
          color: '#e65100',
          fontWeight: 600,
        }}>
          ⏱ Bloqueado — disponible en {secondsLeft}s
        </div>
      )}
    </div>
  );
}
