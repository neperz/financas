import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Zap,
  TrendingUp,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Building2,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  Calculator
} from 'lucide-react';

export default function WealthExponentiationSection() {
  const { getPoupancaMensal, getTotalGastos, marketData } = useFinance();
  const poupancaAtual = getPoupancaMensal();
  const gastosTotais = getTotalGastos();

  const [rendaExtraEst, setRendaExtraEst] = useState(1500);
  const [taxaRetorno, setTaxaRetorno] = useState(marketData.selic || 10.5);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Calculations for extra income impact
  const poupancaComExtra = poupancaAtual + rendaExtraEst;
  const taxaMensal = Math.pow(1 + taxaRetorno / 100, 1 / 12) - 1;

  // Calculate months to reach 1 million without and with extra income
  const calcMesesParaMeta = (aporte) => {
    let acumulado = 0;
    let meses = 0;
    const target = 1000000;
    while (acumulado < target && meses < 600) {
      acumulado = (acumulado + aporte) * (1 + taxaMensal);
      meses++;
    }
    return meses;
  };

  const mesesSemExtra = calcMesesParaMeta(poupancaAtual);
  const mesesComExtra = calcMesesParaMeta(poupancaComExtra);
  const mesesEconomizados = Math.max(0, mesesSemExtra - mesesComExtra);
  const anosEconomizados = (mesesEconomizados / 12).toFixed(1);

  const estrategiasExponenciacao = [
    {
      icon: Zap,
      color: '#10b981',
      title: 'Reinvestimento Automático de Dividendos (Efeito Bola de Neve)',
      desc: 'Reinvestir 100% dos dividendos e rendimentos (FIIs, Ações e Tesouro) sem retirar nenhum valor. No efeito juros compostos, em 5 a 7 anos os rendimentos do patrimônio superam o valor dos próprios aportes do seu bolso.'
    },
    {
      icon: ShieldCheck,
      color: '#3b82f6',
      title: 'Otimização Fiscal via PGBL (Eficiência Tributária)',
      desc: 'Pessoas com declaração completa do IR podem deduzir até 12% da renda bruta em PGBL. Ao reinvestir a restituição do imposto de renda ano a ano, o efeito juros compostos atua também sobre o imposto diferido.'
    },
    {
      icon: Building2,
      color: '#8b5cf6',
      title: 'Alocação em Ativos Geradores de Caixa Recorrente',
      desc: 'Priorizar ativos que pagam proventos mensais ou trimestrais (FIIs, títulos de renda fixa com cupom ou empresas consolidadas pagadoras de dividendos) criando uma fonte de caixa independente do trabalho.'
    }
  ];

  const fontesRendaExtra = [
    {
      icon: Briefcase,
      categoria: 'Serviços Especializados B2B / Mentoria',
      explicacao: 'Monetizar sua expertise profissional oferecendo consultorias, aulas particulares ou projetos freelances em horários flexíveis.',
      seguranca: 'Alta (risco zero de capital, utiliza apenas seu conhecimento prévio).'
    },
    {
      icon: Building2,
      categoria: 'Fundos de Investimento Imobiliário (FIIs)',
      explicacao: 'Adquirir cotas de grandes imóveis comerciais (galpões logísticos, prédios corporativos) para receber aluguéis mensais isentos de IR.',
      seguranca: 'Alta liquidez e diversificação em ativos reais.'
    },
    {
      icon: BookOpen,
      categoria: 'Ativos Digitais & Conteúdo Assíncrono',
      explicacao: 'Criar infoprodutos, e-books ou templates especializados na sua área de atuação que continuam gerando vendas recorrentes no piloto automático.',
      seguranca: 'Baixo custo inicial com alto potencial de escala.'
    },
    {
      icon: DollarSign,
      categoria: 'Economia Compartilhada & Ativos Ociosos',
      explicacao: 'Monetizar bens ou espaço não utilizados (aluguel de vaga de garagem, equipamentos profissionais ou veículos ociosos).',
      seguranca: 'Geração de caixa sobre itens que já pertencem à família.'
    }
  ];

  return (
    <section className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap color="var(--accent-amber)" size={24} />
              Acelerador de Patrimônio & Renda Extra Segura
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Estratégias para multiplicar seu capital, acelerar a independência financeira e gerar renda recorrente.
            </p>
          </div>

          <span className="status-badge verde">
            <Sparkles size={12} /> Multiplicador de Riqueza
          </span>
        </div>
      </div>

      {/* Interactive Extra Income Impact Calculator */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '28px'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Calculator size={18} color="var(--accent-green)" /> Simulador de Impacto da Renda Extra na Aposentadoria
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Estimativa de Renda Extra Mensal Familiar (R$)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontWeight: 'bold' }}>R$</span>
              <input
                type="number"
                value={rendaExtraEst}
                onChange={(e) => setRendaExtraEst(Number(e.target.value) || 0)}
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-green)' }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Poupança Atual ({formatCurrency(poupancaAtual)}) + Renda Extra ({formatCurrency(rendaExtraEst)}) = <strong>{formatCurrency(poupancaComExtra)}/mês</strong>
            </span>
          </div>

          {/* Results Badge */}
          <div style={{
            background: 'var(--status-verde-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Clock size={28} color="var(--accent-green)" />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-verde-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                Tempo Economizado para Atingir R$ 1 Milhão:
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                {anosEconomizados} anos a menos ({mesesEconomizados} meses)
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Sua Independência Financeira é antecipada drasticamente com aportes adicionais.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Exponentiation Strategies Grid */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp size={20} color="var(--accent-blue)" /> 3 Pilares para Exponenciar seu Patrimônio
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {estrategiasExponenciacao.map((est, idx) => {
          const IconComp = est.icon;
          return (
            <div
              key={idx}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                borderLeft: `4px solid ${est.color}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: `${est.color}20`, color: est.color }}>
                  <IconComp size={18} />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {est.title}
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {est.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Safe & Consistent Extra Income Sources */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldCheck size={20} color="var(--accent-green)" /> Fontes de Renda Extra Seguras e Consistentes
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {fontesRendaExtra.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-blue)' }}>
                  <IconComp size={18} />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.categoria}
                  </h4>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                  {item.explicacao}
                </p>
              </div>

              <div style={{ paddingTop: '10px', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                🛡️ Segurança: {item.seguranca}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
