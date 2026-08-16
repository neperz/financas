import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SUPPORTED_BANKS, fetchMockOpenFinanceStatements, categorizeTransaction } from '../services/openFinanceService';
import { ShieldCheck, Lock, CheckCircle2, RefreshCw, X, ArrowRight, Building, Check, Sparkles } from 'lucide-react';

export default function OpenFinanceModal({ isOpen, onClose }) {
  const { data, updateItemDespesa, addItemDespesa } = useFinance();

  const [step, setStep] = useState(1); // 1: Select Bank, 2: Auth Consent, 3: Review Transactions
  const [selectedBank, setSelectedBank] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setStep(2);
  };

  const handleAuthorizeConsent = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const txs = fetchMockOpenFinanceStatements(selectedBank.id);
      setTransactions(txs);
      setIsSyncing(false);
      setStep(3);
    }, 1500);
  };

  const handleCategoryChange = (txId, newCat) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, category: newCat } : t));
  };

  const handleApplyToBudget = () => {
    // Process transactions and sync to category totals in project context
    transactions.forEach(tx => {
      const category = data.despesas.find(c => c.id === tx.category);
      if (category) {
        // Find matching item or add new item
        const existingItem = category.itens.find(i => i.nome.toLowerCase().includes(tx.description.toLowerCase().slice(0, 5)));
        if (existingItem) {
          updateItemDespesa(tx.category, existingItem.id, tx.amount);
        } else {
          addItemDespesa(tx.category, `${tx.description} (${selectedBank.name})`, tx.amount);
        }
      }
    });

    setSyncedSuccess(true);
    setTimeout(() => {
      setSyncedSuccess(false);
      onClose();
      setStep(1);
    }, 1800);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      zIndex: 110,
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '28px',
        background: 'var(--bg-secondary)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck color="var(--accent-green)" size={24} />
              Open Finance Brasil (Conexão Bancária)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Protocolo Seguro OAuth 2.0 FAPI • Banco Central do Brasil
            </span>
          </div>

          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Select Institution */}
        {step === 1 && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Selecione o seu banco para importar e categorizar automaticamente seu extrato de despesas:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {SUPPORTED_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleSelectBank(bank)}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <span style={{ fontSize: '1.6rem' }}>{bank.logo}</span>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>
                      {bank.name}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Conexão Direta Open Finance
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="var(--accent-green)" />
              <span>Conexão criptografada de ponta a ponta regulamentada pelo Banco Central do Brasil (LGPD total).</span>
            </div>
          </div>
        )}

        {/* STEP 2: Consent Authentication */}
        {step === 2 && selectedBank && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{selectedBank.logo}</div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '8px' }}>
              Autorizar Acesso Open Finance: {selectedBank.name}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
              Você será direcionado para o ambiente seguro do <strong>{selectedBank.name}</strong> para autorizar a leitura do extrato de transações de despesas.
            </p>

            {isSyncing ? (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <RefreshCw size={32} color="var(--accent-blue)" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-blue)' }}>
                  Sincronizando extrato e executando categorização inteligente...
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setStep(1)} className="btn btn-outline">
                  Voltar
                </button>
                <button onClick={handleAuthorizeConsent} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  Autorizar Conexão <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Review & Apply Categorized Transactions */}
        {step === 3 && selectedBank && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={18} color="var(--accent-green)" />
                  Transações Importadas: {selectedBank.name}
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Revise a categorização automática antes de sincronizar com o orçamento familiar.
                </span>
              </div>

              <span className="status-badge verde">
                {transactions.length} itens categorizados
              </span>
            </div>

            {/* Transactions Table */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Data</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Descrição</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Valor</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Categoria Atribuída</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>{tx.date}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 600, color: 'var(--text-primary)' }}>{tx.description}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: 'var(--accent-rose)' }}>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <select
                          value={tx.category}
                          onChange={(e) => handleCategoryChange(tx.id, e.target.value)}
                          style={{ fontSize: '0.8rem', fontWeight: 'bold', width: '100%' }}
                        >
                          {data.despesas.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {syncedSuccess ? (
              <div style={{ background: 'var(--status-verde-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--accent-green)', fontWeight: 700 }}>
                ✓ Extrato sincronizado e categorias atualizadas com sucesso!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(1)} className="btn btn-outline">
                  Trocar Banco
                </button>
                <button onClick={handleApplyToBudget} className="btn btn-primary" style={{ padding: '10px 20px' }}>
                  <Check size={16} /> Preencher Orçamento com Extrato
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
