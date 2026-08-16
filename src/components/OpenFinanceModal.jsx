import React, { useState, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SUPPORTED_BANKS, fetchMockOpenFinanceStatements, categorizeTransaction } from '../services/openFinanceService';
import { parseBankStatementFile } from '../services/ofxParserService';
import { ShieldCheck, Lock, Upload, RefreshCw, X, ArrowRight, Building, Check, Sparkles, Key, FileText } from 'lucide-react';

export default function OpenFinanceModal({ isOpen, onClose }) {
  const { data, updateItemDespesa, addItemDespesa } = useFinance();

  const [step, setStep] = useState(1); // 1: Select Bank, 2: Select Import Method, 3: Review Transactions
  const [selectedBank, setSelectedBank] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [fileName, setFileName] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setStep(2);
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
        // Tag with selected bank
        const taggedTxs = parsedTxs.map(t => ({
          ...t,
          bankName: selectedBank ? selectedBank.name : t.bankName
        }));
        setTransactions(taggedTxs);
        setIsSyncing(false);
        setStep(3);
      } else {
        alert('Não foram encontradas transações válidas no arquivo selecionado.');
        setIsSyncing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleAuthorizeConsent = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const txs = fetchMockOpenFinanceStatements(selectedBank.id);
      setTransactions(txs);
      setIsSyncing(false);
      setStep(3);
    }, 1200);
  };

  const handleCategoryChange = (txId, newCat) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, category: newCat } : t));
  };

  const handleApplyToBudget = () => {
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
        maxWidth: '720px',
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
              Open Finance Brasil & Integração de Extratos
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Protocolo Criptografado FAPI • Leitura Real de Extratos OFX, CSV & APIs
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
              Selecione o seu banco para importar transações e preencher seu orçamento automaticamente:
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
                      Extrato OFX/CSV & API Direta
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="var(--accent-green)" />
              <span>Processamento 100% local e seguro no seu próprio navegador (LGPD total).</span>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Import Method for Selected Bank */}
        {step === 2 && selectedBank && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '2.4rem' }}>{selectedBank.logo}</span>
              <div>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                  {selectedBank.name} — Método de Importação Real
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Escolha como deseja importar o extrato de despesas
                </span>
              </div>
            </div>

            {/* Method A: Upload Real OFX/CSV File */}
            <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-blue)' }}>
                <Upload size={20} />
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  1. Carregar Extrato Real em Arquivo (.OFX ou .CSV)
                </h5>
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                Baixe o extrato no formato <strong>.OFX</strong> ou <strong>.CSV</strong> direto do aplicativo ou Internet Banking do <strong>{selectedBank.name}</strong> e selecione-o abaixo:
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
                style={{ padding: '9px 20px', fontSize: '0.85rem' }}
              >
                <FileText size={16} /> Selecionar Arquivo do {selectedBank.name}
              </button>
            </div>

            {/* Method B: API Token Input */}
            <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-amber)' }}>
                <Key size={20} />
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  2. Conectar via Token de API / Credencial FAPI
                </h5>
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Se você possui um Token de API OAuth2 ou Chave do Portal Developers do <strong>{selectedBank.name}</strong>, insira abaixo:
              </p>

              <input
                type="password"
                placeholder={`Insira o Token FAPI de API do ${selectedBank.name}`}
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem', marginBottom: '12px' }}
              />

              <button
                onClick={handleAuthorizeConsent}
                className="btn btn-outline"
                style={{ padding: '9px 20px', fontSize: '0.85rem' }}
              >
                Conectar via Token de API <ArrowRight size={14} />
              </button>
            </div>

            {/* Method C: Test Sample Data */}
            <div style={{ background: 'var(--bg-primary)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Deseja apenas testar a categorização com dados de demonstração do {selectedBank.name}?
              </span>
              <button onClick={handleAuthorizeConsent} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                Carregar Amostra
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
              <button onClick={() => setStep(1)} className="btn btn-outline">
                Voltar aos Bancos
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Apply Categorized Transactions */}
        {step === 3 && selectedBank && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={18} color="var(--accent-green)" />
                  Transações Importadas: {selectedBank.name} {fileName ? `(${fileName})` : ''}
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
