import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SUPPORTED_BANKS } from '../services/openFinanceService';
import { ShieldCheck, Plus, RefreshCw, Lock, Sparkles, Building2 } from 'lucide-react';
import OpenFinanceModal from './OpenFinanceModal';

export default function OpenFinanceSection() {
  const [isOpenFinanceModalOpen, setIsOpenFinanceModalOpen] = useState(false);

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
              Open Finance Brasil (Sincronização de Extratos)
            </h3>
            <span className="status-badge verde">
              <Sparkles size={10} /> Banco Central
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Conecte Banco do Brasil, Nubank, Banco Inter, Itaú e Bradesco para preencher seus gastos automaticamente.
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsOpenFinanceModalOpen(true)}
        className="btn btn-primary"
        style={{ padding: '10px 18px', fontSize: '0.88rem' }}
      >
        <Building2 size={16} /> Conectar Banco (Open Finance)
      </button>

      <OpenFinanceModal
        isOpen={isOpenFinanceModalOpen}
        onClose={() => setIsOpenFinanceModalOpen(false)}
      />
    </div>
  );
}
