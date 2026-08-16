import React, { useState, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { fetchAllMeuPluggyTransactions, fetchMeuPluggyInvestments } from '../services/pluggyService';
import { loginWithGooglePluggy } from '../services/googleAuthService';
import { fetchMockOpenFinanceStatements } from '../services/openFinanceService';
import { parseBankStatementFile } from '../services/ofxParserService';
import { extractBearerToken, parseJwtPayload } from '../services/jwtHelper';
import { ShieldCheck, Plug, FileText, Upload, RefreshCw, X, Check, Sparkles, AlertCircle, ArrowRight, UserCheck, Key, Lock, Copy, Terminal, ExternalLink, Calendar, TrendingUp, PieChart } from 'lucide-react';

const getRecentMonths = () => {
  const months = [];
  const date = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
    const year = d.getFullYear();
    const monthNum = String(d.getMonth() + 1).padStart(2, '0');
    const monthName = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    months.push({
      value: `${year}-${monthNum}`,
      label: monthName.charAt(0).toUpperCase() + monthName.slice(1)
    });
  }
  return months;
};

export default function PluggyConnectModal({ isOpen, onClose }) {
  const { data, updateItemDespesa, addItemDespesa, updatePatrimonioSituacao } = useFinance();

  const availableMonths = getRecentMonths();
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0].value);

  const [mode, setMode] = useState('google'); // 'google', 'ofx_file', 'sandbox'
  const [rawInputToken, setRawInputToken] = useState('');
  const [extractedToken, setExtractedToken] = useState('');
  const [jwtInfo, setJwtInfo] = useState(null);
  const [step, setStep] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setErrorMessage('');
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

    if (!tokenToUse) {
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

      const [txs, invs] = await Promise.all([
        fetchAllMeuPluggyTransactions(tokenToUse, { selectedMonth }),
        fetchMeuPluggyInvestments(tokenToUse).catch(() => [])
      ]);

      setTransactions(txs);
      setInvestments(invs);
      setIsSyncing(false);

      if (txs.length > 0 || invs.length > 0) {
        setStep(3);
      } else {
        setErrorMessage(`Nenhuma transação ou investimento foi encontrado para o mês selecionado (${selectedMonth}).`);
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
      let parsedTxs = parseBankStatementFile(content, file.name);

      if (selectedMonth && selectedMonth !== 'all') {
        parsedTxs = parsedTxs.filter(t => t.date.startsWith(selectedMonth));
      }

      if (parsedTxs.length > 0) {
        setTransactions(parsedTxs);
        setIsSyncing(false);
        setStep(3);
      } else {
        alert(`Não foram encontradas transações no mês selecionado (${selectedMonth}) no arquivo.`);
        setIsSyncing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleCategoryChange = (txId, newCat) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, category: newCat } : t));
  };

  const handleApplyToBudget = () => {
    // 1. Group transactions by category and description
    const categoryTotalsMap = new Map();

    transactions.forEach(tx => {
      const key = `${tx.category}_${tx.description.toLowerCase().trim()}`;
      if (categoryTotalsMap.has(key)) {
        const current = categoryTotalsMap.get(key);
        current.amount += tx.amount;
      } else {
        categoryTotalsMap.set(key, {
          categoryId: tx.category,
          description: tx.description.trim(),
          amount: tx.amount
        });
      }
    });

    categoryTotalsMap.forEach((entry) => {
      const category = data.despesas.find(c => c.id === entry.categoryId);
      if (category) {
        const existingItem = category.itens.find(i => 
          i.nome.toLowerCase().trim() === entry.description.toLowerCase().trim()
        );
        if (existingItem) {
          updateItemDespesa(entry.categoryId, existingItem.id, entry.amount);
        } else {
          addItemDespesa(entry.categoryId, entry.description, entry.amount);
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
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const totalInvestmentsBalance = investments.reduce((acc, inv) => acc + inv.balance, 0);

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
        maxWidth: '740px',
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
              Conexão com o Google & meu.pluggy.ai
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Sincronização de Transações Bancárias e Ativos de Investimentos reais
            </span>
          </div>

          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Select Mode */}
        {step === 1 && (
          <div>
            {/* Month Filter Selector */}
            <div style={{ background: 'var(--bg-primary)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)' }}>
                <Calendar size={18} />
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Mês de Referência da Importação:</strong>
              </div>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ fontSize: '0.9rem', fontWeight: 700, padding: '6px 14px', borderRadius: 'var(--radius-sm)' }}
              >
                {availableMonths.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
                <option value="all">Todos os Meses (Extrato Completo)</option>
              </select>
            </div>

            {/* Primary Google Auth Option */}
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
                1. Autenticar com o Google no meu.pluggy.ai
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px', maxWidth: '500px', margin: '0 auto 18px auto', lineHeight: 1.5 }}>
                Clique abaixo para abrir o login oficial do Google no <strong>meu.pluggy.ai</strong> e autorizar a leitura das suas contas bancárias e ativos de investimento:
              </p>

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
                  boxShadow: 'var(--shadow-sm)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>Entrar com o Google no meu.pluggy.ai</span>
                <ExternalLink size={16} />
              </button>
            </div>

            {/* Input Token / cURL Section */}
            <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={16} color="var(--accent-blue)" />
                2. Cole o cURL ou Token de Autenticação:
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                Cole o comando <strong>cURL</strong> (copiado do DevTools F12 do meu.pluggy.ai) ou o seu Bearer token abaixo para carregar as despesas e investimentos do mês <strong>{availableMonths.find(m => m.value === selectedMonth)?.label || selectedMonth}</strong>:
              </p>

              <textarea
                rows={3}
                placeholder="Cole aqui a linha cURL ou seu Bearer token (curl 'https://my-api.pluggy.ai...' -H 'Authorization: Bearer eyJ...')..."
                value={rawInputToken}
                onChange={(e) => handleTokenInputChange(e.target.value)}
                style={{ width: '100%', fontSize: '0.8rem', fontFamily: 'monospace', padding: '10px', marginBottom: '10px' }}
              />

              {extractedToken && (
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', fontSize: '0.8rem', color: 'var(--accent-green)' }}>
                  ✓ Token JWT extraído! Usuário: <strong>{jwtInfo ? (jwtInfo['https://api.pluggy.ai/email'] || jwtInfo.sub) : 'Autenticado'}</strong>
                </div>
              )}

              {errorMessage && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginBottom: '12px', background: 'rgba(244,63,94,0.1)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              {isSyncing ? (
                <div style={{ padding: '10px', textAlign: 'center', color: 'var(--accent-blue)', fontWeight: 600 }}>
                  <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
                  Buscando extratos e carteira de investimentos em my-api.pluggy.ai...
                </div>
              ) : (
                <button onClick={handleConnectMeuPluggy} className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}>
                  Sincronizar Extrato e Ativos de Investimento <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Review Transactions & Investments */}
        {step === 3 && (
          <div>
            {/* Investment Assets Card Banner */}
            {investments.length > 0 && (
              <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp size={18} color="var(--accent-green)" />
                    Carteira de Ativos de Investimentos Importada ({investments.length})
                  </h4>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                    Total: {formatCurrency(totalInvestmentsBalance)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {investments.map((inv) => (
                    <div key={inv.id} style={{ background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', flex: 1, minWidth: '180px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{inv.code}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inv.name}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {formatCurrency(inv.balance)}
                        {inv.annualRate && <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', marginLeft: '6px' }}>({inv.annualRate}% a.a.)</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={18} color="var(--accent-blue)" />
                  Extrato de Despesas ({availableMonths.find(m => m.value === selectedMonth)?.label || selectedMonth})
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Transações bancárias classificadas nas 8 categorias de despesas do projeto.
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
                ✓ Transações e carteira de ativos de investimentos sincronizados com sucesso!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(1)} className="btn btn-outline">
                  Nova Conexão
                </button>
                <button onClick={handleApplyToBudget} className="btn btn-primary" style={{ padding: '10px 20px' }}>
                  <Check size={16} /> Preencher Orçamento com Extrato ({selectedMonth})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
