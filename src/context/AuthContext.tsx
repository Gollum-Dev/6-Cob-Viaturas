import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

// We map registered users locally for the UI (like a user management screen) if needed,
// but for true security, fetching users should happen on the backend or via RLS policies.
interface AuthContextType {
  user: User | null;
  registeredUsers: User[]; // keeping this for compatibility with other views if they need it
  login: (milNumber: string, password: string) => Promise<string | null>;
  register: (
    password: string,
    role: UserRole,
    milNumber: string,
    rank: string,
    name: string,
    unit: string,
    phone?: string,
    cpf?: string,
    rg?: string,
    birthDate?: string
  ) => Promise<boolean>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updatePassword: (password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Failsafe: force loading to false after 5 seconds no matter what
    const failsafe = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const fetchProfile = async (userId: string) => {
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout fetching profile')), 5000)
      );
      
      try {
        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
        return { data, error };
      } catch (err: any) {
        return { data: null, error: err };
      }
    };

    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const { data: profile, error } = await fetchProfile(session.user.id);

          if (profile && mounted) {
            setUser({
              id: profile.id,
              role: profile.role as UserRole,
              milNumber: profile.mil_number,
              rank: profile.rank ? profile.rank.toUpperCase() : '',
              name: profile.name,
              unit: profile.unit,
              phone: profile.phone,
              cpf: profile.cpf,
              rg: profile.rg,
              birthDate: profile.birth_date,
              fullName: profile.full_name,
            });
          } else if (error) {
            console.error('Failed to fetch profile during initial session, but preserving session:', error);
            // We do NOT setUser(null) here because a transient network error shouldn't log the user out.
          }
        }
      } catch (err) {
        console.error("Error getting initial session:", err);
      } finally {
        if (mounted) setIsLoading(false);
        clearTimeout(failsafe);
      }
    }

    getInitialSession();

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('>>> [AUTH] onAuthStateChange event:', event, 'Session exists:', !!session);
      
      if (event === 'INITIAL_SESSION') return; // Handled by getInitialSession

      // Only fetch profile if this is a new sign in
      if (session?.user && mounted && event === 'SIGNED_IN') {
        console.log('>>> [AUTH] Fetching profile for event:', event);
        if (mounted) setIsLoading(true);

        const { data: profile, error } = await fetchProfile(session.user.id);

        console.log('>>> [AUTH] Profile fetch from listener returned!', { profile, error });

        if (profile && mounted) {
          console.log('>>> [AUTH] Profile found in listener. Calling setUser...');
          setUser({
            id: profile.id,
            role: profile.role as UserRole,
            milNumber: profile.mil_number,
            rank: profile.rank ? profile.rank.toUpperCase() : '',
            name: profile.name,
            unit: profile.unit,
            phone: profile.phone,
            cpf: profile.cpf,
            rg: profile.rg,
            birthDate: profile.birth_date,
            fullName: profile.full_name,
          });
        } else if (error && mounted) {
           console.error('Failed to fetch profile in onAuthStateChange:', error);
           // Do not setUser(null) here! Keep whatever session state we have.
        }
      } else if (!session && mounted) {
        console.log('>>> [AUTH] No session user, setting user to null');
        setUser(null);
      }
      if (mounted) setIsLoading(false);
      console.log('>>> [AUTH] onAuthStateChange listener finished');
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(failsafe);
    };
  }, []);

  // Fetch all users for admin or unit management if needed
  useEffect(() => {
    if (!user) {
      setRegisteredUsers([]);
      return;
    }

    const fetchUsers = async () => {
      let query = supabase.from('users').select('*');
      
      // If not ADMINISTRADOR, filter by their own unit
      if (user.role !== UserRole.ADMINISTRADOR) {
        query = query.eq('unit', user.unit);
      }

      const { data, error } = await query;
      if (!error && data) {
        setRegisteredUsers(data.map(u => ({
          id: u.id,
          role: u.role as UserRole,
          milNumber: u.mil_number,
          rank: u.rank ? u.rank.toUpperCase() : '',
          name: u.name,
          unit: u.unit,
          phone: u.phone,
          cpf: u.cpf,
          rg: u.rg,
          birthDate: u.birth_date,
          fullName: u.full_name,
        })));
      } else if (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user]);

  const milNumberToEmail = (milNumber: string) => `mil${milNumber}@cbmmg.mg.gov.br`;

  const login = async (milNumber: string, password: string): Promise<string | null> => {
    try {
      console.log('>>> [AUTH] Starting login for milNumber:', milNumber);
      
      console.log('>>> [AUTH] Calling supabase.auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: milNumberToEmail(milNumber),
        password,
      });
      
      console.log('>>> [AUTH] signInWithPassword returned!', { data, error });
      
      if (error) return error.message;
      if (!data?.user) return 'Erro desconhecido ao autenticar.';

      console.log('>>> [AUTH] Fetching user profile from users table for id:', data.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      console.log('>>> [AUTH] Profile fetch returned!', { profile, profileError });

      if (profile) {
        console.log('>>> [AUTH] Profile found. Calling setUser...');
        setUser({
          id: profile.id,
          role: profile.role as UserRole,
          milNumber: profile.mil_number,
          rank: profile.rank ? profile.rank.toUpperCase() : '',
          name: profile.name,
          unit: profile.unit,
          phone: profile.phone,
          cpf: profile.cpf,
          rg: profile.rg,
          birthDate: profile.birth_date,
          fullName: profile.full_name,
        });
        return null; // Null means success
      } else {
        console.error("Profile not found after login", profileError);
        return 'Perfil de usuário não encontrado no banco de dados.';
      }
    } catch (err: any) {
      console.error(err);
      return err.message || 'Erro inesperado.';
    }
  };

  const register = async (
    password: string, 
    role: UserRole, 
    milNumber: string, 
    rank: string, 
    name: string, 
    unit: string,
    phone?: string,
    cpf?: string,
    rg?: string,
    birthDate?: string,
    fullName?: string
  ) => {
    try {
      const { data, error } = await supabase.rpc('create_military_user', {
        p_mil_number: milNumber,
        p_password: password,
        p_role: role,
        p_rank: rank ? rank.toUpperCase() : '',
        p_name: name,
        p_unit: unit,
        p_phone: phone || null,
        p_cpf: cpf || null,
        p_rg: rg || null,
        p_birth_date: birthDate || null,
        p_full_name: fullName || null
      });

      if (error) {
        console.error('Registration failed via RPC:', error);
        return false;
      }

      // Atualiza a lista local de usuários se for administrador
      if (user?.role === UserRole.ADMINISTRADOR) {
        setRegisteredUsers(prev => [...prev, {
          id: data,
          role,
          milNumber,
          rank: rank ? rank.toUpperCase() : '',
          name,
          unit,
          phone,
          cpf,
          rg,
          birthDate,
          fullName,
        }]);
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    const dbUpdates = {
      ...(updates.role && { role: updates.role }),
      ...(updates.milNumber && { mil_number: updates.milNumber }),
      ...(updates.rank && { rank: updates.rank.toUpperCase() }),
      ...(updates.name && { name: updates.name }),
      ...(updates.unit && { unit: updates.unit }),
      ...('phone' in updates && { phone: updates.phone || null }),
      ...('cpf' in updates && { cpf: updates.cpf || null }),
      ...('rg' in updates && { rg: updates.rg || null }),
      ...('birthDate' in updates && { birth_date: updates.birthDate || null }),
      ...('fullName' in updates && { full_name: updates.fullName || null }),
    };

    const { error } = await supabase.from('users').update(dbUpdates).eq('id', id);
    if (!error) {
      const normalizedUpdates = {
        ...updates,
        ...(updates.rank && { rank: updates.rank.toUpperCase() })
      };
      // Update local state for fast UI refresh
      setRegisteredUsers(prev => prev.map(u => u.id === id ? { ...u, ...normalizedUpdates } : u));
      if (user?.id === id) {
        setUser(prev => prev ? { ...prev, ...normalizedUpdates } : null);
      }
    } else {
      console.error('Update failed', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      // Use RPC to securely delete from both public.users and auth.users
      const { error } = await supabase.rpc('delete_military_user', {
        p_user_id: id
      });

      if (!error) {
        setRegisteredUsers(prev => prev.filter(u => u.id !== id));
        if (user?.id === id) {
          await logout();
        }
      } else {
        console.error('Delete failed via RPC:', error);
      }
    } catch (err) {
      console.error('Unexpected error during delete:', err);
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro inesperado.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      registeredUsers, 
      login, 
      register, 
      updateUser,
      deleteUser, 
      updatePassword,
      logout, 
      isAuthenticated,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
