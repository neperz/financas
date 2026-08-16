// Pluggy Open Finance & meu.pluggy.ai API Integration Service

import { categorizeTransaction } from './openFinanceService';

const PLUGGY_API_URL = 'https://api.pluggy.ai';
const MEU_PLUGGY_API_URL = 'https://meu.pluggy.ai/api/v1';

// Check if raw response text is HTML user account page
export function isHTMLUserAccountResponse(text) {
  if (typeof text !== 'string') return false;
  return text.includes('Excluir conta') || text.includes('Meu Pluggy') || text.includes('Felipe Mendonça') || text.includes('<html');
}

// Convert Pluggy / meu.pluggy.ai Transaction Category to App's 8 Core Categories
export function mapPluggyToAppCategory(pluggyTx) {
  const desc = pluggyTx.description || pluggyTx.merchant?.name || '';
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

    const text = await res.text();

    if (isHTMLUserAccountResponse(text)) {
      throw new Error('A API retornou a página HTML da conta de usuário do meu.pluggy.ai em vez de um objeto JSON de transações.');
    }

    const data = JSON.parse(text);
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
    const res = await fetch(`${MEU_PLUGGY_API_URL}/user/transactions`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${personalToken}`,
        'X-MCP-Client': 'Plano-Financeiro-Familiar'
      }
    });

    const text = await res.text();

    if (isHTMLUserAccountResponse(text)) {
      throw new Error('A sessão pessoal do meu.pluggy.ai retornou a página da web de gerenciamento de conta.');
    }

    if (res.ok) {
      const data = JSON.parse(text);
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

    throw new Error(`Conexão com meu.pluggy.ai falhou (${res.status})`);
  } catch (error) {
    console.warn('meu.pluggy.ai fetch error:', error);
    throw error;
  }
}
