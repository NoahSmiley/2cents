import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import GoalBuckets from './pages/GoalBuckets';
import RecurringBills from './pages/RecurringBills';
import SettingsPage from './pages/Settings';
import AppLayout from './components/app-layout';
import { DataMigration } from './components/DataMigration';
import { TitleBar } from './components/TitleBar';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex flex-col h-screen">
      <TitleBar />
      <div className="flex-1 overflow-hidden">
        <AppLayout>
          <DataMigration>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/goals" element={<GoalBuckets />} />
              <Route path="/recurring" element={<RecurringBills />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </DataMigration>
        </AppLayout>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="twocents-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
