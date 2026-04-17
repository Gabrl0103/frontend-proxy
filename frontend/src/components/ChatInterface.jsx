import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { generateText } from '../services/api';
import TokenEstimator from './TokenEstimator';

export default function ChatInterface({
  quotaStatus,
  isBlocked,
  secondsLeft,
  onSuccess,
  onRateLimitError,
  onQuotaError,
  userId,
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '¡Hola! Soy tu asistente de IA. Escribe un prompt y te generaré una respuesta. 🌀',
      meta: null,
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const isQuotaExhausted =
    quotaStatus &&
    quotaStatus.totalQuota <= 999_999_999 &&
    quotaStatus.tokensRemaining <= 0;

  const canSend = !loading && !isBlocked && !isQuotaExhausted && prompt.trim().length >= 3;

  const handleSend = async () => {
    if (!canSend) return;

    const userMsg = { role: 'user', text: prompt.trim(), meta: null };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await generateText(prompt.trim(), userId);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.generatedText,
          meta: {
            tokens: res.tokensUsed,
            ms: res.processingTimeMs,
            model: res.model,
          },
        },
      ]);
      onSuccess?.();
    } catch (err) {
      if (err.status === 429) {
        onRateLimitError?.(parseInt(err.retryAfter || '60', 10));
        setMessages((prev) => [
          ...prev,
          {
            role: 'system',
            text: `⏱ Rate limit alcanzado. Espera ${err.retryAfter || 60} segundos.`,
            meta: null,
          },
        ]);
      } else if (err.status === 402) {
        onQuotaError?.();
        setMessages((prev) => [
          ...prev,
          {
            role: 'system',
            text: '💳 Cuota mensual agotada. Haz upgrade para continuar.',
            meta: null,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'system', text: `❌ Error: ${err.message}`, meta: null },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', background: '#fff',
      borderRadius: 16, boxShadow: '0 1px 6px #0001', overflow: 'hidden', height: '100%',
    }}>
      {/* Mensajes */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 14,
        maxHeight: 420, minHeight: 280,
      }}>
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Avatar role="assistant" />
            <div style={{
              background: '#f5f5f5', borderRadius: '4px 16px 16px 16px',
              padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Loader size={16} color="#5c6bc0" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: '#999', fontSize: '0.88rem' }}>Generando respuesta…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 16px' }}>
        <TokenEstimator prompt={prompt} quotaStatus={quotaStatus} />

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isBlocked ? `Bloqueado por rate limit (${secondsLeft}s)…` :
              isQuotaExhausted ? 'Cuota agotada — haz upgrade…' :
              'Escribe un prompt… (Enter para enviar)'
            }
            disabled={isBlocked || isQuotaExhausted || loading}
            rows={2}
            style={{
              flex: 1, resize: 'none', border: '1.5px solid #e0e0e0',
              borderRadius: 12, padding: '10px 14px', fontSize: '0.9rem',
              outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
              background: (isBlocked || isQuotaExhausted) ? '#f9f9f9' : '#fff',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            style={{
              background: canSend ? '#5c6bc0' : '#e0e0e0',
              border: 'none', borderRadius: 12, padding: '0 18px',
              cursor: canSend ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s', display: 'flex', alignItems: 'center',
            }}
          >
            <Send size={18} color={canSend ? '#fff' : '#bbb'} />
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Avatar({ role }) {
  const isAssistant = role === 'assistant';
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
      background: isAssistant ? '#ede7f6' : '#e3f2fd',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {isAssistant
        ? <Bot size={16} color="#7e57c2" />
        : <User size={16} color="#1565c0" />}
    </div>
  );
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div style={{
        textAlign: 'center', background: '#fff8e1', border: '1px solid #ffe082',
        borderRadius: 10, padding: '8px 14px', fontSize: '0.82rem', color: '#5d4037',
      }}>
        {message.text}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row',
    }}>
      <Avatar role={message.role} />
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          background: isUser ? '#5c6bc0' : '#f5f5f5',
          color: isUser ? '#fff' : '#333',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          padding: '11px 15px', fontSize: '0.9rem', lineHeight: 1.6,
        }}>
          {message.text}
        </div>
        {message.meta && (
          <div style={{ marginTop: 4, fontSize: '0.72rem', color: '#bbb', textAlign: 'right' }}>
            {message.meta.tokens} tokens · {message.meta.ms}ms · {message.meta.model}
          </div>
        )}
      </div>
    </div>
  );
}
