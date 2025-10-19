// src/lib/db-service.ts
// Service layer that abstracts database access
// Now uses Supabase for cloud sync

import { supabase } from './supabase';

// ==================== Type Exports ====================

export type Household = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  invite_code?: string;
};

export type HouseholdMember = {
  household_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category?: string;
  note?: string;
  who?: string;
  household_id?: string;
};

export type Goal = {
  id: string;
  name: string;
  current: number;
  target: number;
  category: "emergency" | "savings" | "fun" | "investment" | "debt" | "other";
  targetDate?: string;
  color: string;
  isDebt?: boolean;
  originalDebt?: number;
  completedAt?: string;
  linkedCategories?: string[];
  linkedBillNames?: string[];
  household_id?: string;
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  lastPaid?: string;
  linkedGoalId?: string;
  category?: string;
  household_id?: string;
};

export type Category = {
  id: string;
  name: string;
  limit: number;
};

export type CoupleMode = {
  enabled: boolean;
  partner1Name: string;
  partner2Name: string;
};

export type Settings = {
  currency: string;
  uiMode: "professional" | "minimalist";
  categories: Category[];
  coupleMode: CoupleMode;
};

// ==================== Household Operations ====================

export async function getCurrentHousehold(): Promise<Household | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user is a member of any household
  const { data: memberships, error: memberError } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', user.id)
    .limit(1);

  if (memberError) {
    console.error('Error fetching household membership:', memberError);
    return null;
  }

  if (!memberships || memberships.length === 0) return null;

  // Get household details
  const { data: household, error: householdError } = await supabase
    .from('households')
    .select('*')
    .eq('id', memberships[0].household_id)
    .single();

  if (householdError) {
    console.error('Error fetching household:', householdError);
    return null;
  }
  
  return household;
}

export async function createHousehold(name: string): Promise<Household> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate invite code
  const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  // Create household
  const { data: household, error: householdError } = await supabase
    .from('households')
    .insert({
      name,
      created_by: user.id,
      invite_code: inviteCode,
    })
    .select()
    .single();

  if (householdError) {
    console.error('Error creating household:', householdError);
    throw new Error(householdError.message || 'Failed to create household');
  }

  // Add creator as owner
  const { error: memberError } = await supabase
    .from('household_members')
    .insert({
      household_id: household.id,
      user_id: user.id,
      role: 'owner',
    });

  if (memberError) {
    console.error('Error adding household member:', memberError);
    throw new Error(memberError.message || 'Failed to add member');
  }

  return household;
}

export async function joinHousehold(inviteCode: string): Promise<Household> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Find household by invite code
  const { data: households, error: householdError } = await supabase
    .from('households')
    .select('*')
    .eq('invite_code', inviteCode)
    .limit(1);

  if (householdError || !households || households.length === 0) {
    console.error('Error finding household:', householdError);
    throw new Error('Invalid invite code');
  }

  const household = households[0];

  // Check if already a member
  const { data: existing } = await supabase
    .from('household_members')
    .select('*')
    .eq('household_id', household.id)
    .eq('user_id', user.id)
    .limit(1);

  if (existing && existing.length > 0) {
    throw new Error('Already a member of this household');
  }

  // Add as member
  const { error: memberError } = await supabase
    .from('household_members')
    .insert({
      household_id: household.id,
      user_id: user.id,
      role: 'member',
    });

  if (memberError) {
    console.error('Error adding member:', memberError);
    throw new Error(memberError.message || 'Failed to join household');
  }

  return household;
}

