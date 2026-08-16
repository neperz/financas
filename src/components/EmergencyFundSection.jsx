import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Shield, ArrowUpRight, Clock, Target, AlertCircle, TrendingUp } from 'lucide-react';

export default function EmergencyFundSection() {
  const {
    data,
    marketData,
    getTotalGastos,
    getPoupancaMensal,
    getReservaRendimentoMensal,
    updateReservaEmergencia
  } = useFinance();

  const gastos = getTotalGastos();
  const poupancaMensal = getPoupancaMensal();
  const { mesesRecomendados, reservaAtual } = data.reservaEmergencia;

  const metaReserva = gastos * mesesRecomendados;
  const faltaMeta = Math.max(0, metaReserva - reservaAtual);
  const pctConcluido = Math.min(100, (reservaAtual / (metaReserva || 1)) * 100);

  const rendimentoMensalEstimado = getReservaRendimentoMensal();

  // Time projection
  const mesesParaConclusao = poupancaMensal > 0 ? (faltaMeta / poupancaMensal).toFixed(1) : '∞';
  const anosParaConclusao = poupancaMensal > 0 ? (faltaMeta / (poupancaMensal * 12)).toFixed(1) : '∞';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield color="var(--accent-blue)" size={24} />
            2. RESERVA DE EMERGÊNCIA
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Garantia de estabilidade contra imprevistos, desemprego e urgências.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Meses Recomendados:
          </span>
          <select
            value={mesesRecomendados}
            onChange={(e) => updateReservaEmergencia({ mesesRecomendados: Number(e.target.value) })}
            style={{ fontWeight: 'bold' }}
          >
            <option value={6}>6 meses (Mínimo)</option>
            <option value={9}>9 meses (Recomendado)</option>
            <option value={10}>10 meses (Recomendado)</option>
            <option value={12}>12 meses (Ideal)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Recommendation & Target Formula Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Sua reserva deve ser equivalente a:
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-purple)', margin: '6px 0 12px 0' }}>
              {mesesRecomendados} meses dos seus gastos
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Cálculo recomendado: <br />
              <strong>{formatCurrency(gastos)} × {mesesRecomendados} meses</strong>
            </p>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Meta Total da Reserva:</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
              {formatCurrency(metaReserva)}
            </div>
          </div>
        </div>

        {/* Current State & Remaining Gap Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Reserva Atual Informada
              </span>
              <Target size={18} color="var(--accent-blue)" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 16px 0' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>R$</span>
              <input
                type="number"
                value={reservaAtual}
                onChange={(e) => updateReservaEmergencia({ reservaAtual: Number(e.target.value) || 0 })}
                style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', width: '100%' }}
              />
            </div>

            {/* Gap Warning */}
            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--status-vermelho-bg)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-vermelho-text)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={14} /> Falta para sua meta:
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '2px' }}>
                {formatCurrency(faltaMeta)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Progresso da Meta</span>
              <strong style={{ color: 'var(--accent-blue)' }}>{pctConcluido.toFixed(1)}%</strong>
            </div>
            <div className="progress-bar-container" style={{ height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: `${pctConcluido}%`, backgroundColor: 'var(--accent-blue)' }} />
            </div>
          </div>
        </div>

        {/* Live Yield & Time Projection Simulator Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)' }}>
              <TrendingUp size={20} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Rendimento Mensal (SELIC)
              </h3>
            </div>

            <div style={{ margin: '12px 0' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                + {formatCurrency(rendimentoMensalEstimado)} / mês
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Rendimento automático estimado em 100% do CDI/SELIC ({marketData.selic}% a.a.)
              </span>
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px dashed var(--border-color)', marginTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tempo até a meta com a poupança atual:</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '2px' }}>
                {mesesParaConclusao} meses <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>(~{anosParaConclusao} anos)</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', marginTop: '12px' }}>
            💡 <strong>Dica:</strong> Mantenha a reserva de emergência em aplicações de liquidez diária (Tesouro SELIC ou CDB 100% CDI).
          </div>
        </div>
      </div>
    </section>
  );
}
