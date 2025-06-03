
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/appStore';

interface AuthUser extends User {
  username?: string;
  profile_picture?: string | null;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, username: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadFromDatabase } = useAppStore();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          
          if (session?.user) {
            await handleUserSession(session);
          } else {
            setUser(null);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        
        if (session?.user) {
          await handleUserSession(session);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    const handleUserSession = async (session: Session) => {
      try {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }

        if (mounted) {
          setUser({
            ...session.user,
            username: profile?.username || session.user.email?.split('@')[0] || '',
            profile_picture: profile?.profile_picture,
            role: profile?.role,
          });

          // Load user data from database
          try {
            await loadFromDatabase(session.user.id);
          } catch (error) {
            console.error('Error loading user data:', error);
          }
        }
      } catch (error) {
        console.error('Error in handleUserSession:', error);
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadFromDatabase]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      // Don't set loading false here, let auth state change handle it
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
          }
        }
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
