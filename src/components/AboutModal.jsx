import React from 'react';
import { Info, Mail, Sparkles, X, Layers, Code, ArrowRight } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '600px',
        width: '100%',
        padding: '28px',
        background: 'var(--bg-secondary)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
              <Info size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                Sobre o Projeto
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Origem & Desenvolvimento por WikiCode Informática
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Story Text */}
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '16px 0 24px 0' }}>
          <p style={{ marginBottom: '12px' }}>
            A ideia deste sistema nasceu a partir de um infográfico publicado pela revista <strong>Você S/A</strong>, focado no planejamento e organização das finanças familiares.
          </p>
          <p style={{ marginBottom: '12px' }}>
            Decidimos pegar o conceito estático do papel e transformá-lo em uma **aplicação web rica, interativa e reativa em tempo real**, integrando inteligência de dados, cotações ao vivo do Banco Central, simuladores e diagnósticos automatizados.
          </p>
        </div>

        {/* CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-blue)' }}>
            <Sparkles size={18} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Quer transformar seu infográfico em um sistema útil?
            </h4>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
            Se você possui um design, infográfico ou conceito visual e deseja transformá-lo em um sistema funcional, rápido e de alta performance como este, entre em contato diretamente comigo!
          </p>

          <a
            href="mailto:felipe@wikicode.com.br?subject=Transformar%20Infogr%C3%A1fico%20em%20Sistema%20%2D%20Contato"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <Mail size={16} />
            felipe@wikicode.com.br
            <ArrowRight size={14} />
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-outline">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
