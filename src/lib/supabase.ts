import { createClient } from '@supabase/supabase-js';

// These will be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          date: string;
          category?: string;
          note?: string;
          who?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          current: number;
          target: number;
          category: string;
          target_date?: string;
          color: string;
          is_debt?: boolean;
          original_debt?: number;
          completed_at?: string;
          linked_categories?: string[];
          linked_bill_names?: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['goals']['Insert']>;
      };
      bills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          due_day: number;
          category?: string;
          linked_goal_id?: string;
          last_paid?: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bills']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['bills']['Insert']>;
      };
      settings: {
        Row: {
          user_id: string;
          currency: string;
          categories: Array<{ id: string; name: string; limit: number }>;
          ui_mode?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['settings']['Insert']>;
      };
    };
  };
}
