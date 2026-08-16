import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, ShieldAlert, CheckCircle, AlertTriangle, PlayCircle, Compass } from 'lucide-react';

export default function PatrimonyFutureSection() {
  const { data, updatePatrimonioSituacao } = useFinance();

  const getStatusBadge = (situacao) => {
    switch (situacao) {
      case 'Ok':
        return { level: 'verde', icon: CheckCircle, label: 'Ok' };
      case 'Iniciar':
        return { level: 'verde', icon: PlayCircle, label: 'Iniciar' };
      case 'Planejar':
        return { level: 'verde', icon: Compass, label: 'Planejar' };
      case 'Ajustar':
        return { level: 'amarelo', icon: AlertTriangle, label: 'Ajustar' };
      case 'Crítico':
        return { level: 'vermelho', icon: ShieldAlert, label: 'Crítico' };
      default:
        return { level: 'amarelo', icon: AlertTriangle, label: situacao };
    }
  };

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp color="var(--accent-green)" size={24} />
          4. CONSTRUÇÃO DE PATRIMÔNIO E FUTURO
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Recomendações e situação atual da previdência, carteira de investimentos e proteção do futuro.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {data.patrimonioFuturo.map((item) => {
          const badge = getStatusBadge(item.situacao);
          const IconComp = badge.icon;

          return (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.item}
                  </h3>
                  <span className={`status-badge ${badge.level}`}>
                    <IconComp size={12} /> {badge.label}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  💡 <strong>Recomendação:</strong> <br />
                  {item.recomendacao}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px dashed var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alterar Situação:</span>
                <select
                  value={item.situacao}
                  onChange={(e) => updatePatrimonioSituacao(item.id, e.target.value)}
                  style={{ fontSize: '0.8rem', fontWeight: 'bold' }}
                >
                  <option value="Ok">Ok</option>
                  <option value="Iniciar">Iniciar</option>
                  <option value="Planejar">Planejar</option>
                  <option value="Ajustar">Ajustar</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
