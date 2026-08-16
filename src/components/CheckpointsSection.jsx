import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Calendar,
  BookmarkPlus,
  Trash2,
  TrendingUp,
  History,
  Check,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart as PieIcon,
  Shield,
  RotateCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export default function CheckpointsSection() {
  const {
    data,
    checkpoints,
    saveCurrentCheckpoint,
    deleteCheckpoint,
    loadCheckpoint,
    getTotalGastos,
    getRendaLiquida,
    getPoupancaMensal,
    getTaxaPoupanca,
    getOverallHealthScore
  } = useFinance();

  const [checkpointNameInput, setCheckpointNameInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const nameToSave = checkpointNameInput.trim() || `Checkpoint ${new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`;
    saveCurrentCheckpoint(nameToSave);
    setCheckpointNameInput('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Prepare chart comparison data
  const chartData = checkpoints.map(c => ({
    name: c.label || c.monthName,
    Renda: c.rendaLiquida,
    Gastos: c.totalGastos,
    Poupança: c.poupancaMensal,
    TaxaPoupança: c.taxaPoupanca,
    Saúde: c.overallHealthScore
  }));

  // Compare latest two checkpoints if available
  const latest = checkpoints[checkpoints.length - 1];
  const previous = checkpoints[checkpoints.length - 2];

  const calcDiff = (currVal, prevVal) => {
    if (!prevVal) return null;
    const diff = currVal - prevVal;
    const pct = (diff / prevVal) * 100;
    return { diff, pct };
  };

  const gastosDiff = latest && previous ? calcDiff(latest.totalGastos, previous.totalGastos) : null;
  const poupancaDiff = latest && previous ? calcDiff(latest.poupancaMensal, previous.poupancaMensal) : null;

  return (
    <section className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
            <History color="var(--accent-blue)" size={26} />
            CHECKPOINTS MENSAIS & EVOLUÇÃO HISTÓRICA
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Salve o retratos mensais do seu orçamento para comparar os gastos, taxa de poupança e saúde financeira ao longo do tempo.
          </p>
        </div>

        {/* Quick Save Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Ex: Agosto / 2026..."
            value={checkpointNameInput}
            onChange={(e) => setCheckpointNameInput(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '8px 12px', width: '180px' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <BookmarkPlus size={16} /> Salvar Checkpoint
          </button>
        </form>
      </div>

      {savedSuccess && (
        <div style={{ background: 'var(--status-verde-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', color: 'var(--accent-green)', fontWeight: 700, textAlign: 'center' }}>
          ✓ Checkpoint do mês salvo com sucesso no seu histórico!
        </div>
      )}

      {/* Overview Metric Comparison Cards */}
      {checkpoints.length >= 2 && latest && previous && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {/* Gastos Variation */}
          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Variação de Gastos ({previous.label} ➔ {latest.label})
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: gastosDiff.diff <= 0 ? 'var(--accent-green)' : 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {gastosDiff.diff <= 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
              {formatCurrency(Math.abs(gastosDiff.diff))}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                ({gastosDiff.pct.toFixed(1)}%)
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {gastosDiff.diff <= 0 ? '✓ Redução positiva de despesas em relação ao mês anterior.' : '⚠️ Aumento de despesas em relação ao mês anterior.'}
            </p>
          </div>

          {/* Poupança Variation */}
          <div style={{ background: 'var(--bg-primary)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Variação de Poupança ({previous.label} ➔ {latest.label})
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: poupancaDiff.diff >= 0 ? 'var(--accent-green)' : 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {poupancaDiff.diff >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
              {formatCurrency(Math.abs(poupancaDiff.diff))}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                ({poupancaDiff.pct.toFixed(1)}%)
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {poupancaDiff.diff >= 0 ? '✓ Evolução positiva da capacidade de investimento.' : '⚠️ Queda na sobra líquida em relação ao mês anterior.'}
            </p>
          </div>
        </div>
      )}

      {/* Comparison Charts */}
      {checkpoints.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          {/* Bar Chart: Renda vs Gastos vs Poupança */}
          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart3 size={16} color="var(--accent-blue)" /> Evolução Mensal (Renda vs Gastos vs Poupança)
            </h4>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="Gastos" fill="var(--accent-rose)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Poupança" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Taxa de Poupança % & Saúde Financeira */}
          <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} color="var(--accent-green)" /> Evolução da Taxa de Poupança (%)
            </h4>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} unit="%" />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="TaxaPoupança" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Saúde" stroke="var(--accent-green)" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <Sparkles size={32} color="var(--accent-blue)" style={{ marginBottom: '10px' }} />
          <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>
            Nenhum Checkpoint Mensal Salvo Ainda
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
            Clique no botão <strong>"Salvar Checkpoint"</strong> acima para tirar a primeira foto do seu orçamento de <strong>{data.perfil.dataBase}</strong>!
          </p>
        </div>
      )}

      {/* Saved Checkpoints List Table */}
      {checkpoints.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '12px' }}>
            Histórico de Checkpoints Salvos ({checkpoints.length})
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Checkpoint</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Renda</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Gastos Totais</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Poupança Mensal</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Taxa Poupança</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Saúde (Score)</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {checkpoints.map((chk) => (
                <tr key={chk.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--accent-blue)" />
                      {chk.label || chk.monthName}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Salvo em: {new Date(chk.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(chk.rendaLiquida)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--accent-rose)' }}>{formatCurrency(chk.totalGastos)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--accent-green)' }}>{formatCurrency(chk.poupancaMensal)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                    <span className="status-badge verde">
                      {(chk.taxaPoupanca || 0).toFixed(1)}%
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 800, color: 'var(--accent-blue)' }}>
                    {chk.overallHealthScore}/100
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja carregar o estado do checkpoint "${chk.label}" no aplicativo?`)) {
                            loadCheckpoint(chk.id);
                          }
                        }}
                        className="btn btn-outline"
                        style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                        title="Carregar este checkpoint"
                      >
                        <RotateCcw size={12} /> Carregar
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja excluir permanentemente o checkpoint "${chk.label}"?`)) {
                            deleteCheckpoint(chk.id);
                          }
                        }}
                        className="btn btn-outline"
                        style={{ fontSize: '0.72rem', padding: '4px 8px', borderColor: 'rgba(244,63,94,0.4)', color: 'var(--accent-rose)' }}
                        title="Excluir checkpoint"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
