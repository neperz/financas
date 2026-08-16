import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, Plus, Trash2, AlertTriangle, CheckCircle, Calendar, DollarSign } from 'lucide-react';

export default function GoalsSection() {
  const {
    data,
    getPoupancaMensal,
    updateObjetivo,
    addObjetivo,
    deleteObjetivo
  } = useFinance();

  const [novoObjetivo, setNovoObjetivo] = useState('');
  const [novoPrazo, setNovoPrazo] = useState(1);
  const [novaMeta, setNovaMeta] = useState('');
  const [novoAporte, setNovoAporte] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const poupancaMensal = getPoupancaMensal();

  const totalAportesSugeridos = data.objetivos.reduce((acc, item) => acc + (Number(item.aporteSugerido) || 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (novoObjetivo && novaMeta) {
      addObjetivo({
        objetivo: novoObjetivo,
        prazoAnos: Number(novoPrazo) || 1,
        meta: Number(novaMeta) || 0,
        aporteSugerido: Number(novoAporte) || 0
      });
      setNovoObjetivo('');
      setNovaMeta('');
      setNovoAporte('');
      setShowAddForm(false);
    }
  };

  const isViable = totalAportesSugeridos <= poupancaMensal;

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target color="var(--accent-purple)" size={24} />
            3. OBJETIVOS DA FAMÍLIA
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Planejamento de conquistas de curto, médio e longo prazo com aportes mensais sugeridos.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          style={{ padding: '6px 14px' }}
        >
          <Plus size={16} /> Novo Objetivo
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>Adicionar Novo Objetivo Financeiro</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Objetivo</label>
              <input
                type="text"
                placeholder="Ex: Viagem internacional"
                value={novoObjetivo}
                onChange={(e) => setNovoObjetivo(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prazo (anos)</label>
              <input
                type="number"
                value={novoPrazo}
                onChange={(e) => setNovoPrazo(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Valor Meta (R$)</label>
              <input
                type="number"
                placeholder="30000"
                value={novaMeta}
                onChange={(e) => setNovaMeta(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aporte Sugerido (R$)</label>
              <input
                type="number"
                placeholder="2200"
                value={novoAporte}
                onChange={(e) => setNovoAporte(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline" style={{ padding: '4px 12px' }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '4px 12px' }}>
              Salvar Objetivo
            </button>
          </div>
        </form>
      )}

      {/* Feasibility Alert Banner */}
      <div style={{
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '20px',
        background: isViable ? 'var(--status-verde-bg)' : 'var(--status-amarelo-bg)',
        border: `1px solid ${isViable ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {isViable ? <CheckCircle color="var(--accent-green)" size={22} /> : <AlertTriangle color="var(--accent-amber)" size={22} />}
        <div style={{ fontSize: '0.85rem' }}>
          <strong>Soma dos Aportes Sugeridos: {formatCurrency(totalAportesSugeridos)} / mês</strong>
          <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
            (Poupança Mensal Disponível: {formatCurrency(poupancaMensal)})
          </span>
          {!isViable && (
            <p style={{ marginTop: '4px', color: 'var(--status-amarelo-text)' }}>
              ⚠️ Observação: Executar todos os objetivos simultaneamente exige um aporte total superior à poupança mensal. É recomendado escalonar as metas por prioridade de tempo.
            </p>
          )}
        </div>
      </div>

      {/* Objectives Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px' }}>Objetivo</th>
              <th style={{ padding: '10px' }}>Prazo</th>
              <th style={{ padding: '10px' }}>Meta (R$)</th>
              <th style={{ padding: '10px' }}>Aporte Mensal Sugerido</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.objetivos.map((obj) => (
              <tr key={obj.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {obj.objetivo}
                </td>
                <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="var(--accent-blue)" /> {obj.prazoAnos} {obj.prazoAnos === 1 ? 'ano' : 'anos'}
                  </span>
                </td>
                <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--accent-purple)' }}>
                  <input
                    type="number"
                    value={obj.meta}
                    onChange={(e) => updateObjetivo(obj.id, { meta: Number(e.target.value) })}
                    style={{ width: '120px', fontWeight: 'bold' }}
                  />
                </td>
                <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--accent-green)' }}>
                  <input
                    type="number"
                    value={obj.aporteSugerido}
                    onChange={(e) => updateObjetivo(obj.id, { aporteSugerido: Number(e.target.value) })}
                    style={{ width: '110px', fontWeight: 'bold' }}
                  />
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                  <button
                    onClick={() => deleteObjetivo(obj.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                    title="Remover objetivo"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
