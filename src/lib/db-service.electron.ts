import { supabase } from './supabase';

// Transaction operations
export async function getAllTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function addTransaction(txn: {
  amount: number;
  date: string;
  category?: string;
  note?: string;
  who?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ ...txn, user_id: user.id }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function clearTransactions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', user.id);
  
  if (error) throw error;
}

// Goal operations
export async function getAllGoals() {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });
  
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

export async function addGoal(goal: {
  name: string;
  current: number;
  target: number;
  category: string;
  targetDate?: string;
  color: string;
  isDebt?: boolean;
  originalDebt?: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('goals')
    .insert([{
      user_id: user.id,
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

export async function updateGoal(id: string, updates: any) {
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

export async function removeGoal(id: string) {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Bill operations
export async function getAllBills() {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .order('due_day', { ascending: true });
  
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

export async function addBill(bill: {
  name: string;
  amount: number;
  dueDay: number;
  category?: string;
  linkedGoalId?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('bills')
    .insert([{
      user_id: user.id,
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

export async function updateBill(id: string, updates: any) {
  const updateData: any = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.amount !== undefined) updateData.amount = updates.amount;
  if (updates.dueDay !== undefined) updateData.due_day = updates.dueDay;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.linkedGoalId !== undefined) updateData.linked_goal_id = updates.linkedGoalId;
  if (updates.lastPaid !== undefined) updateData.last_paid = updates.lastPaid;

  const { error } = await supabase
    .from('bills')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
}

export async function removeBill(id: string) {
  const { error } = await supabase
    .from('bills')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Settings operations
export async function getSettings() {
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
      uiMode: 'default',
    };
  }
  
  return {
    currency: data.currency,
    categories: data.categories,
    uiMode: data.ui_mode,
  };
}

export async function updateSettings(settings: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updateData: any = {};
  if (settings.currency !== undefined) updateData.currency = settings.currency;
  if (settings.categories !== undefined) updateData.categories = settings.categories;
  if (settings.uiMode !== undefined) updateData.ui_mode = settings.uiMode;

  const { error } = await supabase
    .from('settings')
    .upsert({
      user_id: user.id,
      ...updateData,
    });
  
  if (error) throw error;
}

export async function addCategory(category: { id?: string; name: string; limit: number }) {
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

export async function removeCategory(id: string) {
  const settings = await getSettings();
  await updateSettings({
    categories: settings.categories.filter((c: any) => c.id !== id),
  });
}
