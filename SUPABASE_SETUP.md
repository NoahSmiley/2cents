# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: 2cents (or whatever you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Set Up the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` and paste it
4. Click "Run" or press Ctrl+Enter
5. You should see "Success. No rows returned" - this is good!

## Step 3: Get Your API Credentials

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** in the left menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 4: Configure Your App

1. In your project root, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Add `.env` to `.gitignore` if not already there

## Step 5: Configure Email Settings (Optional but Recommended)

By default, Supabase sends confirmation emails. To customize:

1. Go to **Authentication** → **Email Templates**
2. Customize the templates as needed
3. For development, you can disable email confirmation:
   - Go to **Authentication** → **Providers** → **Email**
   - Toggle "Confirm email" off (not recommended for production!)

## Step 6: Test Your Setup

1. Restart your app:
   ```bash
   npm run start
   ```

2. You should see a login/signup page
3. Create an account with your email
4. Check your email for confirmation (if enabled)
5. Sign in and start using the app!

## Features Enabled

✅ **Multi-device sync** - Your data syncs across all devices  
✅ **Secure authentication** - Email/password with JWT tokens  
✅ **Row Level Security** - Users can only see their own data  
✅ **Real-time updates** - Changes sync instantly (can be enabled)  
✅ **Automatic backups** - Supabase handles backups for you  

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct URL and key
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env`

### "Not authenticated" errors
- Make sure you're signed in
- Check browser console for auth errors
- Try signing out and back in

### Email confirmation not working
- Check spam folder
- Verify email settings in Supabase dashboard
- For development, consider disabling email confirmation

## Migration from Local Database

Your existing local data can be migrated! The app will detect local data and offer to sync it to the cloud on first login.

## Free Tier Limits

Supabase free tier includes:
- 500MB database space
- 1GB file storage
- 2GB bandwidth
- Unlimited API requests
- 50,000 monthly active users

This is more than enough for personal use!
