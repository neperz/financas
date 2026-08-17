import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Info, X, Shield, TrendingUp, Building, Calendar, Tag, DollarSign, CheckCircle2, Save, Edit3 } from 'lucide-react';

export default function ItemDetailsModal({ isOpen, onClose, details }) {
  const { data, moveItemDespesa, updateItemDespesa } = useFinance();

  const [selectedCatId, setSelectedCatId] = useState('');
  const [editedValue, setEditedValue] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (details) {
      setSelectedCatId(details.categoryId || '');
      setEditedValue(details.value !== undefined ? details.value : '');
    }
  }, [details]);

  if (!isOpen || !details) return null;

  const isInvestment = details.type === 'investment';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const handleSaveChanges = () => {
    if (isInvestment || !details.itemId || !details.categoryId) {
      onClose();
      return;
    }

    const currentCatId = details.categoryId;
    const targetCatId = selectedCatId;
    const itemId = details.itemId;
    const numVal = Number(editedValue) || 0;

    // 1. Move category if changed
    if (targetCatId && targetCatId !== currentCatId) {
      moveItemDespesa(currentCatId, targetCatId, itemId);
    }

    // 2. Update value if changed
    updateItemDespesa(targetCatId || currentCatId, itemId, numVal);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 120,
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '24px',
        background: 'var(--bg-secondary)',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              background: isInvestment ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)',
              color: isInvestment ? 'var(--accent-green)' : 'var(--accent-blue)'
            }}>
              {isInvestment ? <TrendingUp size={22} /> : <Info size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                {isInvestment ? 'Detalhes do Ativo de Investimento' : 'Editar & Detalhar Despesa'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isInvestment ? 'Informações completas sem truncamento' : 'Reclassifique a categoria e ajuste o valor'}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          {/* Full Name / Title */}
          <div style={{ background: 'var(--bg-primary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              {isInvestment ? 'Nome Completo do Produto / Ativo:' : 'Descrição Completa do Lançamento:'}
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: 1.4 }}>
              {details.fullName || details.title || details.name || 'Sem descrição'}
            </div>
          </div>

          {/* Grid Metadata / Editable Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Amount / Balance */}
            <div style={{ background: 'var(--bg-primary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <DollarSign size={12} /> {isInvestment ? 'Saldo Atual' : 'Valor Mensal (R$)'}
              </span>
              {!isInvestment ? (
                <input
                  type="number"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  style={{ width: '100%', fontSize: '1rem', fontWeight: 800, padding: '4px 8px' }}
                />
              ) : (
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                  {formatCurrency(details.value || details.amount || details.balance)}
                </div>
              )}
            </div>

            {/* Editable Category Dropdown for Expenses */}
            <div style={{ background: 'var(--bg-primary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Tag size={12} /> {isInvestment ? 'Tipo de Produto' : 'Reclassificar Categoria'}
              </span>
              {!isInvestment ? (
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem', fontWeight: 700, padding: '5px 8px', borderRadius: 'var(--radius-sm)' }}
                >
                  {data.despesas.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              ) : (
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {details.assetType || 'Investimento'}
                </div>
              )}
            </div>
          </div>

          {/* Rate or Additional Info for Investments */}
          {isInvestment && details.annualRate && (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 14px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Rentabilidade Anual Estimada:</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--accent-green)', fontWeight: 800 }}>
                {details.annualRate}% a.a.
              </strong>
            </div>
          )}

          {/* Source Info */}
          <div style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Origem dos Dados:</span>
            <span className="status-badge verde" style={{ fontSize: '0.75rem' }}>
              <CheckCircle2 size={12} /> {details.source || 'Open Finance Brasil'}
            </span>
          </div>
        </div>

        {/* Footer Action Buttons */}
        {saveSuccess ? (
          <div style={{ background: 'var(--status-verde-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.88rem' }}>
            ✓ Alteração salva com sucesso!
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Cancelar
            </button>
            {!isInvestment && (
              <button onClick={handleSaveChanges} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={15} /> Salvar Alteração
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
