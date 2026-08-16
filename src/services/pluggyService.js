// Pluggy Open Finance & meu.pluggy.ai Personal API Integration Service

import { categorizeTransaction, normalizeTransactionDescription } from './openFinanceService';

const PLUGGY_API_URL = 'https://api.pluggy.ai';

// Route through Cloudflare Function proxy or CORS proxy to bypass browser CORS limits
const getMyPluggyApiBase = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'https://corsproxy.io/?https://my-api.pluggy.ai';
  }
  return '/api/pluggy';
};

// Convert Pluggy / meu.pluggy.ai Transaction Category to App's 8 Core Categories
export function mapPluggyToAppCategory(pluggyTx) {
  const desc = pluggyTx.description || pluggyTx.descriptionRaw || pluggyTx.merchant?.name || '';
  const amount = Math.abs(pluggyTx.amount || 0);

  const smartCat = categorizeTransaction(desc, amount);
  if (smartCat && smartCat !== 'outros') {
    return smartCat;
  }

  const pluggyCat = (pluggyTx.category || '').toLowerCase();

  if (pluggyCat.includes('housing') || pluggyCat.includes('utilities') || pluggyCat.includes('rent')) {
    return 'moradia';
  }
  if (pluggyCat.includes('food') || pluggyCat.includes('groceries') || pluggyCat.includes('restaurants')) {
    return 'alimentacao';
  }
  if (pluggyCat.includes('transport') || pluggyCat.includes('gas') || pluggyCat.includes('parking')) {
    return 'transporte';
  }
  if (pluggyCat.includes('health') || pluggyCat.includes('pharmacy') || pluggyCat.includes('fitness')) {
    return 'saude';
  }
  if (pluggyCat.includes('education') || pluggyCat.includes('tuition') || pluggyCat.includes('books')) {
    return 'educacao';
  }
  if (pluggyCat.includes('insurance') || pluggyCat.includes('protection')) {
    return 'protecao';
  }
  if (pluggyCat.includes('entertainment') || pluggyCat.includes('travel') || pluggyCat.includes('subscriptions')) {
    return 'lazer';
  }

  return 'outros';
}

// Fetch Real User Bank Items from meu.pluggy.ai via CORS Proxy
export async function fetchMeuPluggyUserItems(bearerToken) {
  const cleanToken = bearerToken.replace(/^Bearer\s+/i, '').trim();
  const apiBase = getMyPluggyApiBase();

  const res = await fetch(`${apiBase}/items`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${cleanToken}`
    }
  });

  if (!res.ok) {
    throw new Error(`Erro ao conectar com meu.pluggy.ai (${res.status})`);
  }

  return await res.json();
}

// Fetch Accounts for a specific Item ID
export async function fetchMeuPluggyItemAccounts(itemId, bearerToken) {
  const cleanToken = bearerToken.replace(/^Bearer\s+/i, '').trim();
  const apiBase = getMyPluggyApiBase();

  const res = await fetch(`${apiBase}/accounts?itemId=${itemId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${cleanToken}`
    }
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar contas (${res.status})`);
  }

  return await res.json();
}

