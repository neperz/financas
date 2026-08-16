// Pluggy Open Finance & meu.pluggy.ai MCP API Integration Service

import { categorizeTransaction } from './openFinanceService';

const PLUGGY_API_URL = 'https://api.pluggy.ai';
const MEU_PLUGGY_API_URL = 'https://meu.pluggy.ai/api/v1';

// Convert Pluggy / meu.pluggy.ai Transaction Category to App's 8 Core Categories
export function mapPluggyToAppCategory(pluggyTx) {
  const desc = pluggyTx.description || pluggyTx.merchant?.name || '';
  const amount = Math.abs(pluggyTx.amount || 0);

  // Use smart categorizer
  const smartCat = categorizeTransaction(desc, amount);
  if (smartCat && smartCat !== 'outros') {
    return smartCat;
  }

  // Fallback to Pluggy native categories
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

// Fetch transactions from Developer Pluggy API (dashboard.pluggy.ai)
export async function fetchPluggyItemTransactions(itemId, apiKey) {
  if (!apiKey) {
    throw new Error('API Key ou Connect Token da Pluggy não configurado.');
  }

  try {
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
  } catch (error) {
    console.error('Pluggy API Error:', error);
    throw error;
  }
}

// Fetch transactions from Personal Account (meu.pluggy.ai) via MCP / User Token
export async function fetchMeuPluggyTransactions(personalToken) {
  if (!personalToken) {
    throw new Error('Token Pessoal do meu.pluggy.ai não informado.');
  }

  try {
    // Attempt fetching user transactions from meu.pluggy.ai endpoint
    const res = await fetch(`${MEU_PLUGGY_API_URL}/user/transactions`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${personalToken}`,
        'X-MCP-Client': 'Plano-Financeiro-Familiar'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const list = data.transactions || data.results || [];
      return list.map(tx => ({
        id: tx.id || 'tx_mp_' + Math.random(),
        date: (tx.date || new Date().toISOString()).slice(0, 10),
        description: tx.description || tx.memo || 'Transação meu.pluggy.ai',
        amount: Math.abs(tx.amount || 0),
        category: mapPluggyToAppCategory(tx),
        source: 'meu.pluggy.ai'
      }));
    }

    // Fallback if token is passed via MCP JSON-RPC format
    const rpcRes = await fetch('https://meu.pluggy.ai/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${personalToken}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'get_transactions',
          arguments: {}
        }
      })
    });

    if (rpcRes.ok) {
      const rpcData = await rpcRes.json();
      const txs = rpcData.result?.content?.[0]?.text ? JSON.parse(rpcData.result.content[0].text) : [];
      return txs.map(tx => ({
        id: tx.id || 'tx_mcp_' + Math.random(),
        date: (tx.date || new Date().toISOString()).slice(0, 10),
        description: tx.description,
        amount: Math.abs(tx.amount),
        category: mapPluggyToAppCategory(tx),
        source: 'meu.pluggy.ai (MCP)'
      }));
    }

    throw new Error(`Conexão com meu.pluggy.ai falhou (${res.status})`);
  } catch (error) {
    console.warn('meu.pluggy.ai direct fetch error:', error);
    throw error;
  }
}
