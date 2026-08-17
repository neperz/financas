import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FINANCIAL_DATA } from '../data/initialData';
import { fetchMarketIndicators } from '../services/marketApi';

const FinanceContext = createContext();

export function ensureUniqueItemIds(dataObj) {
  if (!dataObj || !Array.isArray(dataObj.despesas)) return dataObj;

  const seenIds = new Set();
  const updatedDespesas = dataObj.despesas.map(cat => ({
    ...cat,
    itens: (cat.itens || []).map((item, idx) => {
      let itemId = item.id;
      if (!itemId || seenIds.has(itemId)) {
        itemId = `item_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 9)}`;
      }
      seenIds.add(itemId);
      return { ...item, id: itemId };
    })
  }));

  return {
    ...dataObj,
    despesas: updatedDespesas
  };
}

export function FinanceProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('plano_financeiro_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return ensureUniqueItemIds(parsed);
      } catch (e) {
        console.error('Failed to parse saved financial data:', e);
      }
    }
    return ensureUniqueItemIds(INITIAL_FINANCIAL_DATA);
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
    const deepClone = JSON.parse(JSON.stringify(INITIAL_FINANCIAL_DATA));
    setData(deepClone);
    localStorage.removeItem('plano_financeiro_data');
  };

  const clearAllData = () => {
    localStorage.clear();
    sessionStorage.clear();
    const deepClone = JSON.parse(JSON.stringify(INITIAL_FINANCIAL_DATA));
    deepClone.despesas = deepClone.despesas.map(cat => ({
      ...cat,
      itens: []
    }));
    deepClone.reservaEmergencia.reservaAtual = 0;
    deepClone.objetivos = [];
    setData(deepClone);
  };

  const clearAllDespesas = () => {
    setData(prev => ({
      ...prev,
      despesas: prev.despesas.map(cat => ({
        ...cat,
        itens: []
      }))
    }));
  };

  // Export / Import Full Backup JSON (100% of data, investments & checkpoints)
  const exportDataJSON = () => {
    const backupPayload = {
      app: 'Plano Financeiro Familiar',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      data: data,
      checkpoints: checkpoints
    };

    const jsonStr = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano_financeiro_completo_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (fileContent) => {
    const handleParseAndApply = (rawContent) => {
      try {
        const parsed = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

        // Support both full wrapper format { data, checkpoints } and direct data object
        const mainData = parsed.data || parsed;
        const mainCheckpoints = parsed.checkpoints || [];

        if (mainData && mainData.perfil && Array.isArray(mainData.despesas)) {
          const sanitizedData = ensureUniqueItemIds(mainData);
          setData(sanitizedData);

          if (Array.isArray(mainCheckpoints) && mainCheckpoints.length > 0) {
            setCheckpoints(mainCheckpoints);
          }

          alert('Backup financeiro completo importado com sucesso!');
        } else {
          alert('Estrutura de arquivo JSON inválida.');
        }
      } catch (err) {
        console.error('Erro ao ler arquivo JSON de backup:', err);
        alert('Erro ao importar o arquivo JSON.');
      }
    };

    if (fileContent instanceof File || fileContent instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => handleParseAndApply(e.target.result);
      reader.readAsText(fileContent);
    } else {
      handleParseAndApply(fileContent);
    }
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

  // Checkpoints State & Persistence
  const [checkpoints, setCheckpoints] = useState(() => {
    const saved = localStorage.getItem('plano_financeiro_checkpoints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse checkpoints:', e);
      }
    }
    return [
      {
        id: 'chk_initial',
        label: 'Junho 2026 (Inicial)',
        monthName: 'Junho 2026',
        createdAt: new Date().toISOString(),
        rendaLiquida: 30000,
        totalGastos: 15450,
        poupancaMensal: 14550,
        taxaPoupanca: 48.5,
        overallHealthScore: 82,
        snapshotData: JSON.parse(JSON.stringify(INITIAL_FINANCIAL_DATA))
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('plano_financeiro_checkpoints', JSON.stringify(checkpoints));
  }, [checkpoints]);

  const saveCurrentCheckpoint = (customLabel) => {
    const label = customLabel || `Checkpoint ${data.perfil.dataBase || new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`;
    const newCheckpoint = {
      id: 'chk_' + Date.now(),
      label: label,
      monthName: label,
      createdAt: new Date().toISOString(),
      rendaLiquida: getRendaLiquida(),
      totalGastos: getTotalGastos(),
      poupancaMensal: getPoupancaMensal(),
      taxaPoupanca: getTaxaPoupanca(),
      overallHealthScore: getOverallHealthScore(),
      snapshotData: JSON.parse(JSON.stringify(data))
    };

    setCheckpoints(prev => [...prev, newCheckpoint]);
  };

  const deleteCheckpoint = (id) => {
    setCheckpoints(prev => prev.filter(c => c.id !== id));
  };

  const loadCheckpoint = (id) => {
    const target = checkpoints.find(c => c.id === id);
    if (target && target.snapshotData) {
      const restored = JSON.parse(JSON.stringify(target.snapshotData));
      setData(ensureUniqueItemIds(restored));
    }
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
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
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

  const moveItemDespesa = (sourceCatId, targetCatId, itemId) => {
    if (!sourceCatId || !targetCatId || !itemId || sourceCatId === targetCatId) return;

    setData(prev => {
      const sourceCategory = prev.despesas.find(c => c.id === sourceCatId);
      const targetCategory = prev.despesas.find(c => c.id === targetCatId);

      if (!sourceCategory || !targetCategory) return prev;

      const itemToMove = sourceCategory.itens.find(i => String(i.id) === String(itemId));
      if (!itemToMove) return prev;

      const alreadyInTarget = targetCategory.itens.some(i => String(i.id) === String(itemId));

      return {
        ...prev,
        despesas: prev.despesas.map(cat => {
          if (cat.id === sourceCatId) {
            return {
              ...cat,
              itens: cat.itens.filter(i => String(i.id) !== String(itemId))
            };
          }
          if (cat.id === targetCatId) {
            return {
              ...cat,
              itens: alreadyInTarget ? cat.itens : [...cat.itens, itemToMove]
            };
          }
          return cat;
        })
      };
    });
  };

  const applyTransactionsToBudget = (transactionsList) => {
    if (!transactionsList || transactionsList.length === 0) return;

    const categoryTotalsMap = new Map();
    transactionsList.forEach(tx => {
      const key = `${tx.category}_${tx.description.toLowerCase().trim()}`;
      if (categoryTotalsMap.has(key)) {
        const current = categoryTotalsMap.get(key);
        current.amount += tx.amount;
      } else {
        categoryTotalsMap.set(key, {
          categoryId: tx.category,
          description: tx.description.trim(),
          amount: tx.amount
        });
      }
    });

    setData(prev => {
      const seenIds = new Set();
      prev.despesas.forEach(c => (c.itens || []).forEach(i => seenIds.add(String(i.id))));

      const updatedDespesas = prev.despesas.map(cat => {
        const catCopy = { ...cat, itens: [...(cat.itens || [])] };

        categoryTotalsMap.forEach((entry) => {
          if (entry.categoryId === cat.id) {
            const existingIndex = catCopy.itens.findIndex(i =>
              i.nome.toLowerCase().trim() === entry.description.toLowerCase().trim()
            );

            if (existingIndex >= 0) {
              catCopy.itens[existingIndex] = {
                ...catCopy.itens[existingIndex],
                valor: entry.amount
              };
            } else {
              let newId = `item_pluggy_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
              while (seenIds.has(newId)) {
                newId = `item_pluggy_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
              }
              seenIds.add(newId);

              catCopy.itens.push({
                id: newId,
                nome: entry.description,
                valor: entry.amount
              });
            }
          }
        });

        return catCopy;
      });

      return ensureUniqueItemIds({
        ...prev,
        despesas: updatedDespesas
      });
    });
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

  const addInvestimentoAsset = (asset) => {
    const newAsset = {
      id: 'inv_' + Date.now(),
      ...asset
    };
    setData(prev => ({
      ...prev,
      investimentos: [...(prev.investimentos || []), newAsset]
    }));
  };

  const deleteInvestimentoAsset = (id) => {
    setData(prev => ({
      ...prev,
      investimentos: (prev.investimentos || []).filter(i => i.id !== id)
    }));
  };

  const syncPluggyInvestments = (pluggyAssets) => {
    if (!pluggyAssets || pluggyAssets.length === 0) return;
    setData(prev => ({
      ...prev,
      investimentos: pluggyAssets
    }));
  };

  return (
    <FinanceContext.Provider value={{
      data,
      addInvestimentoAsset,
      deleteInvestimentoAsset,
      syncPluggyInvestments,
      checkpoints,
      saveCurrentCheckpoint,
      deleteCheckpoint,
      loadCheckpoint,
      marketData,
      darkMode,
      activeTab,
      setActiveTab,
      toggleDarkMode,
      resetToDefault,
      clearAllData,
      clearAllDespesas,
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
      moveItemDespesa,
      applyTransactionsToBudget,
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
