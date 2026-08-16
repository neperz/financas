import React, { useState, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Moon,
  Sun,
  RotateCcw,
  ShieldCheck,
  DollarSign,
  Users,
  MapPin,
  Sparkles,
  Edit2,
  Check,
  FileDown,
  Download,
  Upload,
  TrendingUp,
  Globe
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import GoldenRulesModal from './GoldenRulesModal';

export default function Header() {
  const {
    data,
    marketData,
    darkMode,
    toggleDarkMode,
    resetToDefault,
    exportDataJSON,
    importDataJSON,
    getRendaLiquida,
    getTotalGastos,
    getPoupancaMensal,
    getTaxaPoupanca,
    updatePerfil
  } = useFinance();

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [editingRenda, setEditingRenda] = useState(false);
  const [tempRenda, setTempRenda] = useState(data.perfil.rendaLiquidaMensal);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const fileInputRef = useRef(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleSaveRenda = () => {
    updatePerfil({ rendaLiquidaMensal: Number(tempRenda) || 0 });
    setEditingRenda(false);
  };

  const handleFileImport = (e) => {
    if (e.target.files && e.target.files[0]) {
      importDataJSON(e.target.files[0]);
    }
  };

  // Export PDF functionality using html2pdf
  const handleExportPDF = () => {
    setIsGeneratingPDF(true);
    const element = document.getElementById('app-main-content') || document.body;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `plano_financeiro_familiar_${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsGeneratingPDF(false);
    }).catch(err => {
      console.error('PDF export error:', err);
      setIsGeneratingPDF(false);
    });
  };

  const renda = getRendaLiquida();
  const gastos = getTotalGastos();
  const poupanca = getPoupancaMensal();
  const taxaPoupanca = getTaxaPoupanca();

  return (
    <header style={{ marginBottom: '28px' }}>
      {/* Live Market Indicators Ticker Bar */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        padding: '6px 16px',
        marginBottom: '16px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} /> Mercado ao Vivo (BCB):
          </span>
          <span>SELIC: <strong>{marketData.selic}% a.a.</strong></span>
          <span>IPCA (Inflação): <strong>{marketData.ipca}% a.a.</strong></span>
          <span>USD: <strong>R$ {marketData.usd}</strong></span>
          <span>EUR: <strong>R$ {marketData.eur}</strong></span>
        </div>

        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {marketData.updatedAt ? `Atualizado às ${marketData.updatedAt}` : 'Indicadores do Mercado'}
        </div>
      </div>

      {/* Top Banner / Navigation */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                PLANO FINANCEIRO FAMILIAR
              </h1>
              <span className="status-badge verde">
                <Sparkles size={12} /> Gestão Familiar
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
              ORGANIZE, PLANEJE E CONSTRUA O FUTURO DA SUA FAMÍLIA
            </p>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Export PDF Button */}
            <button
              onClick={handleExportPDF}
              className="btn btn-primary"
              disabled={isGeneratingPDF}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              title="Gerar e Baixar Relatório em PDF"
            >
              <FileDown size={16} />
              {isGeneratingPDF ? 'Gerando PDF...' : 'Baixar PDF'}
            </button>

            {/* Backup JSON Buttons */}
            <button
              onClick={exportDataJSON}
              className="btn btn-outline"
              title="Exportar dados em JSON"
              style={{ padding: '8px 12px' }}
            >
              <Download size={15} />
            </button>

            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="btn btn-outline"
              title="Importar dados em JSON"
              style={{ padding: '8px 12px' }}
            >
              <Upload size={15} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              style={{ display: 'none' }}
            />

            {/* Rules Button */}
            <button
              onClick={() => setIsRulesOpen(true)}
              className="btn btn-outline"
              title="Regras de Ouro"
              style={{ padding: '8px 12px' }}
            >
              <ShieldCheck size={16} color="var(--accent-amber)" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-outline"
              title={darkMode ? "Modo Claro" : "Modo Escuro"}
              style={{ padding: '8px 12px' }}
            >
              {darkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#3b82f6" />}
            </button>

            {/* Reset Data */}
            <button
              onClick={() => {
                if (window.confirm('Deseja restaurar os dados padrões?')) {
                  resetToDefault();
                }
              }}
              className="btn btn-outline"
              title="Restaurar Dados Padrão"
              style={{ padding: '8px 12px' }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Profile Info Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={15} color="var(--accent-blue)" />
            <strong>Composição:</strong> {data.perfil.composicao}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} color="var(--accent-purple)" />
            <strong>Localização:</strong> {data.perfil.localizacao}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} color="var(--accent-green)" />
            <strong>Classe:</strong> {data.perfil.classe}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={15} color="var(--accent-amber)" />
            <strong>Data-base:</strong> {data.perfil.dataBase}
          </div>
        </div>
      </div>

      {/* Main Income & Expense Summary Cards Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {/* Rendimento Líquido Mensal Card */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Rendimento Líquido Mensal
            </span>
            <button
              onClick={() => setEditingRenda(!editingRenda)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              title="Editar renda líquida"
            >
              <Edit2 size={14} />
            </button>
          </div>

          {editingRenda ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                value={tempRenda}
                onChange={(e) => setTempRenda(e.target.value)}
                style={{ width: '140px', fontWeight: 'bold', fontSize: '1.1rem' }}
              />
              <button onClick={handleSaveRenda} className="btn btn-primary" style={{ padding: '4px 8px' }}>
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-green)' }}>
              {formatCurrency(renda)}
            </div>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Renda total da família disponível
          </span>
        </div>

        {/* Gastos Totais Card */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-rose)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Gastos Totais Mensais
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-rose)', margin: '4px 0' }}>
            {formatCurrency(gastos)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {((gastos / renda) * 100).toFixed(1)}% da renda comprometida
          </span>
        </div>

        {/* Poupança Mensal Card */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-blue)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Poupança Mensal
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-blue)', margin: '4px 0' }}>
            {formatCurrency(poupanca)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Valor investido / reservado por mês
          </span>
        </div>

        {/* Taxa de Poupança Card */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-amber)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Taxa de Poupança
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {taxaPoupanca.toFixed(1)}%
            </div>
            <span className={`status-badge ${taxaPoupanca >= 10 ? 'verde' : 'vermelho'}`}>
              {taxaPoupanca >= 10 ? 'Saudável' : 'Abaixo da meta'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Ideal: poupar entre 10% e 20% da renda líquida
          </span>
        </div>
      </div>

      {/* Modal de Regras de Ouro */}
      <GoldenRulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </header>
  );
}
