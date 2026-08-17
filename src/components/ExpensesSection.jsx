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
  Info,
  RotateCcw,
  GripVertical,
  Move
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
    moveItemDespesa,
    clearAllDespesas
  } = useFinance();

  const [expandedCat, setExpandedCat] = useState({});
  const [newItemName, setNewItemName] = useState({});
  const [newItemValue, setNewItemValue] = useState({});
  const [dragOverCatId, setDragOverCatId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const toggleExpand = (catId) => {
    setExpandedCat(prev => ({
      ...prev,
      [catId]: prev[catId] === false ? true : false
    }));
  };

  const handleAddItem = (e, catId) => {
    e.preventDefault();
    const name = newItemName[catId];
    const value = newItemValue[catId];

    if (name && value) {
      addItemDespesa(catId, name, value);
      setNewItemName(prev => ({ ...prev, [catId]: '' }));
      setNewItemValue(prev => ({ ...prev, [catId]: '' }));
    }
  };

  const totalGastos = getTotalGastos();
  const renda = getRendaLiquida();
  const totalPct = renda > 0 ? (totalGastos / renda) * 100 : 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleResetDespesas = () => {
    if (window.confirm('Tem certeza que deseja zerar todas as 8 categorias de despesas? Todos os itens serão apagados para um orçamento limpo.')) {
      clearAllDespesas();
    }
  };

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag color="var(--accent-blue)" size={24} />
              1. DESPESAS MENSAIS DA FAMÍLIA (8 CATEGORIAS)
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Subdivisão recomendada para diagnosticar ralos financeiros e equilibrar o orçamento.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleResetDespesas}
              className="btn btn-outline"
              style={{
                fontSize: '0.8rem',
                borderColor: 'rgba(244, 63, 94, 0.4)',
                color: 'var(--accent-rose)',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Zerar todos os itens de despesas para um orçamento limpo"
            >
              <RotateCcw size={14} /> Zerar Despesas
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

        {/* Drag and Drop Tip Banner */}
        <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--accent-blue)' }}>
          <Move size={15} />
          <span><strong>Dica de Usabilidade:</strong> Arraste e solte (Drag & Drop) qualquer item entre os cards das 8 categorias para reclassificar despesas facilmente!</span>
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
          const isTargetDrag = dragOverCatId === categoria.id;

          const idealText = categoria.idealPctMin && categoria.idealPctMax
            ? `Ideal: ${categoria.idealPctMin}% a ${categoria.idealPctMax}%`
            : `Ideal: até ${categoria.idealPctMax}%`;

          // Progress gauge calculation relative to ideal max
          const maxTarget = categoria.idealPctMax || 30;
          const gaugePct = Math.min(100, (pctCat / maxTarget) * 100);

          return (
            <div
              key={categoria.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (dragOverCatId !== categoria.id) {
                  setDragOverCatId(categoria.id);
                }
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOverCatId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOverCatId(null);

                let sourceCatId = draggedItem?.sourceCatId;
                let itemId = draggedItem?.itemId;

                if (!sourceCatId || !itemId) {
                  try {
                    const raw = e.dataTransfer.getData('text/plain');
                    if (raw) {
                      const payload = JSON.parse(raw);
                      sourceCatId = payload?.sourceCatId;
                      itemId = payload?.itemId;
                    }
                  } catch (err) {
                    console.warn(err);
                  }
                }

                if (sourceCatId && itemId && sourceCatId !== categoria.id) {
                  moveItemDespesa(sourceCatId, categoria.id, itemId);
                }
                setDraggedItem(null);
              }}
              style={{
                background: isTargetDrag ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-secondary)',
                border: isTargetDrag ? '2px dashed var(--accent-blue)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                boxShadow: isTargetDrag ? '0 0 16px rgba(59, 130, 246, 0.25)' : 'none'
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

              {/* Collapsible Sub-items List with Drag & Drop */}
              {isExpanded && (
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  padding: '12px 16px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {categoria.itens.length > 0 ? (
                      categoria.itens.map((item) => (
                        <div
                          key={item.id}
                          draggable={true}
                          onDragStart={(e) => {
                            setDraggedItem({
                              sourceCatId: categoria.id,
                              itemId: item.id
                            });
                            e.dataTransfer.setData('text/plain', JSON.stringify({
                              sourceCatId: categoria.id,
                              itemId: item.id
                            }));
                          }}
                          onDragEnd={() => {
                            setDraggedItem(null);
                            setDragOverCatId(null);
                          }}
                          style={{
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            padding: '6px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-secondary)',
                            cursor: 'grab',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                            <GripVertical size={14} color="var(--text-muted)" style={{ cursor: 'grab', flexShrink: 0 }} />
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.nome}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
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
                      ))
                    ) : (
                      <div style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', fontStyle: 'italic' }}>
                        Nenhum item nesta categoria. Arraste um item para cá!
                      </div>
                    )}
                  </div>

                  {/* Add New Item Form */}
                  <form
                    onSubmit={(e) => handleAddItem(e, categoria.id)}
                    style={{ display: 'flex', gap: '6px' }}
                  >
                    <input
                      type="text"
                      placeholder="Novo item..."
                      value={newItemName[categoria.id] || ''}
                      onChange={(e) => setNewItemName(prev => ({ ...prev, [categoria.id]: e.target.value }))}
                      style={{ flex: 1, fontSize: '0.8rem', padding: '4px 8px' }}
                    />
                    <input
                      type="number"
                      placeholder="R$"
                      value={newItemValue[categoria.id] || ''}
                      onChange={(e) => setNewItemValue(prev => ({ ...prev, [categoria.id]: e.target.value }))}
                      style={{ width: '70px', fontSize: '0.8rem', padding: '4px 8px', textAlign: 'right' }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      title="Adicionar item"
                    >
                      <Plus size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
