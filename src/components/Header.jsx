import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Moon, Sun, RotateCcw, ShieldCheck, DollarSign, Users, MapPin, Sparkles, Edit2, Check } from 'lucide-react';
import GoldenRulesModal from './GoldenRulesModal';

export default function Header() {
  const {
    data,
    darkMode,
    toggleDarkMode,
    resetToDefault,
    getRendaLiquida,
    getTotalGastos,
    getPoupancaMensal,
    getTaxaPoupanca,
    updatePerfil
  } = useFinance();

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [editingRenda, setEditingRenda] = useState(false);
  const [tempRenda, setTempRenda] = useState(data.perfil.rendaLiquidaMensal);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleSaveRenda = () => {
    updatePerfil({ rendaLiquidaMensal: Number(tempRenda) || 0 });
    setEditingRenda(false);
  };

  const renda = getRendaLiquida();
  const gastos = getTotalGastos();
  const poupanca = getPoupancaMensal();
  const taxaPoupanca = getTaxaPoupanca();

  return (
    <header style={{ marginBottom: '32px' }}>
      {/* Top Banner / Navigation */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setIsRulesOpen(true)}
              className="btn btn-outline"
              title="Regras de Ouro"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ShieldCheck size={16} color="var(--accent-amber)" />
              <span style={{ display: 'inline' }}>Regras de Ouro</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="btn btn-outline"
              title={darkMode ? "Modo Claro" : "Modo Escuro"}
              style={{ padding: '8px 12px' }}
            >
              {darkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#3b82f6" />}
            </button>

            <button
              onClick={() => {
                if (window.confirm('Deseja restaurar os dados padrões do infográfico?')) {
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
