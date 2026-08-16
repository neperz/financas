import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ShieldCheck, Building2, Plug, Sparkles } from 'lucide-react';
import OpenFinanceModal from './OpenFinanceModal';
import PluggyConnectModal from './PluggyConnectModal';

export default function OpenFinanceSection() {
  const [isOpenFinanceModalOpen, setIsOpenFinanceModalOpen] = useState(false);
  const [isPluggyModalOpen, setIsPluggyModalOpen] = useState(false);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
      border: '1px solid rgba(59, 130, 246, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      marginBottom: '24px',
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-blue-gradient)', color: '#ffffff' }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Open Finance Brasil & Conexão Pluggy
            </h3>
            <span className="status-badge verde">
              <Sparkles size={10} /> Banco Central
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Sincronize automaticamente Banco do Brasil, Nubank, Banco Inter, Itaú, Bradesco, C6, XP e mais de 100 bancos.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setIsOpenFinanceModalOpen(true)}
          className="btn btn-primary"
          style={{ padding: '10px 16px', fontSize: '0.85rem' }}
        >
          <Building2 size={16} /> Open Finance Brasil
        </button>

        <button
          onClick={() => setIsPluggyModalOpen(true)}
          className="btn btn-outline"
          style={{ padding: '10px 16px', fontSize: '0.85rem', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}
        >
          <Plug size={16} /> Conectar via Pluggy AI
        </button>
      </div>

      {/* Modals */}
      <OpenFinanceModal
        isOpen={isOpenFinanceModalOpen}
        onClose={() => setIsOpenFinanceModalOpen(false)}
      />

      <PluggyConnectModal
        isOpen={isPluggyModalOpen}
        onClose={() => setIsPluggyModalOpen(false)}
      />
    </div>
  );
}
