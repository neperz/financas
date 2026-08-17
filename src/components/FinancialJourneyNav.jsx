import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  LayoutDashboard,
  History,
  TrendingUp,
  PieChart,
  ShieldCheck
} from 'lucide-react';

export default function FinancialJourneyNav() {
  const { activeTab, setActiveTab, getOverallHealthScore } = useFinance();
  const overallScore = getOverallHealthScore();

  const tabs = [
    { id: 'overview', label: '📊 Visão Geral & Orçamento', icon: LayoutDashboard },
    { id: 'checkpoints', label: '📸 Checkpoints & Evolução', icon: History },
    { id: 'simulators', label: '🚀 Simulações & Investimentos', icon: TrendingUp },
    { id: 'health', label: '🎯 Raio-X & Saúde Financeira', icon: PieChart }
  ];

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'var(--accent-green)';
    if (score >= 60) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Header bar with Active Tab name and Score Badge */}
      <div className="glass-card" style={{ padding: '12px 18px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Painel Ativo:
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
            {tabs.find(t => t.id === activeTab)?.label || 'Visão Geral'}
          </span>
        </div>

        {/* Global Health Score Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Score de Saúde:
          </span>
          <strong style={{ fontSize: '1.1rem', fontWeight: 800, color: getScoreBadgeColor(overallScore) }}>
            {overallScore} / 100
          </strong>
        </div>
      </div>

      {/* Simplified 4 Primary Nav Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '12px 14px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 800 : 600,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                borderColor: isActive ? 'var(--accent-blue)' : 'var(--border-color)'
              }}
            >
              <IconComp size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
