import { useState } from 'react';
import { X, CreditCard, Check, Zap, Star, Building2 } from 'lucide-react';
import { upgradePlan } from '../services/api';

const PLANS = [
  {
    key: 'PRO',
    icon: <Star size={20} />,
    name: 'Pro',
    price: '$9.99/mes',
    color: '#1565c0',
    bg: '#e3f2fd',
    border: '#90caf9',
    features: ['60 requests/minuto', '500k tokens/mes', 'Soporte prioritario'],
  },
  {
    key: 'ENTERPRISE',
    icon: <Building2 size={20} />,
    name: 'Enterprise',
    price: '$49.99/mes',
    color: '#880e4f',
    bg: '#fce4ec',
    border: '#f48fb1',
    features: ['Requests ilimitados', 'Tokens ilimitados', 'SLA garantizado'],
  },
];

export default function UpgradeModal({ onClose, onUpgraded, userId, currentPlan }) {
  const [selected, setSelected] = useState('PRO');
  const [step, setStep] = useState('plan'); // 'plan' | 'payment' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availablePlans = PLANS.filter(
    (p) => p.key !== currentPlan?.toUpperCase()
  );

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      await upgradePlan(userId, selected);
      setStep('success');
      setTimeout(() => {
        onUpgraded();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 32, maxWidth: 440,
        width: '100%', position: 'relative', boxShadow: '0 8px 40px #0003',
      }}>
        {/* Cerrar */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'none',
          border: 'none', cursor: 'pointer', color: '#999', padding: 4,
        }}>
          <X size={20} />
        </button>

        {step === 'plan' && (
          <>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.3rem', color: '#222' }}>
              🚀 Mejora tu plan
            </h2>
            <p style={{ margin: '0 0 20px', color: '#888', fontSize: '0.88rem' }}>
              Has agotado tu cuota. Elige un plan para continuar.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {availablePlans.map((plan) => (
                <div
                  key={plan.key}
                  onClick={() => setSelected(plan.key)}
                  style={{
                    border: selected === plan.key ? `2px solid ${plan.color}` : '2px solid #eee',
                    borderRadius: 14, padding: '14px 18px', cursor: 'pointer',
                    background: selected === plan.key ? plan.bg : '#fafafa',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: plan.color }}>
                      {plan.icon}
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{plan.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: plan.color, fontSize: '1rem' }}>{plan.price}</span>
                  </div>
                  <ul style={{ margin: '10px 0 0', padding: '0 0 0 20px', color: '#555', fontSize: '0.82rem' }}>
                    {plan.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('payment')}
              style={{
                marginTop: 20, width: '100%', background: '#5c6bc0', color: '#fff',
                border: 'none', borderRadius: 12, padding: '13px 0', fontWeight: 700,
                fontSize: '0.95rem', cursor: 'pointer',
              }}
            >
              Continuar →
            </button>
          </>
        )}

        {step === 'payment' && (
          <>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.3rem', color: '#222' }}>
              <CreditCard size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Simulación de Pago
            </h2>
            <p style={{ margin: '0 0 20px', color: '#888', fontSize: '0.88rem' }}>
              Datos de tarjeta de prueba (simulación)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Número de tarjeta', placeholder: '4242 4242 4242 4242', type: 'text' },
                { label: 'Nombre en la tarjeta', placeholder: 'JUAN PEREZ', type: 'text' },
              ].map(({ label, placeholder, type }) => (
                <div key={label}>
                  <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    defaultValue={placeholder}
                    style={{
                      display: 'block', width: '100%', marginTop: 4, padding: '10px 12px',
                      border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: '0.9rem',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Vencimiento</label>
                  <input
                    type="text" placeholder="12/27" defaultValue="12/27"
                    style={{
                      display: 'block', width: '100%', marginTop: 4, padding: '10px 12px',
                      border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: '0.9rem',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>CVV</label>
                  <input
                    type="text" placeholder="123" defaultValue="123"
                    style={{
                      display: 'block', width: '100%', marginTop: 4, padding: '10px 12px',
                      border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: '0.9rem',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 12, color: '#e53935', fontSize: '0.82rem', background: '#ffebee', borderRadius: 8, padding: '8px 12px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setStep('plan')}
                style={{
                  flex: 1, background: '#f5f5f5', color: '#555', border: 'none',
                  borderRadius: 12, padding: '13px 0', fontWeight: 600, cursor: 'pointer',
                }}
              >
                ← Volver
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                style={{
                  flex: 2, background: loading ? '#9fa8da' : '#5c6bc0', color: '#fff',
                  border: 'none', borderRadius: 12, padding: '13px 0', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem',
                }}
              >
                {loading ? 'Procesando...' : 'Pagar y activar'}
              </button>
            </div>
          </>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 64, height: 64, background: '#e8f5e9', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Check size={32} color="#2e7d32" />
            </div>
            <h2 style={{ margin: '0 0 8px', color: '#222' }}>¡Plan activado!</h2>
            <p style={{ color: '#888', fontSize: '0.88rem' }}>
              Tu plan ha sido actualizado exitosamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
