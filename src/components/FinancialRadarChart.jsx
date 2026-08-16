import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { PieChart, Sliders } from 'lucide-react';

export default function FinancialRadarChart() {
  const { data, updateRadarPoint } = useFinance();

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart color="var(--accent-blue)" size={24} />
          8. RADAR DA SAÚDE FINANCEIRA
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Gráfico comparativo em radar (Teia de Aranha) entre o padrão Ideal vs Sua Situação Atual.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>
        {/* Radar Chart Visual */}
        <div style={{ width: '100%', height: '360px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.radarHealth}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" tick={{ fontSize: 12, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-muted)" />
              <Radar
                name="Ideal"
                dataKey="ideal"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="Sua situação"
                dataKey="situacao"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Controls / Sliders */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-blue)" /> Ajustar Notas do Radar (0 a 100)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data.radarHealth.map((item, idx) => (
              <div key={item.subject}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.subject}</span>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>
                    {item.situacao} / 100 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Ideal: {item.ideal})</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item.situacao}
                  onChange={(e) => updateRadarPoint(idx, e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
