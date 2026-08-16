import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, Award, Zap, DollarSign, Clock, Sparkles } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function CompoundInterestSimulator() {
  const { getPoupancaMensal, getTotalGastos, marketData } = useFinance();
  const poupancaMensal = getPoupancaMensal();
  const gastosTotais = getTotalGastos();

  const [taxaAnual, setTaxaAnual] = useState(marketData.selic || 10.5);
  const [anosSimulacao, setAnosSimulacao] = useState(20);
  const [patrimonioInicial, setPatrimonioInicial] = useState(60000);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Generate Simulation Data Month by Month
  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
  const dataPoints = [];
  let acumTotal = patrimonioInicial;
  let totalAportado = patrimonioInicial;

  let anoLiberdade = null;

  for (let ano = 1; ano <= anosSimulacao; ano++) {
    for (let mes = 1; mes <= 12; mes++) {
      acumTotal = (acumTotal + poupancaMensal) * (1 + taxaMensal);
      totalAportado += poupancaMensal;
    }
    const rendimentoMensalEstimado = acumTotal * taxaMensal;
    if (!anoLiberdade && rendimentoMensalEstimado >= gastosTotais) {
      anoLiberdade = ano;
    }
    dataPoints.push({
      ano: `Ano ${ano}`,
      patrimonioTotal: Math.round(acumTotal),
      totalInvestido: Math.round(totalAportado),
      jurosGanhos: Math.round(acumTotal - totalAportado),
      rendimentoMensal: Math.round(rendimentoMensalEstimado)
    });
  }

  const finalResult = dataPoints[dataPoints.length - 1] || {};

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp color="var(--accent-green)" size={24} />
            Simulador de Juros Compostos & Renda Passiva
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Projeção de construção de riqueza e ponto de Independência Financeira (Liberdade Financeira).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <Sparkles size={16} color="var(--accent-amber)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            Taxa Base (SELIC): {marketData.selic}% a.a.
          </span>
        </div>
      </div>

      {/* Simulator Inputs & Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Controls Card */}
        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', color: 'var(--text-primary)' }}>
            ⚙️ Parâmetros da Simulação
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Patrimônio Inicial (R$)</label>
              <input
                type="number"
                value={patrimonioInicial}
                onChange={(e) => setPatrimonioInicial(Number(e.target.value))}
                style={{ width: '100%', fontWeight: 'bold' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aporte Mensal (Sua Poupança Mensal)</label>
              <input
                type="number"
                value={poupancaMensal}
                readOnly
                style={{ width: '100%', fontWeight: 'bold', color: 'var(--accent-green)', background: 'var(--bg-primary)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Taxa de Rentabilidade (% a.a.)</label>
              <input
                type="number"
                step="0.1"
                value={taxaAnual}
                onChange={(e) => setTaxaAnual(Number(e.target.value))}
                style={{ width: '100%', fontWeight: 'bold' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Horizonte de Tempo: {anosSimulacao} anos</label>
              <input
                type="range"
                min="5"
                max="35"
                value={anosSimulacao}
                onChange={(e) => setAnosSimulacao(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-green)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Results Summary Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-green)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Patrimônio Acumulado em {anosSimulacao} anos
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green)', margin: '4px 0' }}>
              {formatCurrency(finalResult.patrimonioTotal || 0)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Lucro com Juros Compostos: <strong>{formatCurrency(finalResult.jurosGanhos || 0)}</strong>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-purple)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Renda Passiva Mensal Estimada
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-purple)', margin: '4px 0' }}>
              {formatCurrency(finalResult.rendamentoMensal || 0)} / mês
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Rendimento sem consumir o capital principal
            </span>
          </div>

          {/* Independence Milestone Box */}
          <div style={{
            background: anoLiberdade ? 'var(--status-verde-bg)' : 'var(--status-amarelo-bg)',
            border: `1px solid ${anoLiberdade ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Award size={24} color={anoLiberdade ? 'var(--accent-green)' : 'var(--accent-amber)'} />
            <div style={{ fontSize: '0.85rem' }}>
              <strong>Ponto de Independência Financeira:</strong> <br />
              {anoLiberdade ? (
                <span>🎉 Atingido em <strong>{anoLiberdade} anos</strong>! Seus rendimentos de passivos passarão a cobrir 100% dos seus gastos atuais ({formatCurrency(gastosTotais)}).</span>
              ) : (
                <span>Aumente o tempo de simulação para calcular o momento em que a renda passiva superará os gastos mensais.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div style={{ width: '100%', height: '320px', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataPoints} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAportes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="ano" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="var(--text-secondary)"
              tick={{ fontSize: 11 }}
              tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), '']}
              contentStyle={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)'
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="patrimonioTotal" name="Patrimônio Total (com Juros)" stroke="#10b981" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
            <Area type="monotone" dataKey="totalInvestido" name="Total do Bolso (Aportes)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAportes)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
