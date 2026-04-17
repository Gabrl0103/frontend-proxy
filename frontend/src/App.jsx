import { useState } from 'react';
import { Bot } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import QuotaBar from './components/QuotaBar';
import RateLimitCounter from './components/RateLimitCounter';
import UsageChart from './components/UsageChart';
import PlanBadge from './components/PlanBadge';
import UpgradeModal from './components/UpgradeModal';
import { useQuota } from './hooks/useQuota';
import { useRateLimitCountdown } from './hooks/useRateLimitCountdown';

const USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || 'default-user';

export default function App() {
  const { status, history, loading, refresh } = useQuota(USER_ID);
  const { secondsLeft, isBlocked, startCountdown } = useRateLimitCountdown();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleRateLimitError = (retryAfter) => {
    startCountdown(retryAfter || 60);
  };

  const handleQuotaError = () => {
    setShowUpgrade(true);
  };

  const handleUpgraded = () => {
    refresh();
  };

  const isQuotaExhausted =
    status &&
    status.totalQuota <= 999_999_999 &&
    status.tokensRemaining <= 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7ff 0%, #eff1fb 100%)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Header */}
      <header style={{
        background: '#fff', borderBottom: '1px solid #eee',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 6px #0001',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: '#ede7f6', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={20} color="#7e57c2" />
          </div>
          <div>
            <span style={{ fontWeight: 700, color: '#222', fontSize: '1rem' }}>AI Proxy Platform</span>
            <span style={{ color: '#aaa', fontSize: '0.72rem', display: 'block', lineHeight: 1 }}>
              Patrón Proxy · Rate Limit &amp; Cuotas
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#999', fontSize: '0.82rem' }}>Usuario: <strong>{USER_ID}</strong></span>
          {!loading && status && <PlanBadge plan={status.plan} />}

          {isQuotaExhausted && (
            <button
              onClick={() => setShowUpgrade(true)}
              style={{
                background: '#5c6bc0', color: '#fff', border: 'none',
                borderRadius: 10, padding: '7px 16px', fontSize: '0.82rem',
                fontWeight: 700, cursor: 'pointer',
              }}
            >
              ⬆ Upgrade
            </button>
          )}
        </div>
      </header>

      {/* Main layout */}
      <main style={{
        maxWidth: 1100, margin: '0 auto', padding: '24px 16px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: 20,
        alignItems: 'start',
      }}>
        {/* Columna izquierda: Chat */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <h2 style={{ margin: '0 0 12px', fontWeight: 700, color: '#333', fontSize: '1rem' }}>
            🖊 Chat con IA
          </h2>
          <ChatInterface
            quotaStatus={status}
            isBlocked={isBlocked}
            secondsLeft={secondsLeft}
            onSuccess={refresh}
            onRateLimitError={handleRateLimitError}
            onQuotaError={handleQuotaError}
            userId={USER_ID}
          />
        </section>

        {/* Columna derecha: Métricas */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ margin: '0 0 0', fontWeight: 700, color: '#333', fontSize: '1rem' }}>
            📊 Estado del Plan
          </h2>

          {loading ? (
            <div style={{ color: '#bbb', fontSize: '0.88rem', padding: '20px 0' }}>
              Cargando estado…
            </div>
          ) : (
            <>
              <QuotaBar status={status} />
              <RateLimitCounter
                status={status}
                secondsLeft={secondsLeft}
                isBlocked={isBlocked}
              />
              <UsageChart history={history} />

              {/* Info del plan */}
              {status && (
                <div style={{
                  background: '#fff', borderRadius: 14, padding: '14px 20px',
                  boxShadow: '0 1px 6px #0001', fontSize: '0.82rem', color: '#666',
                }}>
                  <div style={{ fontWeight: 600, color: '#333', marginBottom: 8 }}>
                    Detalles del Plan
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <Row label="Plan actual" value={<PlanBadge plan={status.plan} size="sm" />} />
                    <Row label="Req. este minuto" value={`${status.requestsInCurrentMinute} / ${status.requestsPerMinuteLimit >= 2e9 ? '∞' : status.requestsPerMinuteLimit}`} />
                    <Row label="Reset cuota" value={status.resetDate} />
                  </div>

                  {status.plan?.toLowerCase() !== 'enterprise' && (
                    <button
                      onClick={() => setShowUpgrade(true)}
                      style={{
                        marginTop: 12, width: '100%', background: '#f3f4f6',
                        border: '1.5px solid #e0e0e0', borderRadius: 10, padding: '9px 0',
                        fontSize: '0.82rem', fontWeight: 600, color: '#5c6bc0',
                        cursor: 'pointer', transition: 'background 0.2s',
                      }}
                    >
                      ⬆ Mejorar plan
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Modal upgrade */}
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onUpgraded={handleUpgraded}
          userId={USER_ID}
          currentPlan={status?.plan}
        />
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#999' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#444' }}>{value}</span>
    </div>
  );
}
