# Household Sharing Setup Guide

This guide will help you set up the multi-user household sharing feature for 2Cents.

## Overview

### What is Household Sharing?

**Household Sharing** allows two (or more) separate user accounts to share the same financial data in real-time. Each partner:
- Has their own login credentials (separate email/password)
- Can see all shared transactions, goals, and bills
- Can add/edit/delete shared data
- Sees changes made by their partner automatically (syncs every 30 seconds)

### Household Sharing vs. Couple Mode

These are **two different features** that work great together:

| Feature | What It Does | How It Works |
|---------|-------------|--------------|
| **Household Sharing** | Share data between separate accounts | Two users, two logins, same data |
| **Couple Mode** | Track individual spending within shared data | Labels transactions by partner name |

**Example Workflow:**
1. **Set up Household Sharing** - You and your partner both create accounts and join the same household
2. **Enable Couple Mode** - Both of you turn on Couple Mode in Settings and set partner names
3. **Track spending** - When adding transactions, select who paid/received
4. **View balances** - Use the Couple View page to see who owes whom

You can use Household Sharing without Couple Mode (just shared finances), or use both together (shared finances with individual tracking).

## Quick Start Guide

### For the First Partner (Household Creator)

1. **Run the database migration** (see Database Setup below)
2. **Create your account** and log in to 2Cents
3. Go to **Settings** → **Household Sharing**
4. Click **Create Household** and enter a name
5. **Copy the invite code** that appears
6. Share the code with your partner

### For the Second Partner (Joining)

1. **Create your own account** (different email) and log in
2. Go to **Settings** → **Household Sharing**
3. Enter the **invite code** from your partner
4. Click **Join Household**
5. You now share all financial data!

### Optional: Enable Couple Mode

1. Both partners go to **Settings** → **Couple Mode**
2. Toggle **Enable Couple Mode**
3. Set **Partner 1 Name** and **Partner 2 Name** (must be the same on both accounts)
4. Save settings
5. Now you can track who paid/received for each transaction

## Database Setup

### Step 1: Run the Migration

1. Open your Supabase project dashboard
2. Go to the **SQL Editor**
3. Open the file `supabase-household-migration.sql`
4. Copy and paste the entire contents into the SQL Editor
5. Click **Run** to execute the migration

This will:
- Create `households` and `household_members` tables
- Add `household_id` columns to `transactions`, `goals`, and `bills` tables
- Set up Row Level Security (RLS) policies for data access
- Create indexes for better performance
- Enable real-time subscriptions

### Step 2: Verify Setup

1. In Supabase dashboard, go to **Database** → **Tables**
2. Verify the following tables exist:
   - `households`
   - `household_members`
3. Check that `transactions`, `goals`, and `bills` tables have a `household_id` column

**Note:** Realtime replication is optional. The app uses automatic polling (every 30 seconds) to sync data between partners, which works great for a finance app.

## How to Use

### Creating a Household

1. **First Partner:**
   - Log in to 2Cents
   - Go to **Settings**
   - Scroll to **Household Sharing** section
   - Enter a household name (e.g., "Smith Family")
   - Click **Create Household**
   - Copy the **Invite Code** that appears

2. **Second Partner:**
   - Create a separate account and log in
   - Go to **Settings**
   - Scroll to **Household Sharing** section
   - Enter the invite code from Partner 1
   - Click **Join Household**

### What Happens After Joining

- Both partners now see the **same** transactions, goals, and bills
- Any data created by either partner is visible to both
- Changes made by one partner appear instantly for the other
- The **Couple View** page shows individual spending by partner

### Using Couple Mode with Household Sharing

**Important:** Couple Mode is a separate feature that enhances Household Sharing.

**To use Couple Mode:**
1. Both partners enable **Couple Mode** in Settings
2. Both partners set the **same partner names** (e.g., "Alice" and "Bob")
3. When adding transactions, select who paid/received from the dropdown
4. View the **Couple View** page to see:
   - Individual net balances (who spent what)
   - Settlement amount (who owes whom)
   - Filtered transaction history by partner