export async function leaveHousehold(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('household_members')
    .delete()
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function getHouseholdMembers(householdId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('household_members')
    .select('*')
    .eq('household_id', householdId);

  if (error) throw error;
  
  // Get current user to show their email
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  
  // Map members with user info (show email for current user, user_id for others)
  const membersWithDetails = (data || []).map((member) => {
    const isCurrentUser = member.user_id === currentUser?.id;
    return {
      ...member,
      user: {
        email: isCurrentUser ? currentUser?.email : `User ${member.user_id.substring(0, 8)}...`
      }
    };
  });
  
  return membersWithDetails;
}

// ==================== Transaction Operations ====================

export async function getAllTransactions(): Promise<Transaction[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user is in a household
  const household = await getCurrentHousehold();

  let query = supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (household) {
    // If in household, get household transactions
    query = query.eq('household_id', household.id);
  } else {
    // Otherwise get personal transactions
    query = query.eq('user_id', user.id).is('household_id', null);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function addTransaction(txn: Omit<Transaction, 'id'>): Promise<Transaction> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user is in a household
  const household = await getCurrentHousehold();

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ 
      ...txn, 
      user_id: user.id,
      household_id: household?.id || null
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function clearTransactions(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', user.id);
  
  if (error) throw error;
}

// ==================== Goal Operations ====================

export async function getAllGoals(): Promise<Goal[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user is in a household
  const household = await getCurrentHousehold();

  let query = supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (household) {
    query = query.eq('household_id', household.id);
  } else {
    query = query.eq('user_id', user.id).is('household_id', null);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  // Transform snake_case to camelCase
  return (data || []).map(goal => ({
    id: goal.id,
    name: goal.name,
    current: goal.current,
    target: goal.target,
    category: goal.category,
    targetDate: goal.target_date,
    color: goal.color,
    isDebt: goal.is_debt,
    originalDebt: goal.original_debt,
    completedAt: goal.completed_at,
    linkedCategories: goal.linked_categories,
    linkedBillNames: goal.linked_bill_names,
  }));
}

export async function addGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user is in a household
  const household = await getCurrentHousehold();

  const { data, error } = await supabase
    .from('goals')
    .insert([{
      user_id: user.id,
      household_id: household?.id || null,
      name: goal.name,
      current: goal.current,
      target: goal.target,
      category: goal.category,
      target_date: goal.targetDate,
      color: goal.color,
      is_debt: goal.isDebt,
      original_debt: goal.originalDebt,
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    current: data.current,
    target: data.target,
    category: data.category,
    targetDate: data.target_date,
    color: data.color,
    isDebt: data.is_debt,
    originalDebt: data.original_debt,
  };
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
  const updateData: any = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.current !== undefined) updateData.current = updates.current;
  if (updates.target !== undefined) updateData.target = updates.target;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.targetDate !== undefined) updateData.target_date = updates.targetDate;
  if (updates.color !== undefined) updateData.color = updates.color;
  if (updates.isDebt !== undefined) updateData.is_debt = updates.isDebt;
  if (updates.originalDebt !== undefined) updateData.original_debt = updates.originalDebt;
  if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt;
  if (updates.linkedCategories !== undefined) updateData.linked_categories = updates.linkedCategories;
  if (updates.linkedBillNames !== undefined) updateData.linked_bill_names = updates.linkedBillNames;

  const { error } = await supabase
    .from('goals')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
}

export async function removeGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ==================== Bill Operations ====================

export async function getAllBills(): Promise<Bill[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user is in a household
  const household = await getCurrentHousehold();

  let query = supabase
    .from('bills')
    .select('*')
    .order('due_day', { ascending: true });

  if (household) {
    query = query.eq('household_id', household.id);
  } else {
    query = query.eq('user_id', user.id).is('household_id', null);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  return (data || []).map(bill => ({
    id: bill.id,
    name: bill.name,
    amount: bill.amount,
    dueDay: bill.due_day,
    category: bill.category,
    linkedGoalId: bill.linked_goal_id,
    lastPaid: bill.last_paid,
  }));
}

export async function addBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user is in a household
  const household = await getCurrentHousehold();

  const { data, error } = await supabase
    .from('bills')
    .insert([{
      user_id: user.id,
      household_id: household?.id || null,
      name: bill.name,
      amount: bill.amount,
      due_day: bill.dueDay,
      category: bill.category,
      linked_goal_id: bill.linkedGoalId,
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    amount: data.amount,
    dueDay: data.due_day,
    category: data.category,
    linkedGoalId: data.linked_goal_id,
    lastPaid: data.last_paid,
  };
}

export async function updateBill(id: string, updates: Partial<Bill>): Promise<void> {
  const updateData: any = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.amount !== undefined) updateData.amount = updates.amount;
  if (updates.dueDay !== undefined) updateData.due_day = updates.dueDay;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.linkedGoalId !== undefined) updateData.linked_goal_id = updates.linkedGoalId;
  if ('lastPaid' in updates) updateData.last_paid = updates.lastPaid || null;

  const { error } = await supabase
    .from('bills')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
}

export async function removeBill(id: string): Promise<void> {
  const { error } = await supabase
    .from('bills')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ==================== Settings Operations ====================

export async function getSettings(): Promise<Settings> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  
  // Return default settings if none exist
  if (!data) {
    return {
      currency: '$',
      categories: [
        { id: '1', name: 'Groceries', limit: 500 },
        { id: '2', name: 'Dining', limit: 300 },
        { id: '3', name: 'Transport', limit: 200 },
      ],
      uiMode: 'professional',
      coupleMode: {
        enabled: false,
        partner1Name: 'Partner 1',
        partner2Name: 'Partner 2',
      },
    };
  }
  
  return {
    currency: data.currency,
    categories: data.categories,
    uiMode: data.ui_mode,
    coupleMode: data.couple_mode || {
      enabled: false,
      partner1Name: 'Partner 1',
      partner2Name: 'Partner 2',
    },
  };
}

export async function updateSettings(settings: Partial<Settings>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updateData: any = {};
  if (settings.currency !== undefined) updateData.currency = settings.currency;
  if (settings.categories !== undefined) updateData.categories = settings.categories;
  if (settings.uiMode !== undefined) updateData.ui_mode = settings.uiMode;
  if (settings.coupleMode !== undefined) updateData.couple_mode = settings.coupleMode;

  const { error } = await supabase
    .from('settings')
    .upsert({
      user_id: user.id,
      ...updateData,
    });
  
  if (error) throw error;
}

export async function addCategory(category: { id?: string; name: string; limit: number }): Promise<void> {
  const settings = await getSettings();
  const newCategory = {
    id: category.id || crypto.randomUUID(),
    name: category.name,
    limit: category.limit,
  };
  
  await updateSettings({
    categories: [...settings.categories, newCategory],
  });
}

export async function removeCategory(id: string): Promise<void> {
  const settings = await getSettings();
  await updateSettings({
    categories: settings.categories.filter((c: any) => c.id !== id),
  });
}
