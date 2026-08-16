import React from 'react';
import { Sparkles, Mail, ArrowRight, Lightbulb, Code2, Rocket, Cpu } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="glass-card" style={{ padding: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '-60px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
        {/* Left Side: Story & Innovation */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.25)', marginBottom: '14px' }}>
            <Lightbulb size={14} color="var(--accent-blue)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Origem & Filosofia do Projeto
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '12px', lineHeight: 1.3 }}>
            Transformando Conceitos Estáticos em Plataformas Vivas
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
            A concepção deste sistema foi inspirada em um modelo conceitual publicado pela revista <strong style={{ color: 'var(--text-primary)' }}>Você S/A</strong>.
          </p>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            O nosso desafio foi evoluir aquela representação visual para uma <strong style={{ color: 'var(--accent-blue)' }}>plataforma web útil, moderna e interativa</strong> — capaz de conectar dados econômicos do Banco Central ao vivo, simular projeções de juros compostos e calcular instantaneamente a saúde financeira da família.
          </p>

          {/* Feature Tag Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Cpu size={12} color="var(--accent-purple)" /> Dados em Tempo Real (BCB)
            </span>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Rocket size={12} color="var(--accent-green)" /> Simulador de Riqueza
            </span>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Code2 size={12} color="var(--accent-amber)" /> Diagnóstico por IA
            </span>
          </div>
        </div>

        {/* Right Side: Professional CTA Box */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-blue-gradient)', color: '#ffffff' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Dê Vida ao Seu Conceito Visual
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Engenharia de Software por WikiCode Informática
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
            Se você possui um infográfico, protótipo ou modelo gráfico e quer transformá-lo em uma solução web de alta performance e utilidade real:
          </p>

          <a
            href="mailto:felipe@wikicode.com.br?subject=Transformar%20Infogr%C3%A1fico%20em%20Sistema%20-%20Contato"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px 18px',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              justify: 'center',
              gap: '10px',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Mail size={18} />
            <span>felipe@wikicode.com.br</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
