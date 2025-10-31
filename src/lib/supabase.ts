import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nplmdveyzfilkmggfxbw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin email whitelist - fallback for when database is not available
export const ADMIN_EMAILS = [
  'anantsinghal444@gmail.com',
  'jonpad512@gmail.com' 
];

// Check if user is admin (checks database only)
export const isAdmin = async (email: string | undefined): Promise<boolean> => {
  console.log('Checking admin status for email:', email);
  
  if (!email) {
    console.log('No email provided');
    return false;
  }
  
  const normalizedEmail = email.toLowerCase();
  
  try {
    const { data, error } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', normalizedEmail)
      .limit(1);
    
    console.log('Database query result:', { data, error });
    
    if (error) {
      console.error('Error checking admin status from database:', error);
      return false;
    }
    
    const isAdminUser = data && data.length > 0;
    console.log('Is admin?', isAdminUser);
    return isAdminUser;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
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
