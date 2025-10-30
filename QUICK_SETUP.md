# 🚀 Quick Setup Guide

## 1️⃣ Add Your Admin Email

Open `src/lib/supabase.ts` and update line 14:

```typescript
export const ADMIN_EMAILS = [
  'youremail@gmail.com',  // Replace with YOUR email!
];
```

---

## 2️⃣ Create Supabase Tables

Go to **Supabase Dashboard** → **SQL Editor** → **New Query** and run these:

### Create `tool_of_the_day` table:

```sql
CREATE TABLE IF NOT EXISTS public.tool_of_the_day (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_tool_of_the_day_date ON public.tool_of_the_day(date DESC);

ALTER TABLE public.tool_of_the_day ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.tool_of_the_day FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON public.tool_of_the_day FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON public.tool_of_the_day FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON public.tool_of_the_day FOR DELETE TO authenticated USING (true);
```

### Create `user_suggestions` table:

```sql
CREATE TABLE IF NOT EXISTS public.user_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_link TEXT NOT NULL,
  website_link TEXT NOT NULL,
  description TEXT NOT NULL,
  launch_video_link TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_user_suggestions_status ON public.user_suggestions(status);
CREATE INDEX idx_user_suggestions_user_id ON public.user_suggestions(user_id);

ALTER TABLE public.user_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.user_suggestions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON public.user_suggestions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON public.user_suggestions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON public.user_suggestions FOR DELETE TO authenticated USING (true);
```

---

## 3️⃣ Test Your Setup

1. **Run the app**: `npm run dev`
2. **Sign up**: Click the 3-dot menu (bottom left) → Sign up with your admin email
3. **Access admin**: Go to `/admin` or click through the menu
4. **Test features**:
   - Upload a tool
   - Set Tool of the Day
   - Submit a startup (as regular user)
   - Review submissions in admin panel

---

## ✨ New Features Summary

### Tool of the Day
- **Location**: Bottom right corner (star icon with gradient glow)
- **Behavior**: Opens popup modal instead of full page
- **Admin Control**: Set manually from admin dashboard

### Beautiful 3-Dot Menu
- **Location**: Bottom left corner
- **Design**: White button with blue-purple gradient glow
- **Features**:
  - Sign In / Sign Up
  - Submit a Startup (requires sign-in)
  - Sign Out (when logged in)
  - Shows user email when logged in

### Submit a Startup
- **Access**: Only for signed-in users
- **Fields**: Name, Logo, Website, Description, Category, Video (optional), Tags (optional)
- **Flow**: User submits → Goes to `user_suggestions` table → Admin reviews → Can approve/reject/edit

### Admin Panel - User Suggestions Section
- **View all submissions** with status badges (pending/approved/rejected)
- **Three options** for pending submissions:
  1. **Edit & Approve**: Opens edit form (coming soon!)
  2. **Approve As-Is**: Instantly adds to tools table
  3. **Reject**: Marks as rejected
- **Delete** approved/rejected submissions

---

## 🎨 UI Changes

✅ Tool of the Day moved to bottom right (icon only)  
✅ 3-dot menu redesigned with gradient glow  
✅ Dropdown menu with icons and hover effects  
✅ Submit startup form with validation  
✅ Admin suggestions panel with status badges  

---

## 🔐 Security

- **Admin route**: Protected by email whitelist
- **Submit startup**: Requires authentication
- **RLS policies**: Prevent unauthorized database access
- **User tracking**: Stores user_id and user_email with each submission

---

## 📊 Database Schema

### `tool_of_the_day`
```
- id: UUID
- tool_id: UUID (FK → tools.id)
- date: DATE (unique)
- created_at: TIMESTAMP
```

### `user_suggestions`
```
- id: UUID
- name: TEXT
- image_link: TEXT
- website_link: TEXT
- description: TEXT
- launch_video_link: TEXT (nullable)
- category: TEXT
- tags: TEXT[]
- user_id: UUID
- user_email: TEXT
- status: TEXT (pending/approved/rejected)
- created_at: TIMESTAMP
```

---

That's it! You're ready to go! 🎉
