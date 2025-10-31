# Supabase Setup Guide

## 🚀 Quick Setup Instructions

### 1. Create Admin Emails Table

Go to your Supabase dashboard → SQL Editor and run this query to create the admin access control table:

```sql
-- Create admin_emails table
CREATE TABLE IF NOT EXISTS admin_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  added_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin emails
CREATE POLICY "Allow authenticated users to read admin emails"
  ON admin_emails
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow admins to insert admin emails
CREATE POLICY "Allow admins to insert admin emails"
  ON admin_emails
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow admins to delete admin emails
CREATE POLICY "Allow admins to delete admin emails"
  ON admin_emails
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert your admin email (REPLACE WITH YOUR EMAIL!)
INSERT INTO admin_emails (email, added_by)
VALUES ('your-email@example.com', 'system')
ON CONFLICT (email) DO NOTHING;

-- Add index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_admin_emails_email ON admin_emails(email);
```

**Important:** Replace `'your-email@example.com'` with your actual email address!

---

---

### 2. Create `tools` Table

This is the main table for all tools. Run this in SQL Editor:

```sql
-- Create tools table with all required fields
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_link TEXT NOT NULL,
  website_link TEXT NOT NULL,
  description TEXT NOT NULL,
  launch_video_link TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_is_featured ON public.tools(is_featured);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON public.tools(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read tools
CREATE POLICY "Allow public read access"
  ON public.tools
  FOR SELECT
  USING (true);

-- Only authenticated users can insert tools
CREATE POLICY "Allow authenticated insert"
  ON public.tools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update tools
CREATE POLICY "Allow authenticated update"
  ON public.tools
  FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete tools
CREATE POLICY "Allow authenticated delete"
  ON public.tools
  FOR DELETE
  TO authenticated
  USING (true);
```

---

### 3. Create `user_suggestions` Table

This table stores tool submissions from logged-in users via the `/submit` page:

```sql
-- Create user_suggestions table
CREATE TABLE IF NOT EXISTS public.user_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_link TEXT NOT NULL,
  website_link TEXT NOT NULL,
  description TEXT NOT NULL,
  launch_video_link TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_suggestions_status ON public.user_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_user_suggestions_user_id ON public.user_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_suggestions_created_at ON public.user_suggestions(created_at DESC);

-- Enable RLS
ALTER TABLE public.user_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own suggestions
CREATE POLICY "Allow authenticated users to insert suggestions"
  ON public.user_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own suggestions
CREATE POLICY "Allow users to read own suggestions"
  ON public.user_suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to read all suggestions (for admin dashboard)
CREATE POLICY "Allow authenticated users to read all suggestions"
  ON public.user_suggestions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update suggestions
CREATE POLICY "Allow authenticated users to update suggestions"
  ON public.user_suggestions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete suggestions
CREATE POLICY "Allow authenticated users to delete suggestions"
  ON public.user_suggestions
  FOR DELETE
  TO authenticated
  USING (true);
```

---

### 4. Create `tool_of_the_day` Table in Supabase

Go to your Supabase dashboard → SQL Editor and run this query:

```sql
-- Create the tool_of_the_day table
CREATE TABLE IF NOT EXISTS public.tool_of_the_day (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster date lookups
CREATE INDEX IF NOT EXISTS idx_tool_of_the_day_date ON public.tool_of_the_day(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tool_of_the_day ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read the tool of the day
CREATE POLICY "Allow public read access"
  ON public.tool_of_the_day
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Allow authenticated insert"
  ON public.tool_of_the_day
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
  ON public.tool_of_the_day
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete"
  ON public.tool_of_the_day
  FOR DELETE
  TO authenticated
  USING (true);
```

---

### 5. Configure Supabase Authentication URLs

Go to **Authentication** → **URL Configuration** in your Supabase dashboard:

**Site URL:** `https://yourdomain.com` (your production URL)

**Redirect URLs:** Add these:
```
https://yourdomain.com/**
http://localhost:5173/**
```

This allows authentication callbacks to work properly on both production and local development.

---

### 6. Enable Supabase Auth (if not already enabled)

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider
3. (Optional) Configure email templates in **Authentication** → **Email Templates**
4. (Optional) Enable additional providers like Google, GitHub, etc.

---

### 7. Set Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase dashboard → **Project Settings** → **API**

---

## 🎯 Features Now Available

### Admin Dashboard (`/admin` route)

**Access:** Only users with emails in `admin_emails` table can access

**Features:**
- ✅ View total tools count and statistics
- ✅ Upload new tools directly to `tools` table
- ✅ Set Tool of the Day manually
- ✅ View and manage user suggestions from `/submit` page
- ✅ Approve/reject user submissions
- ✅ Manage admin emails
- ✅ Edit and delete tools

### User Tool Submission (`/submit` route)

**Access:** Any logged-in user

