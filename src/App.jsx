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
import InvestmentsPortfolioSection from './components/InvestmentsPortfolioSection';
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
        {/* Tab 1: Visão Geral & Orçamento Completo */}
        {(activeTab === 'overview' || !activeTab) && (
          <>
            <FinancialWaterfallSummary />
            <OpenFinanceSection />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <EmergencyFundSection />
              <InvestmentsPortfolioSection />
            </div>

            <ExpensesSection />
            <AIDiagnosticSection />
            <AboutSection />
          </>
        )}

        {/* Tab 2: Checkpoints & Evolução Temporal */}
        {activeTab === 'checkpoints' && (
          <>
            <CheckpointsSection />
            <AboutSection />
          </>
        )}

        {/* Tab 3: Simulações & Investimentos */}
        {activeTab === 'simulators' && (
          <>
            <WealthExponentiationSection />
            <CompoundInterestSimulator />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <GoalsSection />
              <PatrimonyFutureSection />
            </div>
            <AboutSection />
          </>
        )}

        {/* Tab 4: Raio-X & Saúde Financeira */}
        {activeTab === 'health' && (
          <>
            <FinancialRadarChart />
            <HealthIndicatorsSection />
            <BenchmarksSection />
            <LifeStageSection />
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
