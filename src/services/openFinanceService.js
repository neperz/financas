// Open Finance Brasil Integration Service (Pluggy / Belvo Compatible Architecture)

export const SUPPORTED_BANKS = [
  { id: 'bb', name: 'Banco do Brasil', logo: '🏛️', color: '#fef08a', primaryColor: '#003399' },
  { id: 'nubank', name: 'Nubank', logo: '💜', color: '#f3e8ff', primaryColor: '#8a05be' },
  { id: 'inter', name: 'Banco Inter', logo: '🧡', color: '#ffedd5', primaryColor: '#ff7a00' },
  { id: 'itau', name: 'Itaú Unibanco', logo: '🟧', color: '#ffedd5', primaryColor: '#ec7000' },
  { id: 'bradesco', name: 'Bradesco', logo: '🔴', color: '#ffe4e6', primaryColor: '#cc092f' },
  { id: 'santander', name: 'Santander', logo: '🔴', color: '#ffe4e6', primaryColor: '#ec0000' },
  { id: 'c6', name: 'C6 Bank', logo: '⬛', color: '#f1f5f9', primaryColor: '#242424' }
];

// Description Normalizer to eliminate duplicates caused by gateway prefixes & merchant variations
export function normalizeTransactionDescription(description = '') {
  let descUpper = description.toUpperCase().trim();

  // Remove common payment gateway prefixes (PAG*, IFD*, MP*, DL*, EBANX*, PAYPAL*)
  descUpper = descUpper.replace(/^(PAG\*|IFD\*|MP\*|DL\*|EBANX\*|PAYPAL\*)/i, '').trim();

  // Amazon Normalization
  if (/(AMAZON|AMZN)/.test(descUpper)) {
    if (/(PRIME|VIDEO)/.test(descUpper)) return 'Amazon Prime';
    if (/(KINDLE|BOOKS|LIVROS)/.test(descUpper)) return 'Amazon Kindle / Livros';
    return 'Amazon.com.br';
  }

  // iFood
  if (/(IFOOD|FOOD CLUB)/.test(descUpper)) {
    return 'iFood';
  }

  // Uber
  if (/(UBER)/.test(descUpper)) {
    if (/EATS/.test(descUpper)) return 'Uber Eats';
    return 'Uber';
  }

  // Mercado Livre
  if (/(MERCADO\s*LIVRE|MERCADOLIVRE)/.test(descUpper)) {
    return 'Mercado Livre';
  }

  // Apple
  if (/(APPLE\.COM|APPLE)/.test(descUpper)) {
    return 'Apple Services';
  }

  // Streaming & Subscriptions
  if (/NETFLIX/.test(descUpper)) return 'Netflix';
  if (/SPOTIFY/.test(descUpper)) return 'Spotify';
  if (/(DISNEY|DISNEYPLUS)/.test(descUpper)) return 'Disney+';
  if (/(MAX|HBO)/.test(descUpper)) return 'Max (HBO)';

  // Pharmacies
  if (/(DROGASIL|DROGARAIA|DROGA RAIA)/.test(descUpper)) return 'Drogasil / Raia';
  if (/DROGARIA/.test(descUpper)) return 'Drogaria';

  // Supermarkets
  if (/CARREFOUR/.test(descUpper)) return 'Carrefour';
  if (/(PÃO DE AÇÚCAR|PAO DE ACUCAR)/.test(descUpper)) return 'Pão de Açúcar';
  if (/ATACADAO/.test(descUpper)) return 'Atacadão';

  // Fuel / Gas stations
  if (/(SHELL|POSTO)/.test(descUpper)) return 'Posto de Combustível';

  // Return cleaned original description if no rule matched
  return description.trim();
}

