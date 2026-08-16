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
import WealthExponentiationSection from './components/WealthExponentiationSection';
import OpenFinanceSection from './components/OpenFinanceSection';
import CheckpointsSection from './components/CheckpointsSection';
import AboutSection from './components/AboutSection';
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
            <OpenFinanceSection />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <EmergencyFundSection />
              <FinancialRadarChart />
            </div>

            <AIDiagnosticSection />
            <ExpensesSection />
            <CheckpointsSection />
            <WealthExponentiationSection />
            <CompoundInterestSimulator />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <GoalsSection />
              <PatrimonyFutureSection />
            </div>

            <BenchmarksSection />
            <LifeStageSection />
            <HealthIndicatorsSection />
            <AboutSection />
          </>
        )}

        {/* Tab 2: 1. Orçamento Mensal & Despesas */}
        {activeTab === 'budget' && (
          <>
            <FinancialWaterfallSummary />
            <OpenFinanceSection />
            <ExpensesSection />
            <AboutSection />
          </>
        )}

        {/* Tab 3: 2. Reserva de Emergência */}
        {activeTab === 'reserve' && (
          <>
            <EmergencyFundSection />
            <AboutSection />
          </>
        )}

        {/* Tab 4: 3. Renda Extra & Aceleração */}
        {activeTab === 'exponentiation' && (
          <>
            <WealthExponentiationSection />
            <CompoundInterestSimulator />
            <AboutSection />
          </>
        )}

        {/* Tab 5: 4. Objetivos & Investimentos */}
        {activeTab === 'goals' && (
          <>
            <WealthExponentiationSection />
            <CompoundInterestSimulator />
            <GoalsSection />
            <PatrimonyFutureSection />
            <AboutSection />
          </>
        )}

        {/* Tab 6: 5. Raio-X & Radar da Saúde */}
        {activeTab === 'radar' && (
          <>
            <FinancialRadarChart />
            <AIDiagnosticSection />
            <HealthIndicatorsSection />
            <AboutSection />
          </>
        )}

        {/* Tab 7: 6. Benchmarks & Fases da Vida */}
        {activeTab === 'benchmarks' && (
          <>
            <BenchmarksSection />
            <LifeStageSection />
            <AboutSection />
          </>
        )}

        {/* Tab 8: 7. Checkpoints & Evolução */}
        {activeTab === 'checkpoints' && (
          <>
            <CheckpointsSection />
            <AboutSection />
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
