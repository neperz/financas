import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { fetchPluggyItemTransactions, mapPluggyToAppCategory } from '../services/pluggyService';
import { fetchMockOpenFinanceStatements } from '../services/openFinanceService';
import { ShieldCheck, Plug, Key, RefreshCw, X, Check, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function PluggyConnectModal({ isOpen, onClose }) {
  const { data, updateItemDespesa, addItemDespesa } = useFinance();

  const [connectToken, setConnectToken] = useState('');
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [step, setStep] = useState(1); // 1: Token/Setup, 2: Loading/Widget, 3: Review Transactions
  const [transactions, setTransactions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);
  const [useSandbox, setUseSandbox] = useState(true);

  // Load Pluggy Connect Script on Mount
  useEffect(() => {
    if (window.PluggyConnect) {
      setIsSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://connect.pluggy.ai/v2/pluggy-connect.js';
    script.async = true;
    script.onload = () => setIsSdkLoaded(true);
    document.body.appendChild(script);
  }, []);

  if (!isOpen) return null;

  const handleLaunchPluggyWidget = () => {
    if (useSandbox) {
      // Sandbox Mode: Use Pluggy Mock Data
      setIsSyncing(true);
      setTimeout(() => {
        const mockTxs = fetchMockOpenFinanceStatements('bb');
        setTransactions(mockTxs);
        setIsSyncing(false);
        setStep(3);
      }, 1200);
      return;
    }

    if (!connectToken) {
      alert('Insira o Connect Token da Pluggy para iniciar a conexão.');
      return;
    }

    if (window.PluggyConnect) {
      const pluggyConnect = new window.PluggyConnect({
        connectToken: connectToken,
        onSuccess: (itemData) => {
          setIsSyncing(true);
          fetchPluggyItemTransactions(itemData.item.id, connectToken)
            .then(txs => {
              setTransactions(txs);
              setIsSyncing(false);
              setStep(3);
            })
            .catch(err => {
              alert('Erro ao buscar transações da Pluggy. Verifique o token.');
              setIsSyncing(false);
            });
        },
        onError: (error) => {
          console.error('Pluggy Connect Error:', error);
          alert('Erro na conexão Pluggy.');
        }
      });
      pluggyConnect.init();
    } else {
      alert('O SDK do Pluggy Connect ainda está carregando. Tente novamente em alguns segundos.');
    }
  };

  const handleCategoryChange = (txId, newCat) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, category: newCat } : t));
  };

  const handleApplyToBudget = () => {
    transactions.forEach(tx => {
      const category = data.despesas.find(c => c.id === tx.category);
      if (category) {
        const existingItem = category.itens.find(i => i.nome.toLowerCase().includes(tx.description.toLowerCase().slice(0, 5)));
        if (existingItem) {
          updateItemDespesa(tx.category, existingItem.id, tx.amount);
        } else {
          addItemDespesa(tx.category, `${tx.description} (Pluggy)`, tx.amount);
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
        maxWidth: '660px',
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
              <Plug color="var(--accent-blue)" size={24} />
              Integrador Pluggy (Open Finance API)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Agregador Oficial Pluggy AI • 100+ Bancos e Fintechs do Brasil
            </span>
          </div>

          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Pluggy Setup & Connection Mode */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setUseSandbox(true)}
                className={`btn ${useSandbox ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '0.85rem' }}
              >
                Modo Demonstrativo (Sandbox)
              </button>
              <button
                type="button"
                onClick={() => setUseSandbox(false)}
                className={`btn ${!useSandbox ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '0.85rem' }}
              >
                Conectar Conta Real (Connect Token)
              </button>
            </div>

            {!useSandbox && (
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Insira seu Pluggy Connect Token:
                </label>
                <input
                  type="text"
                  placeholder="ex: eyJhbGciOiJIUzI1NiIsInR..."
                  value={connectToken}
                  onChange={(e) => setConnectToken(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Obtenha seu Connect Token no painel <strong>dashboard.pluggy.ai</strong>
                </span>
              </div>
            )}

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--accent-amber)" /> Bancos Suportados pela Pluggy:
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Banco do Brasil, Nubank, Banco Inter, Itaú, Bradesco, Santander, Caixa, C6 Bank, XP, BTG Pactual, Mercado Pago, PicPay e mais de 100 instituições parceiras do Open Finance Brasil.
              </p>
            </div>

            {isSyncing ? (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <RefreshCw size={28} color="var(--accent-blue)" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '8px', color: 'var(--accent-blue)' }}>
                  Carregando widget Pluggy...
                </span>
              </div>
            ) : (
              <button onClick={handleLaunchPluggyWidget} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}>
                Abrir Conector Pluggy <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* STEP 3: Review Pluggy Transactions */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plug size={18} color="var(--accent-blue)" />
                  Extrato Importado via Pluggy
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Transações lidas e mapeadas para as 8 categorias do projeto.
                </span>
              </div>

              <span className="status-badge verde">
                {transactions.length} transações
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
                ✓ Transações da Pluggy sincronizadas e categorias atualizadas!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(1)} className="btn btn-outline">
                  Nova Conexão
                </button>
                <button onClick={handleApplyToBudget} className="btn btn-primary" style={{ padding: '10px 20px' }}>
                  <Check size={16} /> Preencher Orçamento com Pluggy
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
