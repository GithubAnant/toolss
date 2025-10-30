# Admin Management Setup Guide

## Overview
The admin management system allows you to manage admin access through both:
1. **Hardcoded list** in `src/lib/supabase.ts` (fallback)
2. **Database table** `admin_emails` (dynamic, manageable through UI)

## Setup Instructions

### Step 1: Create the Database Table

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL script from `ADMIN_EMAILS_TABLE.sql`

The SQL will:
- Create the `admin_emails` table
- Enable Row Level Security (RLS)
- Set up access policies
- Insert your initial admin email
- Create an index for performance

### Step 2: Update Your Initial Admin Email

In the SQL script, replace:
```sql
VALUES ('anantsinghal444@gmail.com', 'system')
```
with your actual email address.

### Step 3: How It Works

#### Admin Check Flow:
1. When a user tries to access `/admin`, the system checks:
   - First: Hardcoded `ADMIN_EMAILS` array (fast, always works)
   - Second: Database `admin_emails` table (dynamic, can be updated via UI)
   
2. If the email is found in either location, access is granted

#### Managing Admins via UI:

Once logged in to the admin panel, you'll see the **"Admin Management"** section where you can:

**Add New Admin:**
- Enter the email address
- Click "Add Admin"
- The email is immediately added to the database

**Remove Admin:**
- Click "Remove" next to any admin email
- You cannot remove yourself (safety feature)
- Confirmation dialog will appear

**View All Admins:**
- See all admin emails from the database
- See who added each admin and when

### Step 4: Security Considerations

1. **RLS Policies**: The table has Row Level Security enabled
   - Only authenticated users can read admin emails
   - Any authenticated user can insert/delete (you should verify admin status in your app)

2. **Hardcoded Fallback**: Always keep at least one admin in the `ADMIN_EMAILS` array in case:
   - Database is unavailable
   - Table gets accidentally cleared
   - You need emergency access

3. **Current Hardcoded Admin**:
```typescript
export const ADMIN_EMAILS = [
  'anantsinghal444@gmail.com',
];
```

### Step 5: Sync Hardcoded and Database Admins

After creating the table, you can:

1. Keep the hardcoded admin as a super admin / emergency access
2. Add additional admins through the UI (stored in database)
3. Both will have equal access

### Troubleshooting

**Problem**: Can't access admin panel
- **Solution**: Check that your email is either:
  - In the `ADMIN_EMAILS` array in `src/lib/supabase.ts`
  - In the `admin_emails` table in Supabase

**Problem**: "Failed to add admin email"
- **Solution**: Check that the `admin_emails` table exists
- Run the SQL script from `ADMIN_EMAILS_TABLE.sql`
- Check Supabase logs for errors

**Problem**: Removed myself accidentally
- **Solution**: If you're in the hardcoded `ADMIN_EMAILS` array, you still have access
- Re-add yourself through the UI

## Features

✅ Add admin emails dynamically through UI
✅ Remove admin emails (except yourself)
✅ See who added each admin and when
✅ Hardcoded fallback for emergency access
✅ Dark mode support
✅ Real-time updates
✅ Email validation
✅ Duplicate prevention

## Database Schema

```sql
admin_emails (
  id          UUID PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  added_by    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
)
```
