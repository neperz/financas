import React from 'react';
import { Info, X, Shield, TrendingUp, Building, Calendar, Tag, DollarSign, CheckCircle2 } from 'lucide-react';

export default function ItemDetailsModal({ isOpen, onClose, details }) {
  if (!isOpen || !details) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const isInvestment = details.type === 'investment';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
                {isInvestment ? 'Detalhes do Ativo de Investimento' : 'Detalhes da Despesa'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Informações completas sem truncamento de texto
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

          {/* Grid Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Amount / Balance */}
            <div style={{ background: 'var(--bg-primary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <DollarSign size={12} /> {isInvestment ? 'Saldo Atual' : 'Valor Mensal'}
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isInvestment ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
                {formatCurrency(details.value || details.amount || details.balance)}
              </div>
            </div>

            {/* Category or Asset Type */}
            <div style={{ background: 'var(--bg-primary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Tag size={12} /> {isInvestment ? 'Tipo de Produto' : 'Categoria'}
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {details.categoryName || details.assetType || 'Geral'}
              </div>
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

        {/* Footer Close Button */}
        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
