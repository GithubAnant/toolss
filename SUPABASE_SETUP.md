# Supabase Setup Guide

## 🚀 Quick Setup Instructions

### 1. Update Admin Email Whitelist

Open `src/lib/supabase.ts` and replace the placeholder email with your actual admin email(s):

```typescript
export const ADMIN_EMAILS = [
  'your-actual-email@example.com', // Replace this!
  // Add more admin emails if needed
];
```

**Important:** Use the exact email you'll sign in with. The comparison is case-insensitive.

---

### 2. Create `tool_of_the_day` Table in Supabase

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

### 3. Verify Existing `tools` Table

Make sure your `tools` table has the `is_featured` field. Run this in SQL Editor:

```sql
-- Add is_featured column if it doesn't exist
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for faster featured lookups
CREATE INDEX IF NOT EXISTS idx_tools_is_featured ON public.tools(is_featured);
```

---

### 4. Enable Supabase Auth (if not already enabled)

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider
3. (Optional) Configure email templates in **Authentication** → **Email Templates**
4. (Optional) Enable additional providers like Google, GitHub, etc.

---

## 🎯 Features Now Available

### Admin Dashboard (`/admin` route)

**Access:** Only users with emails in `ADMIN_EMAILS` can access

**Features:**
- ✅ View total tools count
- ✅ Upload new tools with form validation
- ✅ Set Tool of the Day manually
- ✅ View recent tools

### Tool Upload Form

**Required Fields:**
- Tool Name
- Logo URL (image link)
- Website URL
- Description
- Category (dropdown)

**Optional Fields:**
- Launch Video URL
- Tags (add multiple)

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

### `tools` table
```sql
- id: UUID (primary key)
- name: TEXT
- image_link: TEXT
- description: TEXT
- website_link: TEXT
- launch_video_link: TEXT (nullable)
- tags: TEXT[] (array)
- category: TEXT
- created_at: TIMESTAMP
- is_featured: BOOLEAN (default: false)
```

### `tool_of_the_day` table
```sql
- id: UUID (primary key)
- tool_id: UUID (foreign key → tools.id)
- date: DATE (unique)
- created_at: TIMESTAMP
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