// Smart Transaction Categorizer Rules Engine
export function categorizeTransaction(description = '', amount = 0) {
  const normDesc = normalizeTransactionDescription(description).toUpperCase();

  // Moradia
  if (/(ENEL|SABESP|COPEL|CEMIG|ALUGUEL|CONDOMINIO|IPTU|CLARO|VIVO FIBRA|TIM FIXA|NET FIXA)/.test(normDesc)) {
    return 'moradia';
  }
  // Alimentação
  if (/(CARREFOUR|PÃO DE AÇÚCAR|ATACADAO|IFOOD|REST|PADARIA|MERCADO|HORTIFRUTI|OUTBACK|UBER EATS|MC DONALDS)/.test(normDesc)) {
    return 'alimentacao';
  }
  // Transporte
  if (/(UBER|99APP|POSTO|SHELL|IPVA|SEM PARAR|LOCALIZA|VELOE|GASOLINA|ESTACIONAMENTO)/.test(normDesc)) {
    return 'transporte';
  }
  // Saúde
  if (/(DROGASIL|DROGARAIA|DASA|FLEURY|UNIMED|SMART FIT|ACADEMIA|FARMACIA|PSICOLOGO|CONSULTORIO)/.test(normDesc)) {
    return 'saude';
  }
  // Educação
  if (/(ESCOLA|FACULDADE|UDEMY|ALURA|LIVRARIA|CURSO|IDIOMAS|COLEGIO|KINDLE)/.test(normDesc)) {
    return 'educacao';
  }
  // Proteção
  if (/(PORTO SEGURO|MAPFRE|TOKIO MARINE|SEGURO|SULAMERICA|BRADESCO SEGUROS)/.test(normDesc)) {
    return 'protecao';
  }
  // Lazer
  if (/(NETFLIX|SPOTIFY|CINEMARK|STEAM|INGRESSO|AIRBNB|HOTEL|VIAGEM|PRIME VIDEO|AMAZON PRIME|DISNEY|MAX)/.test(normDesc)) {
    return 'lazer';
  }

  // Outros
  return 'outros';
}

// Sample Open Finance Statement Mock Data for Institutions
export function fetchMockOpenFinanceStatements(bankId) {
  const bank = SUPPORTED_BANKS.find(b => b.id === bankId) || SUPPORTED_BANKS[0];

  const mockStatements = {
    bb: [
      { id: 'tx_bb_1', date: '2026-08-10', description: 'ENEL DISTRIBUIDORA SP', amount: 450.00 },
      { id: 'tx_bb_2', date: '2026-08-11', description: 'CONDOMINIO RESIDENCIAL', amount: 4800.00 },
      { id: 'tx_bb_3', date: '2026-08-12', description: 'POSTO SHELL COMBUSTIVEL', amount: 1200.00 },
      { id: 'tx_bb_4', date: '2026-08-14', description: 'PORTO SEGURO VIDA', amount: 150.00 }
    ],
    nubank: [
      { id: 'tx_nu_1', date: '2026-08-05', description: 'PAG*iFood Refeicoes', amount: 750.00 },
      { id: 'tx_nu_2', date: '2026-08-08', description: 'SUPERMERCADO CARREFOUR', amount: 2250.00 },
      { id: 'tx_nu_3', date: '2026-08-12', description: 'UBER *TRIP RIO', amount: 150.00 },
      { id: 'tx_nu_4', date: '2026-08-15', description: 'NETFLIX ENTRETENIMENTO', amount: 200.00 }
    ],
    inter: [
      { id: 'tx_in_1', date: '2026-08-03', description: 'ESCOLA MENSALIDADE', amount: 3000.00 },
      { id: 'tx_in_2', date: '2026-08-07', description: 'PLANO DE SAUDE UNIMED', amount: 2000.00 },
      { id: 'tx_in_3', date: '2026-08-09', description: 'DROGASIL FARMACIA', amount: 300.00 },
      { id: 'tx_in_4', date: '2026-08-14', description: 'CURSO DE IDIOMAS', amount: 400.00 }
    ]
  };

  const rawList = mockStatements[bankId] || [
    { id: 'tx_gen_1', date: '2026-08-10', description: 'SUPERMERCADO LOCAL', amount: 1200.00 },
    { id: 'tx_gen_2', date: '2026-08-12', description: 'POSTO DE COMBUSTIVEL', amount: 600.00 },
    { id: 'tx_gen_3', date: '2026-08-14', description: 'CONDOMINIO', amount: 2500.00 }
  ];

  return rawList.map(tx => ({
    ...tx,
    description: normalizeTransactionDescription(tx.description),
    bankName: bank.name,
    bankId: bank.id,
    category: categorizeTransaction(tx.description, tx.amount)
  }));
}
