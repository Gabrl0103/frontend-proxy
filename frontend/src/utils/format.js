/**
 * Formatea un número grande con separadores de miles.
 */
export const formatNumber = (n) => {
  if (n === null || n === undefined) return '—';
  if (n >= 1_000_000_000) return 'Ilimitado';
  if (n > 999_999_999) return 'Ilimitado';
  return new Intl.NumberFormat('es-CO').format(n);
};

/**
 * Convierte tokens a una unidad legible (k / M).
 */
export const formatTokens = (n) => {
  if (!n && n !== 0) return '—';
  if (n > 999_999_999) return '∞';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

/**
 * Devuelve colores y etiqueta del badge según el plan.
 */
export const getPlanStyle = (plan) => {
  switch (plan?.toLowerCase()) {
    case 'free':
      return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7', label: 'FREE' };
    case 'pro':
      return { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9', label: 'PRO' };
    case 'enterprise':
      return { bg: '#fce4ec', color: '#880e4f', border: '#f48fb1', label: 'ENTERPRISE' };
    default:
      return { bg: '#f5f5f5', color: '#616161', border: '#e0e0e0', label: plan || '—' };
  }
};

/**
 * Estima tokens localmente para el estimador en tiempo real.
 * Fórmula: ceil(chars / 4) + 50 de reserva para respuesta.
 */
export const estimateTokensLocal = (prompt) => {
  if (!prompt) return 0;
  return Math.ceil(prompt.length / 4) + 50;
};
