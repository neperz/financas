import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FINANCIAL_DATA } from '../data/initialData';
import { fetchMarketIndicators } from '../services/marketApi';

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

  const [marketData, setMarketData] = useState({
    selic: 10.50,
    ipca: 4.20,
    usd: 5.45,
    eur: 5.95,
    updatedAt: '',
    isLive: false
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('plano_financeiro_theme');
    return savedMode ? savedMode === 'dark' : true;
  });

  const [activeTab, setActiveTab] = useState('overview');

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

  // Load real-time market indicators on mount
  useEffect(() => {
    fetchMarketIndicators().then(indicators => {
      setMarketData(indicators);
    });
  }, []);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const resetToDefault = () => {
    setData(INITIAL_FINANCIAL_DATA);
    localStorage.removeItem('plano_financeiro_data');
  };

  // Export / Import Backup JSON
  const exportDataJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano_financeiro_familiar_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.perfil && parsed.despesas) {
          setData(parsed);
          alert('Backup importado com sucesso!');
        } else {
          alert('Formato de arquivo JSON inválido.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Helper calculation functions
  const getRendaLiquida = () => Number(data.perfil.rendaLiquidaMensal) || 1;

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

  // Connected Reserva calculations
  const getReservaMeta = () => {
    return getTotalGastos() * (data.reservaEmergencia.mesesRecomendados || 10);
  };

  const getReservaPctConcluido = () => {
    const meta = getReservaMeta();
    return Math.min(100, ((data.reservaEmergencia.reservaAtual || 0) / (meta || 1)) * 100);
  };

  const getMesesReservaAtual = () => {
    const gastos = getTotalGastos();
    return gastos > 0 ? (data.reservaEmergencia.reservaAtual / gastos) : 0;
  };

  // Calculate Emergency Fund Monthly Yield (based on SELIC rate)
  const getReservaRendimentoMensal = () => {
    const selicAnual = marketData.selic / 100;
    const taxaMensal = Math.pow(1 + selicAnual, 1/12) - 1;
    return data.reservaEmergencia.reservaAtual * taxaMensal;
  };

  // Connected Goals calculations
  const getTotalAportesObjetivos = () => {
    return data.objetivos.reduce((acc, item) => acc + (Number(item.aporteSugerido) || 0), 0);
  };

  // Dynamic Radar Score Calculation
  const getCalculatedRadarScores = () => {
    const poupancaPct = getTaxaPoupanca();
    const reservaPct = getReservaPctConcluido();
    const protecaoPct = getCategoriaPct('protecao');
    const totalAportes = getTotalAportesObjetivos();
    const poupancaMensal = getPoupancaMensal();

    const scorePoupanca = Math.min(100, Math.max(0, Math.round((poupancaPct / 25) * 85)));
    const scoreReserva = Math.min(100, Math.max(0, Math.round(reservaPct)));
    const scoreDividas = 85;
    const scoreInvestimentos = data.patrimonioFuturo.filter(p => p.situacao === 'Ok' || p.situacao === 'Iniciar').length * 25;
    const scoreProtecao = Math.min(100, Math.max(0, Math.round((protecaoPct / 5) * 80)));
    const scorePlanejamento = totalAportes <= poupancaMensal && poupancaMensal > 0 ? 80 : 50;

    return [
      { subject: "Poupança", ideal: 90, situacao: data.radarHealth[0]?.situacao ?? scorePoupanca, autoScore: scorePoupanca },
      { subject: "Reserva", ideal: 95, situacao: data.radarHealth[1]?.situacao ?? scoreReserva, autoScore: scoreReserva },
      { subject: "Dívidas", ideal: 90, situacao: data.radarHealth[2]?.situacao ?? scoreDividas, autoScore: scoreDividas },
      { subject: "Investimentos", ideal: 85, situacao: data.radarHealth[3]?.situacao ?? scoreInvestimentos, autoScore: scoreInvestimentos },
      { subject: "Proteção", ideal: 80, situacao: data.radarHealth[4]?.situacao ?? scoreProtecao, autoScore: scoreProtecao },
      { subject: "Planejamento", ideal: 90, situacao: data.radarHealth[5]?.situacao ?? scorePlanejamento, autoScore: scorePlanejamento }
    ];
  };

  const getOverallHealthScore = () => {
    const scores = getCalculatedRadarScores();
    const sum = scores.reduce((acc, s) => acc + s.situacao, 0);
    return Math.round(sum / scores.length);
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
      marketData,
      darkMode,
      activeTab,
      setActiveTab,
      toggleDarkMode,
      resetToDefault,
      exportDataJSON,
      importDataJSON,
      getRendaLiquida,
      getCategoriaTotal,
      getCategoriaPct,
      getCategoriaStatus,
      getTotalGastos,
      getPoupancaMensal,
      getTaxaPoupanca,
      getReservaMeta,
      getReservaPctConcluido,
      getMesesReservaAtual,
      getReservaRendimentoMensal,
      getTotalAportesObjetivos,
      getCalculatedRadarScores,
      getOverallHealthScore,
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
