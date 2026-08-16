import React, { useState, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { fetchAllMeuPluggyTransactions } from '../services/pluggyService';
import { fetchMockOpenFinanceStatements } from '../services/openFinanceService';
import { parseBankStatementFile } from '../services/ofxParserService';
import { ShieldCheck, Plug, FileText, Upload, RefreshCw, X, Check, Sparkles, AlertCircle, ArrowRight, UserCheck, Key, Lock } from 'lucide-react';

export default function PluggyConnectModal({ isOpen, onClose }) {
  const { data, updateItemDespesa, addItemDespesa } = useFinance();

  const [mode, setMode] = useState('meu_pluggy'); // 'meu_pluggy', 'ofx_file', 'sandbox'
  const [bearerToken, setBearerToken] = useState('');
  const [step, setStep] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleConnectMeuPluggy = async () => {
    setErrorMessage('');

    if (!bearerToken && mode === 'meu_pluggy') {
      setErrorMessage('Insira seu Bearer Token do meu.pluggy.ai');
      return;
    }

    setIsSyncing(true);

    try {
      if (mode === 'sandbox') {
        setTimeout(() => {
          const mockTxs = fetchMockOpenFinanceStatements('bb');
          setTransactions(mockTxs);
          setIsSyncing(false);
          setStep(3);
        }, 1000);
        return;
      }

      if (mode === 'meu_pluggy') {
        const txs = await fetchAllMeuPluggyTransactions(bearerToken);
        if (txs.length > 0) {
          setTransactions(txs);
          setIsSyncing(false);
          setStep(3);
        } else {
          setErrorMessage('Nenhuma transação foi retornada para o token informado.');
          setIsSyncing(false);
        }
      }
    } catch (err) {
      console.error('Erro na conexão meu.pluggy.ai:', err);
      setErrorMessage(err.message || 'Falha ao conectar com meu.pluggy.ai');
      setIsSyncing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsSyncing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const parsedTxs = parseBankStatementFile(content, file.name);

      if (parsedTxs.length > 0) {
        setTransactions(parsedTxs);
        setIsSyncing(false);
        setStep(3);
      } else {
        alert('Não foram encontradas transações válidas no arquivo selecionado.');
        setIsSyncing(false);
      }
    };
    reader.readAsText(file);
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
          addItemDespesa(tx.category, `${tx.description}`, tx.amount);
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
        maxWidth: '700px',
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
              Conexão Direta meu.pluggy.ai & Extratos
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Sincronização em tempo real via API `my-api.pluggy.ai` ou Extratos OFX/CSV
            </span>
          </div>

          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Select Mode */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setMode('meu_pluggy')}
                className={`btn ${mode === 'meu_pluggy' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '0.82rem', padding: '8px 12px' }}
              >
                <UserCheck size={14} /> meu.pluggy.ai (API Direta)
              </button>

              <button
                type="button"
                onClick={() => setMode('ofx_file')}
                className={`btn ${mode === 'ofx_file' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '0.82rem', padding: '8px 12px' }}
              >
                <FileText size={14} /> Arquivo OFX / CSV
              </button>

              <button
                type="button"
                onClick={() => setMode('sandbox')}
                className={`btn ${mode === 'sandbox' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '0.82rem', padding: '8px 12px' }}
              >
                Modo Testes
              </button>
            </div>

            {/* Mode 1: meu.pluggy.ai Direct Bearer Token */}
            {mode === 'meu_pluggy' && (
              <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-blue)' }}>
                  <Key size={18} />
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    Conectar Conta Pessoal meu.pluggy.ai
                  </strong>
                </div>

                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                  Insira o seu <strong>Bearer Token de Autorização</strong> obtido na sua sessão do <strong style={{ color: 'var(--accent-blue)' }}>meu.pluggy.ai</strong>:
                </p>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Bearer Token / JWT (`Authorization: Bearer eyJhbG...`):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Cole seu Bearer token do meu.pluggy.ai..."
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                    style={{ width: '100%', fontSize: '0.8rem', fontFamily: 'monospace', padding: '8px' }}
                  />
                </div>

                {errorMessage && (
                  <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginBottom: '12px', background: 'rgba(244,63,94,0.1)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={14} color="var(--accent-green)" />
                  <span>Busca contas e transações ativas diretamente na API `my-api.pluggy.ai`.</span>
                </div>
              </div>
            )}

            {/* Mode 2: OFX/CSV File Drag & Drop */}
            {mode === 'ofx_file' && (
              <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border-color)', textAlign: 'center', marginBottom: '20px' }}>
                <Upload size={36} color="var(--accent-blue)" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>
                  Carregar Extrato Bancário (OFX / CSV)
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                  Baixe o arquivo <strong>.OFX</strong> ou <strong>.CSV</strong> no seu banco e selecione abaixo:
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".ofx,.csv,.json"
                  style={{ display: 'none' }}
                />

                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                >
                  Selecionar Arquivo
                </button>
              </div>
            )}

            {isSyncing ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <RefreshCw size={32} color="var(--accent-blue)" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.9rem', display: 'block', marginTop: '10px', color: 'var(--accent-blue)', fontWeight: 600 }}>
                  Conectando à API my-api.pluggy.ai e buscando extratos...
                </span>
              </div>
            ) : mode !== 'ofx_file' && (
              <button onClick={handleConnectMeuPluggy} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}>
                Sincronizar Transações <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* STEP 3: Review Transactions */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={18} color="var(--accent-blue)" />
                  Extrato Importado ({transactions[0]?.source || 'meu.pluggy.ai'})
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Transações lidas e mapeadas para as 8 categorias de despesas do projeto.
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
                ✓ Transações sincronizadas e orçamento atualizado!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(1)} className="btn btn-outline">
                  Nova Conexão
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
