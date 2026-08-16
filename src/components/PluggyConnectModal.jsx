import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { fetchAllMeuPluggyTransactions } from '../services/pluggyService';
import { loginWithGooglePluggy, checkOAuthRedirectToken } from '../services/googleAuthService';
import { fetchMockOpenFinanceStatements } from '../services/openFinanceService';
import { parseBankStatementFile } from '../services/ofxParserService';
import { extractBearerToken, parseJwtPayload } from '../services/jwtHelper';
import { ShieldCheck, Plug, FileText, Upload, RefreshCw, X, Check, Sparkles, AlertCircle, ArrowRight, UserCheck, Key, Lock, Copy, Terminal } from 'lucide-react';

export default function PluggyConnectModal({ isOpen, onClose }) {
  const { data, updateItemDespesa, addItemDespesa } = useFinance();

  const [mode, setMode] = useState('google'); // 'google', 'meu_pluggy', 'ofx_file', 'sandbox'
  const [rawInputToken, setRawInputToken] = useState('');
  const [extractedToken, setExtractedToken] = useState('');
  const [jwtInfo, setJwtInfo] = useState(null);
  const [step, setStep] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const fileInputRef = useRef(null);

  // Check for Google OAuth Token in URL on Load
  useEffect(() => {
    const oauthResult = checkOAuthRedirectToken();
    if (oauthResult && oauthResult.accessToken) {
      setIsSyncing(true);
      setStep(3);
      fetchAllMeuPluggyTransactions(oauthResult.accessToken)
        .then(txs => {
          setTransactions(txs);
          setIsSyncing(false);
        })
        .catch(err => {
          console.error('OAuth sync error:', err);
          setErrorMessage('Não foi possível carregar as contas diretamente via Google. Verifique se sua conta do meu.pluggy.ai possui conexões ativas.');
          setIsSyncing(false);
        });
    }
  }, []);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsSyncing(true);
    loginWithGooglePluggy();
  };

  const handleTokenInputChange = (value) => {
    setRawInputToken(value);
    const cleanToken = extractBearerToken(value);
    setExtractedToken(cleanToken);

    if (cleanToken) {
      const payload = parseJwtPayload(cleanToken);
      setJwtInfo(payload);
    } else {
      setJwtInfo(null);
    }
  };

  const handleConnectMeuPluggy = async () => {
    setErrorMessage('');
    const tokenToUse = extractedToken || rawInputToken;

    if (!tokenToUse && mode === 'meu_pluggy') {
      setErrorMessage('Insira seu Bearer Token ou cURL do meu.pluggy.ai');
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
        const txs = await fetchAllMeuPluggyTransactions(tokenToUse);
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
              Sincronização 1-Clique meu.pluggy.ai
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Login rápido via Google para importação automática de transações reais
            </span>
          </div>

          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Select Mode */}
        {step === 1 && (
          <div>
            {/* Primary 1-Click Google Auth Option */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.12) 0%, rgba(52, 168, 83, 0.12) 100%)',
              border: '1px solid rgba(66, 133, 244, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
              </div>

              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '6px' }}>
                Entrar com o Google (Sincronização Direta)
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px', maxWidth: '480px', margin: '0 auto 18px auto', lineHeight: 1.5 }}>
                Conecte-se com a mesma conta do Google utilizada no <strong>meu.pluggy.ai</strong> para autorizar a leitura das suas transações bancárias com 1 clique!
              </p>

              {isSyncing ? (
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <RefreshCw size={20} color="var(--accent-blue)" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                    Redirecionando para login seguro no Google...
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="btn btn-primary"
                  style={{
                    padding: '12px 28px',
                    fontSize: '0.95rem',
                    background: '#ffffff',
                    color: '#1f2937',
                    border: '1px solid #d1d5db',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  Entrar com o Google <ArrowRight size={16} />
                </button>
              )}
            </div>

            {/* Secondary Options */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setMode(mode === 'meu_pluggy' ? 'google' : 'meu_pluggy')}
                className="btn btn-outline"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                {mode === 'meu_pluggy' ? 'Ocultar Opção cURL' : 'Inserir cURL / Token Manual'}
              </button>

              <button
                type="button"
                onClick={() => setMode('ofx_file')}
                className={`btn ${mode === 'ofx_file' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                <FileText size={14} /> Importar OFX / CSV
              </button>
            </div>

            {/* Manual Token Option */}
            {mode === 'meu_pluggy' && (
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <textarea
                  rows={3}
                  placeholder="Cole o cURL do navegador ou seu Bearer Token..."
                  value={rawInputToken}
                  onChange={(e) => handleTokenInputChange(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8rem', fontFamily: 'monospace' }}
                />
                <button onClick={handleConnectMeuPluggy} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                  Sincronizar via Token Manual
                </button>
              </div>
            )}

            {/* OFX File Option */}
            {mode === 'ofx_file' && (
              <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border-color)', textAlign: 'center' }}>
                <Upload size={32} color="var(--accent-blue)" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '4px' }}>
                  Carregar Extrato Bancário (.OFX / .CSV)
                </h4>
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
                  style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  Selecionar Arquivo
                </button>
              </div>
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
                  Extrato Importado via Google / meu.pluggy.ai
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
