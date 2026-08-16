import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Heart, Users, Baby, Compass, CheckCircle2 } from 'lucide-react';

export default function LifeStageSection() {
  const { data } = useFinance();
  const [activeStageId, setActiveStageId] = useState(3); // Default "3. COM 2 FILHOS" matching profile

  const getIcon = (id) => {
    switch (id) {
      case 1: return Heart;
      case 2: return Baby;
      case 3: return Users;
      case 4: return Compass;
      default: return Users;
    }
  };

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart color="var(--accent-rose)" size={24} />
          6. PLANEJAMENTO POR FASE DA VIDA
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Ajuste o plano conforme sua fase de vida. O planejamento evita preocupações futuras!
        </p>
      </div>

      {/* Stage Selector Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {data.fasesVida.map((fase) => {
          const IconComponent = getIcon(fase.id);
          const isActive = fase.id === activeStageId;

          return (
            <button
              key={fase.id}
              onClick={() => setActiveStageId(fase.id)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <IconComponent size={16} />
              {fase.fase}
              {fase.id === 3 && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  background: isActive ? '#ffffff' : 'var(--accent-blue)',
                  color: isActive ? 'var(--accent-blue)' : '#ffffff',
                  fontWeight: 'bold',
                  marginLeft: '4px'
                }}>
                  Sua Fase
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail */}
      {data.fasesVida.filter(f => f.id === activeStageId).map((fase) => (
        <div
          key={fase.id}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '20px'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', marginBottom: '12px' }}>
            Principais Focos para: {fase.fase}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {fase.dicas.map((dica, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <CheckCircle2 size={18} color="var(--accent-green)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {dica}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
