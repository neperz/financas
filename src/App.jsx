import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Header from './components/Header';
import ExpensesSection from './components/ExpensesSection';
import EmergencyFundSection from './components/EmergencyFundSection';
import GoalsSection from './components/GoalsSection';
import PatrimonyFutureSection from './components/PatrimonyFutureSection';
import BenchmarksSection from './components/BenchmarksSection';
import LifeStageSection from './components/LifeStageSection';
import HealthIndicatorsSection from './components/HealthIndicatorsSection';
import FinancialRadarChart from './components/FinancialRadarChart';
import Footer from './components/Footer';

function MainApp() {
  return (
    <div className="app-container">
      <Header />
      
      <main>
        {/* Top Grid: Radar Chart & Emergency Fund */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <FinancialRadarChart />
          <EmergencyFundSection />
        </div>

        {/* Expenses Engine */}
        <ExpensesSection />

        {/* Goals & Future Wealth */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <GoalsSection />
          <PatrimonyFutureSection />
        </div>

        {/* Benchmarks & Life Stage */}
        <BenchmarksSection />
        <LifeStageSection />
        <HealthIndicatorsSection />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <MainApp />
    </FinanceProvider>
  );
}
