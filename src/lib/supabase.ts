import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nplmdveyzfilkmggfxbw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbG1kdmV5emZpbGttZ2dmeGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODI1MTksImV4cCI6MjA3NjM1ODUxOX0.hAETF2fxQBMLc8y7uC64CpeeX7HZ7fX14UnR7rU-HmU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Tool {
  id: string;
  name: string;
  image_link: string;
  description: string;
  website_link: string;
  launch_video_link?: string;
  tags?: string[];
  category: string;
  created_at?: string;
}
