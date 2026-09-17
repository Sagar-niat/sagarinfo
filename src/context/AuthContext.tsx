import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'guest';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isPublicView: boolean;
  setPublicView: (val: boolean) => void;
  togglePublicView: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ success: boolean; error?: string; message?: string; isExistingUser?: boolean }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isPublicView, setIsPublicViewState] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/public');
  });

  // Strict Supabase session listener
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Check existing active Supabase session on startup
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: 'owner',
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        console.warn('Supabase session check error:', err);
        setUser(null);
      });

    // Listen to real-time auth state changes
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: 'owner',
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.warn('Supabase auth state listener error:', e);
    }
  }, []);

  // Strict Sign In with Supabase Auth
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials are missing in .env file. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          return {
            success: false,
            error: 'Email not confirmed yet. Supabase sent a confirmation link to your email inbox. Please confirm your email or disable "Confirm Email" in Supabase Auth settings.',
          };
        }
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            error: 'Invalid email or password. Please check your credentials or create a new account if you do not have one.',
          };
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch failed')) {
          return {
            success: false,
            error: `Unable to connect to Supabase server at ${import.meta.env.VITE_SUPABASE_URL}. Please check your internet connection or verify your Supabase URL in .env`,
          };
        }
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          email: data.user.email || cleanEmail,
          role: 'owner',
        };
        setUser(authUser);
        return { success: true };
      }

      return { success: false, error: 'Authentication failed. Please check your email and password.' };
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('fetch failed')) {
        return {
          success: false,
          error: `Could not reach Supabase endpoint (${import.meta.env.VITE_SUPABASE_URL}). Please verify your Supabase project is active and URL is correct in .env`,
        };
      }
      return { success: false, error: msg || 'Authentication error occurred.' };
    }
  };

  // Strict Sign Up with Supabase Auth & Duplicate User Detection
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string; message?: string; isExistingUser?: boolean }> => {
    const cleanEmail = email.trim();
    const cleanName = fullName.trim();

    if (!cleanEmail || !password || !cleanName) {
      return { success: false, error: 'All fields (Full Name, Email, Password) are required.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env file.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

      if (error) {
        if (
          error.message.includes('User already registered') ||
          error.message.includes('already exists') ||
          error.message.includes('already registered')
        ) {
          return {
            success: false,
            isExistingUser: true,
            error: 'An account with this email address already exists! Please switch to Sign In.',
          };
        }
        if (error.message.includes('rate limit') || error.message.includes('rate_limit')) {
          return {
            success: false,
            error: 'Supabase email rate limit exceeded. Please wait a few minutes before trying again, or disable "Confirm Email" in your Supabase Auth settings to enable instant sign ups.',
          };
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch failed')) {
          return {
            success: false,
            error: `Unable to connect to Supabase server at ${import.meta.env.VITE_SUPABASE_URL}. Please check your internet connection or verify your Supabase project URL in .env`,
          };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Detect if Supabase returned an empty identities array (user enumeration prevention for existing accounts)
        if (data.user.identities && data.user.identities.length === 0) {
          return {
            success: false,
            isExistingUser: true,
            error: 'An account with this email address already exists! Please switch to Sign In.',
          };
        }

        // Create user profile in public.profiles table
        try {
          await supabase.from('profiles').upsert([
            {
              id: data.user.id,
              full_name: cleanName,
              email: cleanEmail,
              tagline: 'Everything about me. One place.',
            },
          ]);
        } catch (profileErr) {
          console.warn('Profile creation notice:', profileErr);
        }

        // If email confirmation is enabled in Supabase Dashboard
        if (!data.session) {
          return {
            success: true,
            message: `Account created in Supabase! A confirmation email was sent to ${cleanEmail}. Please check your inbox and click the link to confirm your email before signing in.`,
          };
        }

        const authUser: AuthUser = {
          id: data.user.id,
          name: cleanName,
          email: data.user.email || cleanEmail,
          role: 'owner',
        };
        setUser(authUser);
        return { success: true };
      }

      return { success: false, error: 'Failed to create account.' };
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('fetch failed')) {
        return {
          success: false,
          error: `Could not reach Supabase endpoint (${import.meta.env.VITE_SUPABASE_URL}). Please check your Supabase project status or update .env`,
        };
      }
      return { success: false, error: msg || 'Registration error occurred.' };
    }
  };

  // Reset Password via Email
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured in .env' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        if (error.message.includes('rate limit') || error.message.includes('rate_limit')) {
          return {
            success: false,
            error: 'Supabase email rate limit exceeded. Free Supabase projects cap emails per hour. Please wait a few minutes before requesting another reset email.',
          };
        }
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.',
      };
    } catch (err: any) {
      return { success: false, error: 'Could not connect to Supabase server.' };
    }
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout notice:', e);
      }
    }
    setUser(null);
  };

  const setPublicView = (val: boolean) => {
    setIsPublicViewState(val);
  };

  const togglePublicView = () => {
    setIsPublicViewState((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isPublicView,
        setPublicView,
        togglePublicView,
        login,
        signUp,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
