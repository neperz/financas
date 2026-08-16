import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Home,
  ShoppingBag,
  Car,
  Activity,
  GraduationCap,
  ShieldCheck,
  Smile,
  MoreHorizontal,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';

const ICON_MAP = {
  Home: Home,
  ShoppingBag: ShoppingBag,
  Car: Car,
  Activity: Activity,
  GraduationCap: GraduationCap,
  ShieldCheck: ShieldCheck,
  Smile: Smile,
  MoreHorizontal: MoreHorizontal
};

export default function ExpensesSection() {
  const {
    data,
    getCategoriaTotal,
    getCategoriaPct,
    getCategoriaStatus,
    getTotalGastos,
    getRendaLiquida,
    updateItemDespesa,
    addItemDespesa,
    deleteItemDespesa,
    clearAllDespesas
  } = useFinance();

  const [expandedCat, setExpandedCat] = useState({});
  const [newItemName, setNewItemName] = useState({});
  const [newItemValue, setNewItemValue] = useState({});

  const toggleExpand = (catId) => {
    setExpandedCat(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleAddItem = (catId) => {
    const name = newItemName[catId];
    const val = newItemValue[catId];
    if (name && val) {
      addItemDespesa(catId, name, val);
      setNewItemName(prev => ({ ...prev, [catId]: '' }));
      setNewItemValue(prev => ({ ...prev, [catId]: '' }));
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const totalGastos = getTotalGastos();
  const renda = getRendaLiquida();
  const totalPct = (totalGastos / renda) * 100;

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', pb: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            1. DESPESAS MENSAIS DA FAMÍLIA
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Detalhamento por categoria, meta de percentual ideal e indicador de saúde do gasto.
          </p>
        </div>

        {/* Global Total Badge & Clear Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              if (window.confirm('Deseja remover todos os itens de despesas importados e restaurar as categorias padrão?')) {
                clearAllDespesas();
              }
            }}
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', borderColor: 'rgba(244,63,94,0.4)', color: 'var(--accent-rose)', padding: '6px 12px' }}
            title="Limpar itens importados e restaurar despesas padrão"
          >
            <Trash2 size={14} /> Resetar Despesas
          </button>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Geral das Despesas
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
              {formatCurrency(totalGastos)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({totalPct.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {data.despesas.map((categoria) => {
          const IconComponent = ICON_MAP[categoria.iconName] || MoreHorizontal;
          const totalCat = getCategoriaTotal(categoria.id);
          const pctCat = getCategoriaPct(categoria.id);
          const status = getCategoriaStatus(categoria);
          const isExpanded = expandedCat[categoria.id] !== false; // default open

          const idealText = categoria.idealPctMin && categoria.idealPctMax
            ? `Ideal: ${categoria.idealPctMin}% a ${categoria.idealPctMax}%`
            : `Ideal: até ${categoria.idealPctMax}%`;

          // Progress gauge calculation relative to ideal max
          const maxTarget = categoria.idealPctMax || 30;
          const gaugePct = Math.min(100, (pctCat / maxTarget) * 100);

          return (
            <div
              key={categoria.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Category Header Bar */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      background: `rgba(${parseInt(categoria.cor.slice(1,3),16)}, ${parseInt(categoria.cor.slice(3,5),16)}, ${parseInt(categoria.cor.slice(5,7),16)}, 0.15)`,
                      color: categoria.cor
                    }}>
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {categoria.nome}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {idealText}
                      </span>
                    </div>
                  </div>

                  <span className={`status-badge ${status.level}`}>
                    <span className={`status-dot ${status.level}`} />
                    {status.label}
                  </span>
                </div>

                {/* Values & Progress Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '12px 0 6px 0' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {formatCurrency(totalCat)}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {pctCat.toFixed(1)}% da renda
                  </span>
                </div>

                {/* Gauge Progress Bar */}
                <div className="progress-bar-container" style={{ height: '6px', marginBottom: '12px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${gaugePct}%`,
                      backgroundColor: status.level === 'verde' ? 'var(--accent-green)' : status.level === 'amarelo' ? 'var(--accent-amber)' : 'var(--accent-rose)'
                    }}
                  />
                </div>

                {/* Toggle Items Expand */}
                <button
                  onClick={() => toggleExpand(categoria.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-blue)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {isExpanded ? 'Ocultar itens' : `Ver ${categoria.itens.length} itens`}
                </button>
              </div>

              {/* Collapsible Sub-items List */}
              {isExpanded && (
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  padding: '12px 16px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {categoria.itens.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span style={{ color: 'var(--text-secondary)', flex: 1 }}>
                          {item.nome}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>R$</span>
                          <input
                            type="number"
                            value={item.valor}
                            onChange={(e) => updateItemDespesa(categoria.id, item.id, e.target.value)}
                            style={{ width: '90px', padding: '3px 6px', fontSize: '0.85rem', textAlign: 'right' }}
                          />
                          <button
                            onClick={() => deleteItemDespesa(categoria.id, item.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '2px' }}
                            title="Remover item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Item Form */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--border-color)' }}>
                    <input
                      type="text"
                      placeholder="Novo item..."
                      value={newItemName[categoria.id] || ''}
                      onChange={(e) => setNewItemName({ ...newItemName, [categoria.id]: e.target.value })}
                      style={{ flex: 2, fontSize: '0.8rem', padding: '4px 8px' }}
                    />
                    <input
                      type="number"
                      placeholder="R$"
                      value={newItemValue[categoria.id] || ''}
                      onChange={(e) => setNewItemValue({ ...newItemValue, [categoria.id]: e.target.value })}
                      style={{ flex: 1, fontSize: '0.8rem', padding: '4px 8px', width: '70px' }}
                    />
                    <button
                      onClick={() => handleAddItem(categoria.id)}
                      className="btn btn-primary"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