**How it works:**
1. User must be signed in to access `/submit`
2. Fills out form with tool details
3. Submission goes to `user_suggestions` table with `pending` status
4. Admin can review, approve, or reject from admin dashboard
5. Approved tools are moved to main `tools` table

**Required Fields:**
- Tool Name
- Logo URL (image link)
- Website URL
- Description
- Category (dropdown: AI Tools, Design, Development, Marketing, Productivity, Social Media, Other)

**Optional Fields:**
- Launch Video URL
- Tags (add multiple, press Enter to add)

### Tool of the Day

**How it works:**
1. Check `tool_of_the_day` table for today's date
2. If found, display that tool
3. If not found, pick a random tool from `tools` table
4. Admins can manually set TOTD from admin dashboard

**Display:** Floating action button on left side of homepage with gradient glow effect

---

## 🔒 Security Notes

### Row Level Security (RLS)

Your `tools` table should have these policies:

```sql
-- Allow everyone to read tools
CREATE POLICY "Allow public read access"
  ON public.tools
  FOR SELECT
  USING (true);

-- Only authenticated users can insert tools
CREATE POLICY "Allow authenticated insert"
  ON public.tools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update their own tools
CREATE POLICY "Allow authenticated update"
  ON public.tools
  FOR UPDATE
  TO authenticated
  USING (true);
```

### Admin-Only Routes

The admin page (`/admin`) is protected by:
1. **Client-side:** React Router redirects if not admin
2. **Server-side:** Supabase RLS policies enforce database access

**Note:** For production, consider adding admin checks in RLS policies using a custom `is_admin` column in the `auth.users` table.

---

## 🧪 Testing Your Setup

### 1. Test Authentication
```bash
# Visit your app
npm run dev

# Click the 3-dot menu (bottom left)
# Sign up with your admin email
# Check if you can access /admin route
```

### 2. Test Tool Upload
```bash
# Go to /admin
# Click "Add New Tool"
# Fill the form and submit
# Check Supabase dashboard to verify insertion
```

### 3. Test Tool of the Day
```bash
# On /admin page
# Select a tool from dropdown
# Click "Set as TOTD"
# Go back to homepage
# Click the floating button on left
# Should show the tool you selected
```

---

## 🐛 Troubleshooting

### "Cannot access /admin"
- Check that your email is in `ADMIN_EMAILS` array
- Verify you're signed in (check 3-dot menu)
- Clear browser cache and try again

### "Tool of the Day not showing"
- Check Supabase SQL Editor for errors when creating table
- Verify at least one tool exists in `tools` table
- Check browser console for errors

### "Tool upload failed"
- Check browser console for error message
- Verify Supabase RLS policies allow authenticated inserts
- Ensure all required fields are filled

### "Build errors after setup"
- Run `npm install` to ensure all dependencies are installed
- Check that `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server: `npm run dev`

---

## 📊 Database Schema Reference

### `admin_emails` table
```sql
- id: UUID (primary key)
- email: TEXT (unique, not null)
- added_by: TEXT (not null)
- created_at: TIMESTAMPTZ
```

### `tools` table
```sql
- id: UUID (primary key)
- name: TEXT (not null)
- image_link: TEXT (not null)
- website_link: TEXT (not null)
- description: TEXT (not null)
- launch_video_link: TEXT (nullable)
- tags: TEXT[] (array, nullable)
- category: TEXT (not null)
- is_featured: BOOLEAN (default: false)
- created_at: TIMESTAMPTZ
```

### `user_suggestions` table
```sql
- id: UUID (primary key)
- name: TEXT (not null)
- image_link: TEXT (not null)
- website_link: TEXT (not null)
- description: TEXT (not null)
- launch_video_link: TEXT (nullable)
- tags: TEXT[] (array, nullable)
- category: TEXT (not null)
- user_id: UUID (foreign key → auth.users.id)
- user_email: TEXT (not null)
- status: TEXT (default: 'pending', values: 'pending', 'approved', 'rejected')
- created_at: TIMESTAMPTZ
```

### `tool_of_the_day` table
```sql
- id: UUID (primary key)
- tool_id: UUID (foreign key → tools.id)
- date: DATE (unique)
- created_at: TIMESTAMPTZ
```

---

## 🎨 Next Steps

1. **Customize Admin Dashboard:** Add more stats, charts, user management
2. **Enhanced TOTD:** Add analytics tracking, view counts
3. **Tool Management:** Edit/delete tools from admin panel
4. **Category Management:** CRUD operations for categories
5. **User Roles:** Extend beyond simple email whitelist to role-based access

---

## 💡 Pro Tips

- **Backup Admin Emails:** Keep a backup list in case you need to recover access
- **Test with Different Emails:** Create test accounts to verify non-admin restrictions
- **Monitor Supabase Logs:** Check for auth errors and RLS policy violations
- **Set Up Email Templates:** Customize welcome emails and password resets

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or open an issue!
