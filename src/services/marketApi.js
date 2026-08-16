// Service for fetching real-time market indicators and exchange rates

export async function fetchMarketIndicators() {
  const defaults = {
    selic: 10.50, // % ao ano
    ipca: 4.20,   // % ao ano
    usd: 5.45,    // R$ / USD
    eur: 5.95,    // R$ / EUR
    updatedAt: new Date().toISOString(),
    isLive: false
  };

  try {
    // 1. Fetch Currencies from AwesomeAPI
    const currRes = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL');
    let usdVal = defaults.usd;
    let eurVal = defaults.eur;

    if (currRes.ok) {
      const currData = await currRes.json();
      if (currData.USDBRL) usdVal = parseFloat(currData.USDBRL.bid);
      if (currData.EURBRL) eurVal = parseFloat(currData.EURBRL.bid);
    }

    // 2. Fetch SELIC from Banco Central do Brasil (SGS)
    let selicVal = defaults.selic;
    try {
      const selicRes = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');
      if (selicRes.ok) {
        const selicData = await selicRes.json();
        if (selicData && selicData.length > 0) {
          selicVal = parseFloat(selicData[0].valor);
        }
      }
    } catch (e) {
      console.warn('Using default SELIC rate:', e);
    }

    // 3. Fetch IPCA inflation from Banco Central do Brasil (SGS)
    let ipcaVal = defaults.ipca;
    try {
      const ipcaRes = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json');
      if (ipcaRes.ok) {
        const ipcaData = await ipcaRes.json();
        if (ipcaData && ipcaData.length > 0) {
          // Multiply monthly by 12 for annual estimate if monthly
          const val = parseFloat(ipcaData[0].valor);
          ipcaVal = val > 1 ? val : (val * 12);
        }
      }
    } catch (e) {
      console.warn('Using default IPCA inflation rate:', e);
    }

    return {
      selic: selicVal,
      ipca: ipcaVal,
      usd: usdVal,
      eur: eurVal,
      updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isLive: true
    };
  } catch (error) {
    console.error('Failed to fetch market indicators:', error);
    return defaults;
  }
}
