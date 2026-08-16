import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FINANCIAL_DATA } from '../data/initialData';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('plano_financeiro_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved financial data:', e);
      }
    }
    return INITIAL_FINANCIAL_DATA;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('plano_financeiro_theme');
    return savedMode ? savedMode === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('plano_financeiro_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('plano_financeiro_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const resetToDefault = () => {
    setData(INITIAL_FINANCIAL_DATA);
    localStorage.removeItem('plano_financeiro_data');
  };

  // Helper calculation functions
  const getRendaLiquida = () => data.perfil.rendaLiquidaMensal || 1;

  const getCategoriaTotal = (categoriaId) => {
    const cat = data.despesas.find(c => c.id === categoriaId);
    if (!cat) return 0;
    return cat.itens.reduce((acc, item) => acc + (Number(item.valor) || 0), 0);
  };

  const getCategoriaPct = (categoriaId) => {
    const total = getCategoriaTotal(categoriaId);
    const renda = getRendaLiquida();
    return (total / renda) * 100;
  };

  const getCategoriaStatus = (categoria) => {
    const pct = getCategoriaPct(categoria.id);
    if (categoria.idealPctMax && !categoria.idealPctMin) {
      if (pct <= categoria.idealPctMax) return { label: 'Saudável', level: 'verde' };
      if (pct <= categoria.idealPctMax * 1.25) return { label: 'Atenção', level: 'amarelo' };
      return { label: 'Alerta', level: 'vermelho' };
    }
    if (categoria.idealPctMin && categoria.idealPctMax) {
      if (pct >= categoria.idealPctMin && pct <= categoria.idealPctMax) {
        return { label: 'Saudável', level: 'verde' };
      }
      if (pct < categoria.idealPctMin) {
        // e.g. Proteção 0.8% vs 5-10% ideal is very low -> alerta
        if (pct < categoria.idealPctMin * 0.5) return { label: 'Alerta (muito abaixo)', level: 'vermelho' };
        return { label: 'Atenção (abaixo)', level: 'amarelo' };
      }
      if (pct > categoria.idealPctMax) {
        if (pct > categoria.idealPctMax * 1.25) return { label: 'Alerta (muito acima)', level: 'vermelho' };
        return { label: 'Atenção (acima)', level: 'amarelo' };
      }
    }
    return { label: 'Saudável', level: 'verde' };
  };

  const getTotalGastos = () => {
    return data.despesas.reduce((acc, cat) => acc + getCategoriaTotal(cat.id), 0);
  };

  const getPoupancaMensal = () => {
    return getRendaLiquida() - getTotalGastos();
  };

  const getTaxaPoupanca = () => {
    return (getPoupancaMensal() / getRendaLiquida()) * 100;
  };

  // Updaters
  const updatePerfil = (novosCampos) => {
    setData(prev => ({
      ...prev,
      perfil: { ...prev.perfil, ...novosCampos }
    }));
  };

  const updateRegraOuro = (id, checked) => {
    setData(prev => ({
      ...prev,
      regrasOuro: prev.regrasOuro.map(r => r.id === id ? { ...r, checked } : r)
    }));
  };

  const updateItemDespesa = (categoriaId, itemId, valor) => {
    setData(prev => ({
      ...prev,
      despesas: prev.despesas.map(cat => {
        if (cat.id !== categoriaId) return cat;
        return {
          ...cat,
          itens: cat.itens.map(item => item.id === itemId ? { ...item, valor: Number(valor) || 0 } : item)
        };
      })
    }));
  };

  const addItemDespesa = (categoriaId, nome, valor) => {
    const newItem = {
      id: 'item_' + Date.now(),
      nome,
      valor: Number(valor) || 0
    };
    setData(prev => ({
      ...prev,
      despesas: prev.despesas.map(cat => cat.id === categoriaId ? { ...cat, itens: [...cat.itens, newItem] } : cat)
    }));
  };

  const deleteItemDespesa = (categoriaId, itemId) => {
    setData(prev => ({
      ...prev,
      despesas: prev.despesas.map(cat => cat.id === categoriaId ? { ...cat, itens: cat.itens.filter(i => i.id !== itemId) } : cat)
    }));
  };

  const updateReservaEmergencia = (novosCampos) => {
    setData(prev => ({
      ...prev,
      reservaEmergencia: { ...prev.reservaEmergencia, ...novosCampos }
    }));
  };

  const updateObjetivo = (id, novosCampos) => {
    setData(prev => ({
      ...prev,
      objetivos: prev.objetivos.map(o => o.id === id ? { ...o, ...novosCampos } : o)
    }));
  };

  const addObjetivo = (novoObj) => {
    const item = { id: 'obj_' + Date.now(), acumulado: 0, ...novoObj };
    setData(prev => ({ ...prev, objetivos: [...prev.objetivos, item] }));
  };

  const deleteObjetivo = (id) => {
    setData(prev => ({ ...prev, objetivos: prev.objetivos.filter(o => o.id !== id) }));
  };

  const updatePatrimonioSituacao = (id, novaSituacao) => {
    setData(prev => ({
      ...prev,
      patrimonioFuturo: prev.patrimonioFuturo.map(p => p.id === id ? { ...p, situacao: novaSituacao } : p)
    }));
  };

  const updateRadarPoint = (index, value) => {
    setData(prev => ({
      ...prev,
      radarHealth: prev.radarHealth.map((r, i) => i === index ? { ...r, situacao: Number(value) } : r)
    }));
  };

  return (
    <FinanceContext.Provider value={{
      data,
      darkMode,
      toggleDarkMode,
      resetToDefault,
      getRendaLiquida,
      getCategoriaTotal,
      getCategoriaPct,
      getCategoriaStatus,
      getTotalGastos,
      getPoupancaMensal,
      getTaxaPoupanca,
      updatePerfil,
      updateRegraOuro,
      updateItemDespesa,
      addItemDespesa,
      deleteItemDespesa,
      updateReservaEmergencia,
      updateObjetivo,
      addObjetivo,
      deleteObjetivo,
      updatePatrimonioSituacao,
      updateRadarPoint
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
