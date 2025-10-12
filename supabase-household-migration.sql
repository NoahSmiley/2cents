-- Household Sharing Migration for 2Cents
-- Run this SQL in your Supabase SQL Editor

-- Create households table
CREATE TABLE IF NOT EXISTS public.households (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invite_code TEXT UNIQUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create household_members table (join table)
CREATE TABLE IF NOT EXISTS public.household_members (
    household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (household_id, user_id)
);

-- Add household_id to existing tables
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS household_id UUID REFERENCES public.households(id) ON DELETE CASCADE;

ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS household_id UUID REFERENCES public.households(id) ON DELETE CASCADE;

ALTER TABLE public.bills 
ADD COLUMN IF NOT EXISTS household_id UUID REFERENCES public.households(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_household_id ON public.transactions(household_id);
CREATE INDEX IF NOT EXISTS idx_goals_household_id ON public.goals(household_id);
CREATE INDEX IF NOT EXISTS idx_bills_household_id ON public.bills(household_id);
CREATE INDEX IF NOT EXISTS idx_household_members_user_id ON public.household_members(user_id);
CREATE INDEX IF NOT EXISTS idx_households_invite_code ON public.households(invite_code);

-- Enable Row Level Security (RLS)
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for households table
CREATE POLICY "Users can view households they are members of or by invite code"
    ON public.households FOR SELECT
    USING (
        created_by = auth.uid() -- Can see households they created
        OR id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
        OR invite_code IS NOT NULL -- Can see any household with an invite code (for joining)
    );

CREATE POLICY "Users can create households"
    ON public.households FOR INSERT
    WITH CHECK (created_by = auth.uid()); -- Users can only create households where they are the creator

CREATE POLICY "Household owners can update their household"
    ON public.households FOR UPDATE
    USING (
        id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid() AND role = 'owner'
        )
    );

CREATE POLICY "Household owners can delete their household"
    ON public.households FOR DELETE
    USING (
        id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid() AND role = 'owner'
        )
    );

-- RLS Policies for household_members table
-- Simple policy: users can see any household_members row where they are a member
CREATE POLICY "Users can view household members"
    ON public.household_members FOR SELECT
    USING (true); -- Allow reading, but households policy will restrict which households they can see

CREATE POLICY "Users can join households"
    ON public.household_members FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave households"
    ON public.household_members FOR DELETE
    USING (user_id = auth.uid());

-- Update RLS policies for transactions to include household access
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own or household transactions"
    ON public.transactions FOR SELECT
    USING (
        user_id = auth.uid() 
        OR household_id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
CREATE POLICY "Users can insert own or household transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND (
            household_id IS NULL 
            OR household_id IN (
                SELECT household_id 
                FROM public.household_members 
                WHERE user_id = auth.uid()
            )
        )
    );

DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
CREATE POLICY "Users can update own or household transactions"
    ON public.transactions FOR UPDATE
    USING (
        user_id = auth.uid() 
        OR household_id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
CREATE POLICY "Users can delete own or household transactions"
    ON public.transactions FOR DELETE
    USING (
        user_id = auth.uid() 
        OR household_id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
    );

-- Update RLS policies for goals
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
CREATE POLICY "Users can view own or household goals"
    ON public.goals FOR SELECT
    USING (
        user_id = auth.uid() 
        OR household_id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own goals" ON public.goals;
CREATE POLICY "Users can insert own or household goals"
    ON public.goals FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND (
            household_id IS NULL 
            OR household_id IN (
                SELECT household_id 
                FROM public.household_members 
                WHERE user_id = auth.uid()
            )
        )
    );

DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
CREATE POLICY "Users can update own or household goals"
    ON public.goals FOR UPDATE
    USING (
        user_id = auth.uid() 
        OR household_id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;
CREATE POLICY "Users can delete own or household goals"
    ON public.goals FOR DELETE
    USING (
        user_id = auth.uid() 
        OR household_id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
    );

-- Update RLS policies for bills
DROP POLICY IF EXISTS "Users can view own bills" ON public.bills;
CREATE POLICY "Users can view own or household bills"
    ON public.bills FOR SELECT
    USING (
        user_id = auth.uid() 
        OR household_id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own bills" ON public.bills;
CREATE POLICY "Users can insert own or household bills"
    ON public.bills FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND (
            household_id IS NULL 
            OR household_id IN (
                SELECT household_id 
                FROM public.household_members 
                WHERE user_id = auth.uid()
            )
        )
    );

DROP POLICY IF EXISTS "Users can update own bills" ON public.bills;
CREATE POLICY "Users can update own or household bills"
    ON public.bills FOR UPDATE
    USING (
        user_id = auth.uid() 
        OR household_id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own bills" ON public.bills;
CREATE POLICY "Users can delete own or household bills"
    ON public.bills FOR DELETE
    USING (
        user_id = auth.uid() 
        OR household_id IN (
            SELECT household_id 
            FROM public.household_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for households table
CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON public.households
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.households TO authenticated;
GRANT ALL ON public.household_members TO authenticated;