// Fetch Investment Assets for user's connected items (Ações, ETFs, Fundos, Renda Fixa)
export async function fetchMeuPluggyInvestments(bearerToken) {
  const cleanToken = bearerToken.replace(/^Bearer\s+/i, '').trim();
  const apiBase = getMyPluggyApiBase();
  const items = await fetchMeuPluggyUserItems(bearerToken);

  let allInvestments = [];

  for (const item of items) {
    try {
      const res = await fetch(`${apiBase}/investments?itemId=${item.id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });
      if (res.ok) {
        const rawData = await res.json();
        const list = Array.isArray(rawData) ? rawData : (rawData.results || []);
        allInvestments = [...allInvestments, ...list];
      }
    } catch (e) {
      console.warn(`Erro ao buscar investimentos do item ${item.id}:`, e);
    }
  }

  return allInvestments.map(inv => ({
    id: inv.id || 'inv_' + Math.random().toString(36).substring(2, 9),
    code: inv.code || inv.name || 'Ativo Financeiro',
    name: inv.name || inv.code || 'Ativo de Investimento',
    type: inv.type || inv.subtype || 'INVESTMENT',
    subtype: inv.subtype || '',
    balance: Number(inv.balance || inv.amount || inv.value) || 0,
    quantity: inv.quantity || 1,
    annualRate: inv.lastTwelveMonthsRate || inv.annualRate || null,
    source: 'meu.pluggy.ai (Open Finance)'
  }));
}

// Fetch Transactions for a specific Account ID with Month & Date Filter support
export async function fetchMeuPluggyAccountTransactions(accountId, bearerToken, options = {}) {
  const cleanToken = bearerToken.replace(/^Bearer\s+/i, '').trim();
  const apiBase = getMyPluggyApiBase();
  const { fromDate, toDate, selectedMonth } = options;

  let queryParams = `accountId=${accountId}`;
  if (fromDate) queryParams += `&from=${fromDate}`;
  if (toDate) queryParams += `&to=${toDate}`;

  const res = await fetch(`${apiBase}/transactions?${queryParams}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${cleanToken}`
    }
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar transações (${res.status})`);
  }

  const rawData = await res.json();
  const list = Array.isArray(rawData) ? rawData : (rawData.results || []);

  const processed = [];

  for (const tx of list) {
    const isCredit = tx.type === 'CREDIT' || (tx.amount > 0 && tx.type !== 'DEBIT');
    const descUpper = (tx.description || tx.descriptionRaw || '').toUpperCase();
    const txDate = (tx.date || '').slice(0, 10);

    // Filter by selected month YYYY-MM if specified
    if (selectedMonth && selectedMonth !== 'all') {
      if (!txDate.startsWith(selectedMonth)) {
        continue;
      }
    }

    // 1. Ignore Income/Credit transfers (Transferência Recebida, Resgate de Investimentos, Pix Recebido)
    if (isCredit) {
      continue;
    }

    // 2. Ignore Credit Card Bill Payment transfers to avoid double counting with individual card purchases
    if (descUpper.includes('PAGAMENTO DE FATURA') || descUpper.includes('PAGAMENTO FATURA')) {
      continue;
    }

    const amount = Math.abs(tx.amount || 0);
    const rawDesc = tx.description || tx.descriptionRaw || 'Despesa bancária';
    const cleanDesc = normalizeTransactionDescription(rawDesc);

    if (amount > 0) {
      processed.push({
        id: tx.id || 'tx_mp_' + Math.random().toString(36).substring(2, 9),
        date: txDate || new Date().toISOString().slice(0, 10),
        description: cleanDesc,
        amount: amount,
        category: mapPluggyToAppCategory({ ...tx, description: cleanDesc }),
        type: 'DEBIT',
        source: 'meu.pluggy.ai'
      });
    }
  }

  return processed;
}

// Full Automatic Import Sequence for meu.pluggy.ai with Month Filter and Deduplication
export async function fetchAllMeuPluggyTransactions(bearerToken, options = {}) {
  const items = await fetchMeuPluggyUserItems(bearerToken);

  if (!items || items.length === 0) {
    throw new Error('Nenhuma conta bancária conectada foi encontrada no seu perfil do meu.pluggy.ai.');
  }

  const transactionMap = new Map();

  for (const item of items) {
    try {
      const accounts = await fetchMeuPluggyItemAccounts(item.id, bearerToken);
      for (const account of accounts) {
        try {
          const txs = await fetchMeuPluggyAccountTransactions(account.id, bearerToken, options);
          txs.forEach(tx => {
            if (!transactionMap.has(tx.id)) {
              transactionMap.set(tx.id, tx);
            }
          });
        } catch (e) {
          console.warn(`Erro ao carregar transações da conta ${account.id}:`, e);
        }
      }
    } catch (e) {
      console.warn(`Erro ao carregar contas do item ${item.id}:`, e);
    }
  }

  return Array.from(transactionMap.values());
}

// Fetch transactions from Developer Pluggy API (dashboard.pluggy.ai)
export async function fetchPluggyItemTransactions(itemId, apiKey) {
  if (!apiKey) {
    throw new Error('API Key ou Connect Token da Pluggy não configurado.');
  }

  const res = await fetch(`${PLUGGY_API_URL}/transactions?itemId=${itemId}`, {
    headers: {
      'Accept': 'application/json',
      'X-API-KEY': apiKey
    }
  });

  if (!res.ok) {
    throw new Error(`Erro Pluggy API (${res.status})`);
  }

  const data = await res.json();
  const results = data.results || [];

  return results
    .filter(tx => tx.type === 'DEBIT' || tx.amount < 0)
    .map(tx => ({
      id: tx.id,
      date: (tx.date || new Date().toISOString()).slice(0, 10),
      description: tx.description,
      amount: Math.abs(tx.amount),
      category: mapPluggyToAppCategory(tx),
      type: 'DEBIT',
      source: 'Pluggy Developer'
    }));
}
