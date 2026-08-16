import React from 'react';
import { Heart, RefreshCw, MessageSquare, TrendingUp, ShieldCheck, Bookmark } from 'lucide-react';

export default function Footer() {
  const tips = [
    { icon: Heart, text: "Separe o emocional do financeiro. Decisões conscientes geram liberdade.", color: "#ec4899" },
    { icon: RefreshCw, text: "Revise seu orçamento todos os meses. Pequenos ajustes fazem grande diferença.", color: "#3b82f6" },
    { icon: MessageSquare, text: "Converse com a família sobre dinheiro. Todos devem participar dos objetivos.", color: "#8b5cf6" },
    { icon: TrendingUp, text: "Invista com propósito. Seu dinheiro trabalhando hoje, para você no futuro.", color: "#10b981" },
    { icon: ShieldCheck, text: "Proteja o que mais importa: sua família. Seguros são essenciais.", color: "#f59e0b" }
  ];

  return (
    <footer style={{ marginTop: '48px', paddingBottom: '32px' }}>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bookmark size={20} color="var(--accent-blue)" /> Dicas e Princípios Importantes
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {tips.map((tip, idx) => {
            const IconComp = tip.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: `${tip.color}20`, color: tip.color }}>
                  <IconComp size={18} />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {tip.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>
          Fontes: IBGE, ANS, DIEESE, pesquisa de mercado e consultoria financeira.
        </p>
        <p style={{ marginTop: '4px' }}>
          Aplicação de Planejamento Financeiro Familiar.
        </p>
      </div>
    </footer>
  );
}
