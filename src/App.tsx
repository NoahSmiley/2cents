import { type ComponentType } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import GoalBuckets from './pages/GoalBuckets';
import RecurringBills from './pages/RecurringBills';
import SettingsPage from './pages/Settings';
import Help from './pages/Help';
import CoupleView from './pages/CoupleView';
import AppLayout from './components/app-layout';
import { DataMigration } from './components/DataMigration';
import { TitleBar } from './components/TitleBar';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Loader2 } from 'lucide-react';

type RouteConfig = {
  path: string;
  Component: ComponentType;
};

const appRoutes: RouteConfig[] = [
  { path: '/', Component: Dashboard },
  { path: '/transactions', Component: Transactions },
  { path: '/goals', Component: GoalBuckets },
  { path: '/recurring', Component: RecurringBills },
  { path: '/couple', Component: CoupleView },
  { path: '/settings', Component: SettingsPage },
  { path: '/help', Component: Help },
];

function FullScreenLoader() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function AuthenticatedApp() {
  return (
    <div className="flex flex-col h-screen">
      <TitleBar />
      <div className="flex-1 overflow-hidden">
        <AppLayout>
          <DataMigration>
            <Routes>
              {appRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Routes>
          </DataMigration>
        </AppLayout>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AuthenticatedApp />;
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
