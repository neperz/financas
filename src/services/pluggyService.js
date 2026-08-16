// Pluggy Open Finance API Integration Service

import { categorizeTransaction } from './openFinanceService';

// Default Pluggy Configuration & Endpoints
const PLUGGY_API_URL = 'https://api.pluggy.ai';

// Convert Pluggy Transaction Category / Description to App's 8 Core Categories
export function mapPluggyToAppCategory(pluggyTx) {
  const desc = pluggyTx.description || pluggyTx.merchant?.name || '';
  const amount = Math.abs(pluggyTx.amount || 0);

  // Use our smart categorizer first
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

// Fetch transactions from a connected Pluggy Item ID
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
      date: tx.date.slice(0, 10),
      description: tx.description,
      amount: Math.abs(tx.amount),
      category: mapPluggyToAppCategory(tx),
      rawPluggyCategory: tx.category
    }));
  } catch (error) {
    console.error('Pluggy API Error:', error);
    throw error;
  }
}
