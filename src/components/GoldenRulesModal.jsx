import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { CheckCircle2, Circle, X } from 'lucide-react';

export default function GoldenRulesModal({ isOpen, onClose }) {
  const { data, updateRegraOuro } = useFinance();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '24px',
        background: 'var(--bg-secondary)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✨ Regras de Ouro do Planejamento
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Princípios fundamentais para garantir a estabilidade financeira familiar.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
          {data.regrasOuro.map((regra) => (
            <div
              key={regra.id}
              onClick={() => updateRegraOuro(regra.id, !regra.checked)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: regra.checked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-primary)',
                border: `1px solid ${regra.checked ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {regra.checked ? (
                <CheckCircle2 size={20} color="var(--accent-green)" />
              ) : (
                <Circle size={20} color="var(--text-muted)" />
              )}
              <span style={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: regra.checked ? 'var(--text-primary)' : 'var(--text-muted)',
                textDecoration: regra.checked ? 'none' : 'line-through'
              }}>
                {regra.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} className="btn btn-primary">
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
}
