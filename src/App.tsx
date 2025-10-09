import { Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import RecurringBills from './pages/RecurringBills';
import GoalBuckets from './pages/GoalBuckets';
import { ThemeProvider } from './components/theme-provider';
import AppLayout from './components/app-layout';
import SettingsPage from './pages/Settings';
import Transactions from './pages/Transactions';
import { DataMigration } from './components/DataMigration';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DataMigration>
        <div style={{ fontFamily: 'system-ui, sans-serif' }}>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddTransaction />} />
              <Route path="/recurring" element={<RecurringBills />} />
              <Route path="/goals" element={<GoalBuckets />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </AppLayout>
        </div>
      </DataMigration>
    </ThemeProvider>
  );
}
