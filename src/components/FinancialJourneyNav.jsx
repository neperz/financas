import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  LayoutDashboard,
  Wallet,
  Shield,
  Target,
  PieChart,
  BarChart3,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function FinancialJourneyNav() {
  const { activeTab, setActiveTab, getOverallHealthScore } = useFinance();
  const overallScore = getOverallHealthScore();

  const tabs = [
    { id: 'overview', label: 'Visão Geral (Dashboard)', icon: LayoutDashboard },
    { id: 'budget', label: '1. Orçamento Mensal', icon: Wallet },
    { id: 'reserve', label: '2. Reserva de Emergência', icon: Shield },
    { id: 'goals', label: '3. Objetivos & Investimentos', icon: Target },
    { id: 'radar', label: '4. Raio-X & Radar de Saúde', icon: PieChart },
    { id: 'benchmarks', label: '5. Benchmarks & Fases', icon: BarChart3 }
  ];

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'var(--accent-green)';
    if (score >= 60) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Dynamic Journey Stepper Header */}
      <div className="glass-card" style={{ padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Jornada de Planejamento:
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-blue)' }}>
            {tabs.find(t => t.id === activeTab)?.label}
          </span>
        </div>

        {/* Global Health Score Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Score de Saúde Financeira:
          </span>
          <strong style={{ fontSize: '1.1rem', color: getScoreBadgeColor(overallScore) }}>
            {overallScore} / 100
          </strong>
        </div>
      </div>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '10px 16px',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <IconComp size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
