import React from 'react';
import { Info, Mail, Sparkles, ArrowRight, Layers } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="glass-card" style={{ padding: '28px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
      {/* Background Accent Glow */}
      <div style={{
        position: 'absolute',
        bottom: '-40px',
        right: '-40px',
        width: '240px',
        height: '240px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'center' }}>
        {/* Left Side: Story */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
              <Info size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                Sobre o Projeto & Origem da Ideia
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Da publicação ao sistema interativo em tempo real
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            A ideia deste sistema foi originada a partir de um infográfico publicado pela revista <strong>Você S/A</strong>.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            O objetivo foi transformar aquele sonho desenhado no papel em um **sistema útil, moderno e funcional**, capaz de calcular a saúde financeira da família, projetar juros compostos e integrar dados ao vivo.
          </p>
        </div>

        {/* Right Side: CTA Box */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          borderLeft: '4px solid var(--accent-blue)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-blue)' }}>
            <Sparkles size={18} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Transforme seu Infográfico em um Sistema Útil
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
            Se você quer transformar o sonho ou conceito desenhado no seu infográfico em um sistema web completo e intuitivo, entre em contato!
          </p>

          <a
            href="mailto:felipe@wikicode.com.br?subject=Transformar%20Infogr%C3%A1fico%20em%20Sistema"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', width: '100%', justifyContent: 'center' }}
          >
            <Mail size={16} />
            felipe@wikicode.com.br
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
