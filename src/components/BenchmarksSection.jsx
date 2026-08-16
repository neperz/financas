import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { BarChart3, Check } from 'lucide-react';

export default function BenchmarksSection() {
  const { data, getRendaLiquida } = useFinance();
  const rendaAtual = getRendaLiquida();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 color="var(--accent-blue)" size={24} />
          5. EXEMPLOS DE ORÇAMENTO POR NÍVEL DE RENDA (médias)
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Valores médios calculados para cidades de médio porte. Ajuste conforme sua realidade.
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                CATEGORIA
              </th>
              {data.benchmarks.map((bm) => {
                const isSelectedTier = Math.abs(bm.renda - rendaAtual) < 5000;
                return (
                  <th
                    key={bm.faixa}
                    style={{
                      padding: '12px 10px',
                      textAlign: 'right',
                      background: isSelectedTier ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      borderTopLeftRadius: isSelectedTier ? 'var(--radius-sm)' : 0,
                      borderTopRightRadius: isSelectedTier ? 'var(--radius-sm)' : 0,
                      color: isSelectedTier ? 'var(--accent-blue)' : 'var(--text-primary)',
                      fontWeight: 800
                    }}
                  >
                    {bm.faixa} {isSelectedTier && <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--accent-blue)' }}>(Sua Faixa)</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {[
              { key: 'moradia', label: 'Moradia' },
              { key: 'alimentacao', label: 'Alimentação' },
              { key: 'transporte', label: 'Transporte' },
              { key: 'saude', label: 'Saúde' },
              { key: 'educacao', label: 'Educação' },
              { key: 'protecao', label: 'Proteção' },
              { key: 'lazer', label: 'Lazer' },
              { key: 'outros', label: 'Outros' }
            ].map((row) => (
              <tr key={row.key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {row.label}
                </td>
                {data.benchmarks.map((bm) => {
                  const isSelectedTier = Math.abs(bm.renda - rendaAtual) < 5000;
                  return (
                    <td
                      key={bm.faixa}
                      style={{
                        padding: '8px 10px',
                        textAlign: 'right',
                        background: isSelectedTier ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                        fontWeight: isSelectedTier ? 'bold' : 'normal'
                      }}
                    >
                      {formatCurrency(bm[row.key])}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Total de Gastos Row */}
            <tr style={{ borderTop: '2px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>
              <td style={{ padding: '10px', color: 'var(--accent-rose)' }}>Total de Gastos</td>
              {data.benchmarks.map((bm) => (
                <td key={bm.faixa} style={{ padding: '10px', textAlign: 'right', color: 'var(--accent-rose)' }}>
                  {formatCurrency(bm.totalGastos)}
                </td>
              ))}
            </tr>

            {/* Poupança Sugerida Row */}
            <tr style={{ fontWeight: 'bold' }}>
              <td style={{ padding: '10px', color: 'var(--accent-green)' }}>Poupança Sugerida</td>
              {data.benchmarks.map((bm) => (
                <td key={bm.faixa} style={{ padding: '10px', textAlign: 'right', color: 'var(--accent-green)' }}>
                  {formatCurrency(bm.poupancaSugerida)}
                </td>
              ))}
            </tr>

            {/* % Poupança Row */}
            <tr style={{ fontWeight: 'bold', background: 'var(--bg-primary)' }}>
              <td style={{ padding: '10px', color: 'var(--accent-amber)' }}>% de Poupança</td>
              {data.benchmarks.map((bm) => (
                <td key={bm.faixa} style={{ padding: '10px', textAlign: 'right', color: 'var(--accent-amber)' }}>
                  {bm.pctPoupanca}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
