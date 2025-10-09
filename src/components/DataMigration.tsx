// src/components/DataMigration.tsx
import { useEffect, useState } from 'react';
import { migrateFromLocalStorage } from '@/lib/db-service';

export function DataMigration({ children }: { children: React.ReactNode }) {
  const [migrating, setMigrating] = useState(true);

  useEffect(() => {
    const runMigration = async () => {
      try {
        await migrateFromLocalStorage();
      } catch (error) {
        console.error('Migration failed:', error);
        // Continue anyway - might be running in browser mode
      } finally {
        setMigrating(false);
      }
    };

    runMigration();
  }, []);

  if (migrating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