**Without Couple Mode:**
- You still share all financial data
- Transactions don't track who paid/received
- No individual balance tracking
- Perfect for fully merged finances

**With Couple Mode:**
- Track individual contributions
- See who owes whom
- Great for split expenses or partial merging

### Leaving a Household

1. Go to **Settings**
2. Scroll to **Household Sharing**
3. Click **Leave Household**
4. Confirm the action

**Warning:** After leaving, you will lose access to all shared data. Your personal data created before joining the household will remain intact.

## Data Privacy & Security

### What's Shared
- ✅ Transactions (when `household_id` is set)
- ✅ Goals (when `household_id` is set)
- ✅ Bills (when `household_id` is set)
- ✅ Budget categories and settings

### What's NOT Shared
- ❌ Personal transactions created before joining
- ❌ Login credentials
- ❌ Email addresses (only visible to household members)

### Security Features
- Row Level Security (RLS) ensures users can only access their own or household data
- Invite codes are unique and required to join
- Only household owners can delete the household
- All members can leave at any time

## Troubleshooting

### Changes Not Syncing
1. Wait up to 30 seconds for automatic sync
2. Refresh the page to force an immediate sync
3. Verify both users are in the same household (check Settings)
4. Check browser console for errors

### Can't Join Household
- Verify the invite code is correct (case-sensitive)
- Ensure you're not already in another household
- Check that the household still exists

### Data Not Showing
- Confirm you're logged in to the correct account
- Verify the household membership in Settings
- Check that the data was created after joining the household

## Technical Details

### Database Schema

**households**
- `id`: UUID (primary key)
- `name`: Text
- `created_by`: UUID (user reference)
- `invite_code`: Text (unique)
- `created_at`: Timestamp

**household_members**
- `household_id`: UUID (foreign key)
- `user_id`: UUID (foreign key)
- `role`: Text ('owner' or 'member')
- `joined_at`: Timestamp

### Data Sync

The app syncs data between partners using:
- **Automatic polling** every 30 seconds when in a household
- **Manual refresh** when navigating between pages
- **Immediate updates** when either partner adds/edits data

This provides near-real-time sync without requiring Supabase Realtime replication (which is in early access).

### Data Filtering

When a user is in a household:
- Queries filter by `household_id`
- New data is automatically tagged with `household_id`
- Personal data (no `household_id`) remains private

## Best Practices

1. **Set Partner Names:** Both partners should set the same names in Couple Mode settings
2. **Regular Backups:** Export your data periodically (Settings → Export Data)
3. **Communication:** Discuss with your partner before making major changes
4. **Consistent Categories:** Use the same budget categories for better tracking

## Frequently Asked Questions

### Do we need separate accounts?
**Yes!** Each partner must create their own account with a different email address. This allows each person to log in independently.

### What's the difference between Household Sharing and Couple Mode?
- **Household Sharing** = Two separate accounts seeing the same data
- **Couple Mode** = Labeling transactions by who paid/received
- You can use either one alone, or both together

### Can we use Couple Mode without Household Sharing?
Yes! Couple Mode works on a single account. It's useful for tracking split expenses even if only one person logs in.

### Can we use Household Sharing without Couple Mode?
Yes! You can share all financial data without tracking individual contributions. Perfect for fully merged finances.

### What happens to my old data when I join a household?
Your personal data (created before joining) remains private. Only new data created after joining is shared with the household.

### Can more than 2 people join a household?
Yes! The system supports multiple members, though the Couple Mode UI is designed for 2 partners.

### How fast do changes sync?
Changes sync automatically every 30 seconds. You can also refresh manually by navigating between pages.

### What if we break up or want to separate finances?
Either partner can leave the household at any time from Settings. After leaving, you'll only see your personal data.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Supabase configuration
3. Ensure all migrations have been run
4. Check that RLS policies are enabled
5. Make sure both partners ran the cleanup and migration scripts

---

**Note:** This feature requires Supabase as the backend. Local-only mode does not support household sharing.
