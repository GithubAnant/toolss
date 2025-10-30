import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthMenuProps {
  onClose: () => void;
}

export function AuthMenu({ onClose }: AuthMenuProps) {
  useEffect(() => {
    // Listen for successful sign in and close modal
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Close modal after successful sign in
        setTimeout(() => onClose(), 500);
      }
    });

    return () => subscription.unsubscribe();
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black rounded-xl p-8 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sign In</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <div className="auth-container">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#333333',
                  },
                },
              },
              className: {
                container: 'auth-container-inner',
                label: 'text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
                input: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm transition-all duration-150',
                button: 'w-full px-4 py-2 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-150 font-medium text-sm shadow-sm',
                anchor: 'text-black dark:text-white hover:underline text-sm',
                message: 'text-sm text-red-600 dark:text-red-400',
              },
            }}
            providers={[]}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}

export function AuthMenuButton() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowMenu(false);
  };

  return (
    <>
      {/* Minimalist 3-dot menu button - Vercel style */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="fixed bottom-6 left-6 z-10 pointer-events-auto group"
        aria-label="Menu"
      >
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-150">
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-[9]"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed bottom-20 left-6 z-10 pointer-events-auto bg-white dark:bg-black rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden min-w-[220px] animate-in fade-in slide-in-from-bottom-2 duration-150">
            {user ? (
              <>
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.email}
                  </p>
                </div>

                {/* Menu items */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    toggleDarkMode();
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-150 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                >
                  {isDarkMode ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-150 flex items-center gap-3 text-red-600 dark:text-red-400 border-t border-gray-200 dark:border-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    toggleDarkMode();
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-150 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                >
                  {isDarkMode ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-150 flex items-center gap-3 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {showAuthModal && <AuthMenu onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
