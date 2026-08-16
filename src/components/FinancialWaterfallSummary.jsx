import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  ArrowDownRight,
  Wallet,
  ShoppingBag,
  PiggyBank,
  Shield,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function FinancialWaterfallSummary() {
  const {
    getRendaLiquida,
    getTotalGastos,
    getPoupancaMensal,
    getTaxaPoupanca,
    getReservaMeta,
    getReservaPctConcluido,
    getTotalAportesObjetivos
  } = useFinance();

  const renda = getRendaLiquida();
  const gastos = getTotalGastos();
  const poupanca = getPoupancaMensal();
  const taxaPoupanca = getTaxaPoupanca();
  const reservaPct = getReservaPctConcluido();
  const totalAportesGoals = getTotalAportesObjetivos();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🌊 Fluxo Sequencial do Dinheiro Familiar (Waterfall)
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Entenda como a renda líquida entra, cobre os gastos e se transforma em investimentos e metas de vida.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', position: 'relative' }}>
        {/* Step 1: Entry Income */}
        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-green)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wallet size={16} color="var(--accent-green)" /> 1. Entradas (Renda)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)', margin: '8px 0 4px 0' }}>
            {formatCurrency(renda)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total líquido mensal disponível
          </span>
        </div>

        {/* Step 2: Monthly Expenses */}
        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-rose)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShoppingBag size={16} color="var(--accent-rose)" /> 2. Saídas (Despesas)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-rose)', margin: '8px 0 4px 0' }}>
            - {formatCurrency(gastos)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {((gastos / renda) * 100).toFixed(1)}% da renda em custos fixos e variáveis
          </span>
        </div>

        {/* Step 3: Net Monthly Savings */}
        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-blue)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PiggyBank size={16} color="var(--accent-blue)" /> 3. Poupança Gerada
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', margin: '8px 0 4px 0' }}>
            = {formatCurrency(poupanca)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Taxa de Poupança: <strong>{taxaPoupanca.toFixed(1)}%</strong>
          </span>
        </div>

        {/* Step 4: Emergency Allocation */}
        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} color="var(--accent-amber)" /> 4. Reserva Proteção
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '8px 0 4px 0' }}>
            {reservaPct.toFixed(1)}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {reservaPct >= 100 ? 'Reserva Completa!' : 'Prioridade: Aportar na reserva'}
          </span>
        </div>

        {/* Step 5: Goals Demand */}
        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={16} color="var(--accent-purple)" /> 5. Objetivos de Vida
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-purple)', margin: '8px 0 4px 0' }}>
            {formatCurrency(totalAportesGoals)}
          </div>
          <span style={{ fontSize: '0.75rem', color: totalAportesGoals <= poupanca ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
            {totalAportesGoals <= poupanca ? 'Aportes cabem no orçamento' : 'Aportes excedem a poupança'}
          </span>
        </div>
      </div>
    </div>
  );
}
