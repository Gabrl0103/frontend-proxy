import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatTokens } from '../utils/format';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', borderRadius: 10, padding: '8px 14px',
      boxShadow: '0 2px 12px #0002', fontSize: '0.82rem',
    }}>
      <p style={{ margin: 0, fontWeight: 700, color: '#333' }}>{label}</p>
      <p style={{ margin: '2px 0 0', color: '#5c6bc0' }}>
        {formatTokens(payload[0].value)} tokens
      </p>
    </div>
  );
};

export default function UsageChart({ history }) {
  if (!history?.length) return (
    <div style={{ textAlign: 'center', color: '#bbb', padding: '30px 0', fontSize: '0.85rem' }}>
      Sin datos de historial todavía
    </div>
  );

  const data = history.map((d) => ({
    day: d.dayLabel,
    tokens: d.tokensUsed,
  }));

  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 6px #0001' }}>
      <h3 style={{ margin: '0 0 16px', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
        Uso de Tokens — Últimos 7 días
      </h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatTokens} tick={{ fontSize: 11, fill: '#bbb' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f4ff' }} />
          <Bar dataKey="tokens" fill="#5c6bc0" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
