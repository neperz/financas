import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Header from './components/Header';
import FinancialJourneyNav from './components/FinancialJourneyNav';
import FinancialWaterfallSummary from './components/FinancialWaterfallSummary';
import ExpensesSection from './components/ExpensesSection';
import EmergencyFundSection from './components/EmergencyFundSection';
import GoalsSection from './components/GoalsSection';
import PatrimonyFutureSection from './components/PatrimonyFutureSection';
import BenchmarksSection from './components/BenchmarksSection';
import LifeStageSection from './components/LifeStageSection';
import HealthIndicatorsSection from './components/HealthIndicatorsSection';
import FinancialRadarChart from './components/FinancialRadarChart';
import CompoundInterestSimulator from './components/CompoundInterestSimulator';
import AIDiagnosticSection from './components/AIDiagnosticSection';
import Footer from './components/Footer';

function MainAppContent() {
  const { activeTab } = useFinance();

  return (
    <div className="app-container" id="app-main-content">
      <Header />
      <FinancialJourneyNav />

      <main>
        {/* Tab 1: Overview (Visão Geral Conectada) */}
        {activeTab === 'overview' && (
          <>
            <FinancialWaterfallSummary />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <EmergencyFundSection />
              <FinancialRadarChart />
            </div>

            <AIDiagnosticSection />
            <ExpensesSection />
            <CompoundInterestSimulator />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <GoalsSection />
              <PatrimonyFutureSection />
            </div>

            <BenchmarksSection />
            <LifeStageSection />
            <HealthIndicatorsSection />
          </>
        )}

        {/* Tab 2: 1. Orçamento Mensal & Despesas */}
        {activeTab === 'budget' && (
          <>
            <FinancialWaterfallSummary />
            <ExpensesSection />
          </>
        )}

        {/* Tab 3: 2. Reserva de Emergência */}
        {activeTab === 'reserve' && (
          <>
            <EmergencyFundSection />
          </>
        )}

        {/* Tab 4: 3. Objetivos & Investimentos */}
        {activeTab === 'goals' && (
          <>
            <CompoundInterestSimulator />
            <GoalsSection />
            <PatrimonyFutureSection />
          </>
        )}

        {/* Tab 5: 4. Raio-X & Radar da Saúde */}
        {activeTab === 'radar' && (
          <>
            <FinancialRadarChart />
            <AIDiagnosticSection />
            <HealthIndicatorsSection />
          </>
        )}

        {/* Tab 6: 5. Benchmarks & Fases da Vida */}
        {activeTab === 'benchmarks' && (
          <>
            <BenchmarksSection />
            <LifeStageSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
