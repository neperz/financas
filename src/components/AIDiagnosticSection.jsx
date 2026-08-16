import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Bot, Sparkles, Copy, Check, Lightbulb, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';

export default function AIDiagnosticSection() {
  const {
    data,
    getRendaLiquida,
    getTotalGastos,
    getPoupancaMensal,
    getTaxaPoupanca,
    getReservaPctConcluido,
    getCategoriaPct,
    getCategoriaStatus,
    getOverallHealthScore
  } = useFinance();

  const [copied, setCopied] = useState(false);

  const renda = getRendaLiquida();
  const gastos = getTotalGastos();
  const poupanca = getPoupancaMensal();
  const taxaPoupanca = getTaxaPoupanca();
  const reservaPct = getReservaPctConcluido();
  const score = getOverallHealthScore();

  const protecaoPct = getCategoriaPct('protecao');
  const educacaoPct = getCategoriaPct('educacao');
  const moradiaPct = getCategoriaPct('moradia');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Generate automated AI recommendations
  const generateInsights = () => {
    const insights = [];

    if (protecaoPct < 3) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Vulnerabilidade em Proteção Familiar',
        desc: `Alocação em Proteção (seguros de vida/residencial) está em apenas ${protecaoPct.toFixed(1)}% (ideal: 5% a 10%). Uma emergência de saúde ou patrimonial pode desestabilizar a família.`
      });
    }

    if (reservaPct < 50) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Reserva de Emergência em Formação',
        desc: `Sua reserva está em ${reservaPct.toFixed(1)}% da meta. Recomendamos priorizar a alocação da poupança mensal (${formatCurrency(poupanca)}) na reserva antes de metas de longo prazo.`
      });
    }

    if (taxaPoupanca >= 20) {
      insights.push({
        type: 'success',
        icon: ShieldCheck,
        title: 'Excelente Capacidade de Poupança',
        desc: `Sua taxa de poupança atual é de ${taxaPoupanca.toFixed(1)}%, superando a meta ideal de 20%. Isso acelera fortemente a Independência Financeira.`
      });
    }

    if (moradiaPct <= 20) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Custo de Moradia Controlado',
        desc: `Seus gastos com moradia representam ${moradiaPct.toFixed(1)}% da renda (ideal: até 30%). Essa folga garante resiliência financeira.`
      });
    }

    return insights;
  };

  const insights = generateInsights();

  // Generate prompt for ChatGPT / Gemini
  const generateAIPrompt = () => {
    return `Atue como um Consultor Financeiro Familiar Sênior Certified Financial Planner (CFP). 
Analise o diagnóstico financeiro da minha família abaixo e me forneça um plano de ação em 5 passos com recomendações práticas:

--- DADOS DA FAMÍLIA ---
- Composição: ${data.perfil.composicao} (${data.perfil.classe})
- Renda Líquida Mensal: ${formatCurrency(renda)}
- Gastos Totais Mensais: ${formatCurrency(gastos)} (${((gastos/renda)*100).toFixed(1)}% da renda)
- Poupança Mensal: ${formatCurrency(poupanca)} (${taxaPoupanca.toFixed(1)}% da renda)
- Reserva de Emergência Atual: R$ ${data.reservaEmergencia.reservaAtual} (Meta: ${data.reservaEmergencia.mesesRecomendados} meses - ${reservaPct.toFixed(1)}% concluída)
- Score Geral de Saúde Financeira: ${score} / 100

--- DISTRIBUIÇÃO DAS DESPESAS ---
${data.despesas.map(c => `- ${c.nome}: ${formatCurrency(getCategoriaPct(c.id) * renda / 100)} (${getCategoriaPct(c.id).toFixed(1)}% da renda)`).join('\n')}

--- OBJETIVOS DA FAMÍLIA ---
${data.objetivos.map(o => `- ${o.objetivo} (${o.prazoAnos} anos): Meta R$ ${o.meta} | Aporte Sugerido: R$ ${o.aporteSugerido}/mês`).join('\n')}

Por favor, forneça:
1. Avaliação geral dos pontos fortes e vulnerabilidades do orçamento.
2. Como equilibrar a alocação entre Reserva de Emergência e Objetivos de Vida.
3. Estratégia de otimização de categorias com gastos atípicos.
4. Sugestão de alocação de investimentos de acordo com o prazo de cada meta.`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generateAIPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot color="var(--accent-purple)" size={24} />
            Assistente de Diagnóstico por IA
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Insights automáticos e gerador de prompt de consultoria financeira para ChatGPT / Gemini.
          </p>
        </div>

        <button
          onClick={handleCopyPrompt}
          className="btn btn-primary"
          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Prompt Copiado!' : 'Copiar Prompt para IA'}
        </button>
      </div>

      {/* Dynamic Insights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {insights.map((item, idx) => {
          const IconComp = item.icon;
          const isWarning = item.type === 'warning';
          return (
            <div
              key={idx}
              style={{
                background: isWarning ? 'var(--status-amarelo-bg)' : 'var(--status-verde-bg)',
                border: `1px solid ${isWarning ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: isWarning ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)' }}>
                <IconComp size={18} color={isWarning ? 'var(--accent-amber)' : 'var(--accent-green)'} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        💡 <strong>Como usar a IA:</strong> Clique no botão <em>"Copiar Prompt para IA"</em> acima e cole em assistentes como ChatGPT ou Gemini para receber uma consultoria financeira totalmente personalizada com base nos números atuais da sua família.
      </div>
    </section>
  );
}
