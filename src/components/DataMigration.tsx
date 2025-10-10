// src/components/DataMigration.tsx
// Migration component disabled - users now start fresh with Supabase accounts

export function DataMigration({ children }: { children: React.ReactNode }) {
  // No migration needed with Supabase - each user has their own account
  return <>{children}</>;
}
