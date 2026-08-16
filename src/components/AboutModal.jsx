import React from 'react';
import { Info, Mail, Sparkles, X, ArrowRight, Lightbulb, Code2, Rocket } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.78)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '580px',
        width: '100%',
        padding: '28px',
        background: 'var(--bg-secondary)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
              <Info size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                Sobre o Projeto & Origem
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Desenvolvido por WikiCode Informática LTDA
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Story Content with clean HTML */}
        <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '22px' }}>
          <p style={{ marginBottom: '12px' }}>
            A ideia deste sistema foi inspirada em um modelo conceitual publicado pela revista <strong style={{ color: 'var(--text-primary)' }}>Você S/A</strong>.
          </p>
          <p style={{ marginBottom: '12px' }}>
            Transformamos aquele planejamento ilustrado em papel em uma <strong style={{ color: 'var(--accent-blue)' }}>aplicação web interativa, funcional e reativa em tempo real</strong> — capaz de conectar cotações ao vivo do Banco Central, calcular juros compostos e emitir diagnósticos de saúde financeira.
          </p>
        </div>

        {/* CTA Card */}
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '20px',
          borderLeft: '4px solid var(--accent-blue)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-blue)' }}>
            <Sparkles size={18} />
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Transforme seu Infográfico em um Sistema Útil
            </h4>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
            Se você possui um design, infográfico ou conceito visual e deseja transformá-lo em uma solução interativa completa, entre em contato:
          </p>

          <a
            href="mailto:felipe@wikicode.com.br?subject=Transformar%20Infogr%C3%A1fico%20em%20Sistema%20-%20Contato"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', width: '100%' }}
          >
            <Mail size={16} />
            <span>felipe@wikicode.com.br</span>
            <ArrowRight size={14} />
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px 16px' }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
