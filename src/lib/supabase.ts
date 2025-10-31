import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nplmdveyzfilkmggfxbw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin email whitelist - fallback for when database is not available
export const ADMIN_EMAILS = [
  'anantsinghal444@gmail.com',
  'jonpad512@gmail.com' // Fixed typo: .co -> .com
  // Add more admin emails here as fallback
];

// Check if user is admin (checks both hardcoded list and database)
export const isAdmin = async (email: string | undefined): Promise<boolean> => {
  if (!email) return false;
  
  const normalizedEmail = email.toLowerCase();
  
  // First check hardcoded list (fast fallback)
  if (ADMIN_EMAILS.includes(normalizedEmail)) {
    return true;
  }
  
  // Then check database
  try {
    const { data, error } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', normalizedEmail)
      .limit(1);
    
    if (error) {
      console.error('Error checking admin status from database:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Synchronous version for immediate checks (only checks hardcoded list)
export const isAdminSync = (email: string | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export interface Tool {
  id?: string;
  name: string;
  image_link: string;
  description: string;
  website_link: string;
  launch_video_link?: string;
  tags?: string[];
  category: string;
  created_at?: string;
  is_featured?: boolean; // For tool of the day
}

export interface ToolOfTheDay {
  id?: string;
  tool_id: string;
  date: string;
  created_at?: string;
}
