// Pluggy Open Finance & meu.pluggy.ai Personal API Integration Service

import { categorizeTransaction } from './openFinanceService';

const PLUGGY_API_URL = 'https://api.pluggy.ai';
const MY_PLUGGY_API_URL = 'https://my-api.pluggy.ai';

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

// Fetch Real User Bank Items from meu.pluggy.ai (my-api.pluggy.ai)
export async function fetchMeuPluggyUserItems(bearerToken) {
  const cleanToken = bearerToken.replace(/^Bearer\s+/i, '').trim();

  const res = await fetch(`${MY_PLUGGY_API_URL}/items`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${cleanToken}`,
      'Origin': 'https://meu.pluggy.ai'
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

  const res = await fetch(`${MY_PLUGGY_API_URL}/accounts?itemId=${itemId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${cleanToken}`,
      'Origin': 'https://meu.pluggy.ai'
    }
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar contas (${res.status})`);
  }

  return await res.json();
}

// Fetch Transactions for a specific Account ID
export async function fetchMeuPluggyAccountTransactions(accountId, bearerToken) {
  const cleanToken = bearerToken.replace(/^Bearer\s+/i, '').trim();

  const res = await fetch(`${MY_PLUGGY_API_URL}/transactions?accountId=${accountId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${cleanToken}`,
      'Origin': 'https://meu.pluggy.ai'
    }
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar transações (${res.status})`);
  }

  const txs = await res.json();
  const list = Array.isArray(txs) ? txs : (txs.results || []);

  return list.map(tx => ({
    id: tx.id || 'tx_mp_' + Math.random().toString(36).substring(2, 9),
    date: (tx.date || new Date().toISOString()).slice(0, 10),
    description: tx.description || tx.descriptionRaw || 'Transação meu.pluggy.ai',
    amount: Math.abs(tx.amount || 0),
    category: mapPluggyToAppCategory(tx),
    source: 'meu.pluggy.ai'
  }));
}

// Full Automatic Import Sequence for meu.pluggy.ai
export async function fetchAllMeuPluggyTransactions(bearerToken) {
  const items = await fetchMeuPluggyUserItems(bearerToken);

  if (!items || items.length === 0) {
    throw new Error('Nenhuma conta bancária conectada foi encontrada no seu perfil do meu.pluggy.ai.');
  }

  let allTransactions = [];

  for (const item of items) {
    try {
      const accounts = await fetchMeuPluggyItemAccounts(item.id, bearerToken);
      for (const account of accounts) {
        try {
          const txs = await fetchMeuPluggyAccountTransactions(account.id, bearerToken);
          allTransactions = [...allTransactions, ...txs];
        } catch (e) {
          console.warn(`Erro ao carregar transações da conta ${account.id}:`, e);
        }
      }
    } catch (e) {
      console.warn(`Erro ao carregar contas do item ${item.id}:`, e);
    }
  }

  return allTransactions;
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

  return results.map(tx => ({
    id: tx.id,
    date: (tx.date || new Date().toISOString()).slice(0, 10),
    description: tx.description,
    amount: Math.abs(tx.amount),
    category: mapPluggyToAppCategory(tx),
    source: 'Pluggy Developer'
  }));
}
