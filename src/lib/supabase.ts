import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nplmdveyzfilkmggfxbw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
