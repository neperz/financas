import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  TrendingUp,
  Plus,
  Trash2,
  PieChart,
  ShieldCheck,
  Building,
  DollarSign,
  ArrowUpRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function InvestmentsPortfolioSection() {
  const { data, addInvestimentoAsset, deleteInvestimentoAsset } = useFinance();

  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Ações');
  const [assetBalance, setAssetBalance] = useState('');
  const [assetRate, setAssetRate] = useState('');

  const investments = data.investimentos || [];
  const totalBalance = investments.reduce((acc, inv) => acc + (Number(inv.balance) || 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!assetName || !assetBalance) return;

    addInvestimentoAsset({
      code: assetName.toUpperCase(),
      name: assetName,
      type: assetType,
      balance: Number(assetBalance) || 0,
      annualRate: assetRate ? Number(assetRate) : null,
      source: 'Lançamento Manual'
    });

    setAssetName('');
    setAssetBalance('');
    setAssetRate('');
  };

  const getTypeBadgeColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('etf') || t.includes('fii')) return 'var(--accent-blue)';
    if (t.includes('fundo') || t.includes('multimercado')) return 'var(--accent-green)';
    if (t.includes('ação') || t.includes('acoes') || t.includes('equity')) return 'var(--accent-amber)';
    if (t.includes('renda fixa') || t.includes('tesouro')) return 'var(--accent-cyan)';
    return 'var(--text-muted)';
  };

  return (
    <section className="glass-card" style={{ padding: '24px', height: '100%', minHeight: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp color="var(--accent-green)" size={22} />
              CARTEIRA DE INVESTIMENTOS
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Ativos importados da Pluggy (Open Finance) ou lançados manualmente
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Investido
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-green)' }}>
              {formatCurrency(totalBalance)}
            </div>
          </div>
        </div>

        {/* Assets List filling full height of card */}
        {investments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', flex: 1, minHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
            {investments.map((inv) => (
              <div
                key={inv.id}
                style={{
                  background: 'var(--bg-primary)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {inv.code || inv.name}
                    </strong>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: getTypeBadgeColor(inv.type)
                    }}>
                      {inv.type}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    {inv.name} • {inv.source || 'Open Finance'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatCurrency(inv.balance)}
                    </div>
                    {inv.annualRate && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                        <ArrowUpRight size={12} /> {inv.annualRate}% a.a.
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteInvestimentoAsset(inv.id)}
                    className="btn btn-outline"
                    style={{ padding: '4px 6px', borderColor: 'rgba(244,63,94,0.3)', color: 'var(--accent-rose)' }}
                    title="Remover Ativo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)', marginBottom: '16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={28} color="var(--accent-green)" style={{ marginBottom: '8px' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Nenhum ativo de investimento lançado. Conecte com o <strong>meu.pluggy.ai</strong> ou adicione abaixo.
            </span>
          </div>
        )}
      </div>

      {/* Manual Asset Creation Form */}
      <form onSubmit={handleAddAsset} style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
          + Lançar Novo Ativo de Investimento:
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            placeholder="Nome (ex: SPYI11 / Tesouro)"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
            required
          />

          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
          >
            <option value="ETF / FII">ETF / FII</option>
            <option value="Ações">Ações</option>
            <option value="Fundo Multimercado">Fundo Multimercado</option>
            <option value="Renda Fixa / Tesouro">Renda Fixa / Tesouro</option>
            <option value="Cripto">Criptomoeda</option>
            <option value="Previdência">Previdência Privada</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px' }}>
          <input
            type="number"
            placeholder="Saldo (R$)"
            value={assetBalance}
            onChange={(e) => setAssetBalance(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
            required
          />

          <input
            type="number"
            step="0.1"
            placeholder="Rentab. (% a.a.)"
            value={assetRate}
            onChange={(e) => setAssetRate(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
          />

          <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Plus size={14} /> Adicionar
          </button>
        </div>
      </form>
    </section>
  );
}
