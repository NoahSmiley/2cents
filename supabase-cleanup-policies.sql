-- Clean up existing policies before re-running migration
-- Run this FIRST if you already ran the migration and got the recursion error

-- Drop triggers
DROP TRIGGER IF EXISTS update_households_updated_at ON public.households;

-- Drop household_members policies
DROP POLICY IF EXISTS "Users can view members of their household" ON public.household_members;
DROP POLICY IF EXISTS "Users can view household members" ON public.household_members;
DROP POLICY IF EXISTS "Users can join households" ON public.household_members;
DROP POLICY IF EXISTS "Users can leave households" ON public.household_members;

-- Drop households policies
DROP POLICY IF EXISTS "Users can view households they are members of" ON public.households;
DROP POLICY IF EXISTS "Users can view households they are members of or by invite code" ON public.households;
DROP POLICY IF EXISTS "Users can create households" ON public.households;
DROP POLICY IF EXISTS "Household owners can update their household" ON public.households;
DROP POLICY IF EXISTS "Household owners can delete their household" ON public.households;

-- Drop transaction policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view own or household transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own or household transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own or household transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own or household transactions" ON public.transactions;

-- Drop goal policies
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can view own or household goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert own or household goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own or household goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own or household goals" ON public.goals;

-- Drop bill policies
DROP POLICY IF EXISTS "Users can view own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can view own or household bills" ON public.bills;
DROP POLICY IF EXISTS "Users can insert own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can insert own or household bills" ON public.bills;
DROP POLICY IF EXISTS "Users can update own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can update own or household bills" ON public.bills;
DROP POLICY IF EXISTS "Users can delete own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can delete own or household bills" ON public.bills;
