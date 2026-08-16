export const INITIAL_FINANCIAL_DATA = {
  perfil: {
    composicao: "2 adultos, 2 filhos",
    localizacao: "Cidades de médio porte",
    classe: "Classe média",
    dataBase: "Jun/26",
    moeda: "R$",
    rendaLiquidaMensal: 30000.00
  },
  regrasOuro: [
    { id: 1, text: "Viva abaixo da sua renda.", checked: true },
    { id: 2, text: "Gaste menos do que ganha.", checked: true },
    { id: 3, text: "Tenha reserva de emergência.", checked: true },
    { id: 4, text: "Proteja sua família.", checked: true },
    { id: 5, text: "Invista no seu futuro.", checked: true },
    { id: 6, text: "Acompanhe seus números.", checked: true }
  ],
  despesas: [
    {
      id: "moradia",
      nome: "MORADIA",
      idealPctMax: 30.0,
      iconName: "Home",
      cor: "#3b82f6",
      itens: [
        { id: "aluguel", nome: "Aluguel / Condomínio", valor: 4800.00 },
        { id: "iptu", nome: "IPTU (média mensal)", valor: 200.00 },
        { id: "energia", nome: "Energia elétrica", valor: 450.00 },
        { id: "agua", nome: "Água e esgoto", valor: 200.00 },
        { id: "internet", nome: "Internet fixa", valor: 150.00 }
      ]
    },
    {
      id: "alimentacao",
      nome: "ALIMENTAÇÃO",
      idealPctMin: 10.0,
      idealPctMax: 15.0,
      iconName: "ShoppingBag",
      cor: "#f97316",
      itens: [
        { id: "mercado", nome: "Mercado", valor: 2250.00 },
        { id: "refeicoes_fora", nome: "Refeições fora de casa", valor: 750.00 }
      ]
    },
    {
      id: "transporte",
      nome: "TRANSPORTE",
      idealPctMin: 10.0,
      idealPctMax: 15.0,
      iconName: "Car",
      cor: "#06b6d4",
      itens: [
        { id: "combustivel", nome: "Combustível", valor: 1200.00 },
        { id: "seguro_auto", nome: "Seguro do veículo", valor: 300.00 },
        { id: "ipva", nome: "IPVA (média mensal)", valor: 100.00 },
        { id: "manutencao", nome: "Manutenção e reparos", valor: 300.00 },
        { id: "app_taxi", nome: "Transporte por aplicativo / táxi", valor: 150.00 }
      ]
    },
    {
      id: "saude",
      nome: "SAÚDE",
      idealPctMin: 8.0,
      idealPctMax: 12.0,
      iconName: "Activity",
      cor: "#a855f7",
      itens: [
        { id: "plano_saude", nome: "Plano de saúde", valor: 2000.00 },
        { id: "farmacia", nome: "Medicamentos / Farmácia", valor: 300.00 },
        { id: "terapia", nome: "Psicólogo / Terapia", valor: 300.00 },
        { id: "academia", nome: "Academia / Atividades físicas", valor: 250.00 }
      ]
    },
    {
      id: "educacao",
      nome: "EDUCAÇÃO",
      idealPctMin: 10.0,
      idealPctMax: 15.0,
      iconName: "GraduationCap",
      cor: "#eab308",
      itens: [
        { id: "escola", nome: "Escola (mensalidades)", valor: 3000.00 },
        { id: "material", nome: "Material escolar", valor: 250.00 },
        { id: "cursos", nome: "Cursos / Idiomas", valor: 400.00 },
        { id: "extracurricular", nome: "Atividades extracurriculares", valor: 350.00 }
      ]
    },
    {
      id: "protecao",
      nome: "PROTEÇÃO",
      idealPctMin: 5.0,
      idealPctMax: 10.0,
      iconName: "ShieldCheck",
      cor: "#ec4899",
      itens: [
        { id: "seguro_vida", nome: "Seguro de vida", valor: 150.00 },
        { id: "seguro_residencia", nome: "Seguro residencial", valor: 50.00 },
        { id: "seguro_dependentes", nome: "Seguro de vida (dependentes)", valor: 50.00 }
      ]
    },
    {
      id: "lazer",
      nome: "LAZER E QUALIDADE DE VIDA",
      idealPctMax: 10.0,
      iconName: "Smile",
      cor: "#10b981",
      itens: [
        { id: "entretenimento", nome: "Lazer e entretenimento", valor: 900.00 },
        { id: "assinaturas", nome: "Assinaturas (streaming, apps, etc.)", valor: 200.00 },
        { id: "viagens_mensal", nome: "Viagens (reserva mensal)", valor: 800.00 },
        { id: "compras_pessoais", nome: "Compras pessoais", valor: 400.00 }
      ]
    },
    {
      id: "outros",
      nome: "OUTROS GASTOS",
      idealPctMax: 5.0,
      iconName: "MoreHorizontal",
      cor: "#64748b",
      itens: [
        { id: "cuidados", nome: "Cuidados pessoais", valor: 200.00 },
        { id: "doacoes", nome: "Presentes / Doações", valor: 150.00 },
        { id: "tarifas", nome: "Bancos / Tarifas", valor: 80.00 },
        { id: "impostos", nome: "Impostos diversos / Taxas", valor: 80.00 },
        { id: "vestuario", nome: "Roupas / Calçados", valor: 200.00 }
      ]
    }
  ],
  reservaEmergencia: {
    mesesRecomendados: 10,
    reservaAtual: 60000.00
  },
  objetivos: [
    { id: "obj1", objetivo: "Viagem em família", prazoAnos: 1, meta: 30000.00, aporteSugerido: 2200.00, acumulado: 0 },
    { id: "obj2", objetivo: "Troca de carro", prazoAnos: 3, meta: 120000.00, aporteSugerido: 3400.00, acumulado: 0 },
    { id: "obj3", objetivo: "Casa própria (entrada)", prazoAnos: 5, meta: 240000.00, aporteSugerido: 4600.00, acumulado: 0 },
    { id: "obj4", objetivo: "Faculdade dos filhos", prazoAnos: 15, meta: 400000.00, aporteSugerido: 2200.00, acumulado: 0 },
    { id: "obj5", objetivo: "Aposentadoria tranquila", prazoAnos: 30, meta: 3000000.00, aporteSugerido: 2800.00, acumulado: 0 }
  ],
  patrimonioFuturo: [
    { id: "pat1", item: "Previdência privada", recomendacao: "Invista 10% da renda ou mais", situacao: "Ajustar" },
    { id: "pat2", item: "Investimentos", recomendacao: "Diversificar (renda fixa, variável, FIIs)", situacao: "Iniciar" },
    { id: "pat3", item: "Reserva para faculdade", recomendacao: "Invista desde cedo (tempo é aliado)", situacao: "Planejar" },
    { id: "pat4", item: "Aposentadoria", recomendacao: "Quanto antes começar, melhor", situacao: "Ajustar" }
  ],
  benchmarks: [
    {
      faixa: "R$ 10.000",
      renda: 10000,
      moradia: 2100,
      alimentacao: 900,
      transporte: 600,
      saude: 700,
      educacao: 950,
      protecao: 200,
      lazer: 500,
      outros: 250,
      totalGastos: 6200,
      poupancaSugerida: 1000,
      pctPoupanca: "10%"
    },
    {
      faixa: "R$ 20.000",
      renda: 20000,
      moradia: 4200,
      alimentacao: 1800,
      transporte: 1200,
      saude: 1400,
      educacao: 1900,
      protecao: 300,
      lazer: 900,
      outros: 450,
      totalGastos: 12150,
      poupancaSugerida: 3850,
      pctPoupanca: "19%"
    },
    {
      faixa: "R$ 30.000",
      renda: 30000,
      moradia: 6500,
      alimentacao: 2700,
      transporte: 1800,
      saude: 2000,
      educacao: 2600,
      protecao: 350,
      lazer: 1400,
      outros: 620,
      totalGastos: 16070,
      poupancaSugerida: 7530,
      pctPoupanca: "25%"
    },
    {
      faixa: "R$ 50.000",
      renda: 50000,
      moradia: 9500,
      alimentacao: 4000,
      transporte: 3000,
      saude: 3500,
      educacao: 4000,
      protecao: 600,
      lazer: 2000,
      outros: 900,
      totalGastos: 27500,
      poupancaSugerida: 22500,
      pctPoupanca: "45%"
    }
  ],
  fasesVida: [
    {
      id: 1,
      fase: "1. CASAL SEM FILHOS",
      dicas: ["Foque em reserva", "Invista no futuro", "Controle o estilo de vida", "Planeje viagens"]
    },
    {
      id: 2,
      fase: "2. COM 1 FILHO",
      dicas: ["Reforce a reserva", "Proteja com seguros", "Planeje educação", "Revise o orçamento"]
    },
    {
      id: 3,
      fase: "3. COM 2 FILHOS",
      dicas: ["Priorize educação", "Tenha reserva de 12 meses", "Planeje longo prazo", "Evite dívidas"]
    },
    {
      id: 4,
      fase: "4. 50 ANOS OU MAIS",
      dicas: ["Foque na aposentadoria", "Proteja seu patrimônio", "Cuide da saúde", "Tenha liquidez"]
    }
  ],
  indicadoresAtuais: [
    { id: "ind1", indicador: "Taxa de poupança", valor: "15,0%", status: "Atenção" },
    { id: "ind2", indicador: "Meses de reserva atual", valor: "2,7 meses", status: "Alerta" },
    { id: "ind3", indicador: "Dependência do cartão", valor: "Baixa", status: "Saudável" },
    { id: "ind4", indicador: "Patrimônio líquido", valor: "Positivo", status: "Saudável" },
    { id: "ind5", indicador: "Dívidas / líquido", valor: "15%", status: "Saudável" },
    { id: "ind6", indicador: "Gastos com moradia", valor: "19,3%", status: "Saudável" },
    { id: "ind7", indicador: "Cartão de crédito", valor: "0% da renda", status: "Saudável" },
    { id: "ind8", indicador: "Possui seguros adequados", valor: "Sim", status: "Atenção" },
    { id: "ind9", indicador: "Investe para o futuro", valor: "Sim", status: "Atenção" }
  ],
  radarHealth: [
    { subject: "Poupança", ideal: 90, situacao: 65, fullMark: 100 },
    { subject: "Reserva", ideal: 95, situacao: 35, fullMark: 100 },
    { subject: "Dívidas", ideal: 90, situacao: 85, fullMark: 100 },
    { subject: "Investimentos", ideal: 85, situacao: 50, fullMark: 100 },
    { subject: "Proteção", ideal: 80, situacao: 30, fullMark: 100 },
    { subject: "Planejamento", ideal: 90, situacao: 70, fullMark: 100 }
  ],
  investimentos: [
    { id: 'inv_1', code: 'SPYI11', name: 'SPYI11 (ETF Internacional S&P 500)', type: 'ETF / FII', balance: 112.02, annualRate: 9.8, source: 'meu.pluggy.ai' },
    { id: 'inv_2', code: 'NU SELEÇÃO', name: 'Nu Seleção Potencial Multimercado', type: 'Fundo Multimercado', balance: 93.73, annualRate: 13.86, source: 'meu.pluggy.ai' }
  ]
};
