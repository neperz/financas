// Client-Side OFX / CSV / JSON Bank Statement Parser Engine

import { categorizeTransaction } from './openFinanceService';

// Parse OFX Content (Standard Banking Format)
export function parseOFXStatement(ofxText) {
  const transactions = [];

  // Match STMTTRN blocks
  const trnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
  let match;

  while ((match = trnRegex.exec(ofxText)) !== null) {
    const block = match[1];

    const amountMatch = /<TRNAMT>([\s\S]*?)(?=<|\n|\r)/i.exec(block);
    const memoMatch = /<MEMO>([\s\S]*?)(?=<|\n|\r)/i.exec(block);
    const nameMatch = /<NAME>([\s\S]*?)(?=<|\n|\r)/i.exec(block);
    const dateMatch = /<DTPOSTED>([\s\S]*?)(?=<|\n|\r)/i.exec(block);

    const rawAmt = amountMatch ? parseFloat(amountMatch[1].trim()) : 0;

    // Only process debit/expenses (negative amounts) or absolute value
    if (rawAmt < 0 || true) {
      const description = (nameMatch ? nameMatch[1].trim() : (memoMatch ? memoMatch[1].trim() : 'Transação OFX'));
      const rawDate = dateMatch ? dateMatch[1].trim().slice(0, 8) : '';
      const formattedDate = rawDate.length === 8 ? `${rawDate.slice(0,4)}-${rawDate.slice(4,6)}-${rawDate.slice(6,8)}` : new Date().toISOString().slice(0,10);
      const amount = Math.abs(rawAmt);

      if (amount > 0) {
        transactions.push({
          id: 'ofx_' + Math.random().toString(36).substring(2, 9),
          date: formattedDate,
          description: description.replace(/\s+/g, ' '),
          amount: amount,
          category: categorizeTransaction(description, amount),
          source: 'Arquivo OFX'
        });
      }
    }
  }

  return transactions;
}

// Parse CSV Content (General Bank CSV export format)
export function parseCSVStatement(csvText) {
  const lines = csvText.split(/\r?\n/);
  const transactions = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma or semicolon
    const parts = line.split(/[,;]/);

    if (parts.length >= 3) {
      const datePart = parts[0].replace(/"/g, '').trim();
      const descPart = parts[1].replace(/"/g, '').trim();
      const amtStr = parts[2].replace(/"/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.').trim();

      const amount = Math.abs(parseFloat(amtStr));

      if (!isNaN(amount) && amount > 0 && descPart.length > 2 && !descPart.toLowerCase().includes('descriç')) {
        transactions.push({
          id: 'csv_' + Math.random().toString(36).substring(2, 9),
          date: datePart,
          description: descPart,
          amount: amount,
          category: categorizeTransaction(descPart, amount),
          source: 'Arquivo CSV'
        });
      }
    }
  }

  return transactions;
}

// Master File Parser based on extension
export function parseBankStatementFile(fileContent, fileName = '') {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.ofx')) {
    return parseOFXStatement(fileContent);
  }

  if (lowerName.endsWith('.csv')) {
    return parseCSVStatement(fileContent);
  }

  if (lowerName.endsWith('.json')) {
    try {
      const parsed = JSON.parse(fileContent);
      const list = parsed.transactions || parsed.results || (Array.isArray(parsed) ? parsed : []);
      return list.map(tx => ({
        id: tx.id || 'json_' + Math.random().toString(36).substring(2, 9),
        date: (tx.date || new Date().toISOString()).slice(0, 10),
        description: tx.description || tx.memo || 'Transação JSON',
        amount: Math.abs(tx.amount || 0),
        category: categorizeTransaction(tx.description || tx.memo || '', Math.abs(tx.amount || 0)),
        source: 'Arquivo JSON'
      }));
    } catch (e) {
      console.error('JSON parse error:', e);
      return [];
    }
  }

  // Default fallback try OFX then CSV
  const ofxTry = parseOFXStatement(fileContent);
  if (ofxTry.length > 0) return ofxTry;

  return parseCSVStatement(fileContent);
}
