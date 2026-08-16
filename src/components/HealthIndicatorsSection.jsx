import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Gauge, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function HealthIndicatorsSection() {
  const {
    data,
    getTaxaPoupanca,
    getCategoriaPct,
    getTotalGastos
  } = useFinance();

  const taxaPoupanca = getTaxaPoupanca();
  const moradiaPct = getCategoriaPct('moradia');
  const mesesReserva = data.reservaEmergencia.reservaAtual / (getTotalGastos() || 1);

  // Dynamic overrides where calculated
  const getDynamicValue = (id, originalValor, originalStatus) => {
    if (id === 'ind1') {
      const val = taxaPoupanca.toFixed(1) + '%';
      const status = taxaPoupanca >= 20 ? 'Saudável' : taxaPoupanca >= 10 ? 'Atenção' : 'Alerta';
      return { valor: val, status };
    }
    if (id === 'ind2') {
      const val = mesesReserva.toFixed(1) + ' meses';
      const status = mesesReserva >= 9 ? 'Saudável' : mesesReserva >= 6 ? 'Atenção' : 'Alerta';
      return { valor: val, status };
    }
    if (id === 'ind6') {
      const val = moradiaPct.toFixed(1) + '%';
      const status = moradiaPct <= 30 ? 'Saudável' : 'Atenção';
      return { valor: val, status };
    }
    return { valor: originalValor, status: originalStatus };
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Saudável':
        return { level: 'verde', icon: CheckCircle2 };
      case 'Atenção':
        return { level: 'amarelo', icon: AlertTriangle };
      case 'Alerta':
        return { level: 'vermelho', icon: AlertCircle };
      default:
        return { level: 'amarelo', icon: AlertTriangle };
    }
  };

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gauge color="var(--accent-purple)" size={24} />
          7. INDICADORES FINANCEIROS ATUAIS
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Métricas consolidadas do diagnóstico situacional da família.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {data.indicadoresAtuais.map((item) => {
          const { valor, status } = getDynamicValue(item.id, item.valor, item.status);
          const style = getStatusStyle(status);
          const IconComp = style.icon;

          return (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                  {item.indicador}
                </span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginTop: '2px', display: 'block' }}>
                  {valor}
                </strong>
              </div>

              <span className={`status-badge ${style.level}`}>
                <IconComp size={12} /> {status}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
