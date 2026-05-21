import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoadChecklistSubmission, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface LoadChecklistContextType {
  loadSubmissions: LoadChecklistSubmission[];
  isLoading: boolean;
  addLoadSubmission: (submission: Omit<LoadChecklistSubmission, 'id' | 'timestamp'>) => Promise<void>;
  updateLoadSubmission: (id: string, updates: Partial<Omit<LoadChecklistSubmission, 'id' | 'timestamp' | 'userName' | 'userRank' | 'userMilNumber' | 'loadMapName' | 'unit' | 'vehiclePrefix'>>) => Promise<void>;
  deleteLoadSubmission: (id: string) => Promise<void>;
  refreshLoadSubmissions: () => Promise<void>;
}

const LoadChecklistContext = createContext<LoadChecklistContextType | undefined>(undefined);

function mapSubmissionFromDB(dbS: any): LoadChecklistSubmission {
  return {
    id: dbS.id,
    loadMapId: dbS.load_map_id,
    userId: dbS.user_id,
    timestamp: new Date(dbS.created_at).toLocaleString('pt-BR'),
    items: dbS.items || [],
    loadMapName: dbS.load_maps?.name || 'Mapa Desconhecido',
    unit: dbS.load_maps?.unit || 'N/A',
    vehiclePrefix: dbS.load_maps?.vehicles?.prefix || undefined,
    userName: dbS.users?.name || 'Usuário Indefinido',
    userRank: dbS.users?.rank || '',
    userMilNumber: dbS.users?.mil_number || 'N/A',
  };
}

export function LoadChecklistProvider({ children }: { children: ReactNode }) {
  const [loadSubmissions, setLoadSubmissions] = useState<LoadChecklistSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const fetchLoadSubmissions = async () => {
    if (!user) return;
    setIsLoading(true);
    
    // Fetch load maps checklists with mapping relations
    const { data, error } = await supabase
      .from('load_checklists')
      .select('*, users(name, rank, mil_number), load_maps(name, unit, vehicles(prefix))')
      .order('created_at', { ascending: false });

    if (!error && data) {
      let mapped = data.map(mapSubmissionFromDB);
      
      // If not ADMINISTRADOR and not DESENVOLVEDOR, filter by allowed maps of this unit
      if (user.role !== UserRole.ADMINISTRADOR && user.role !== UserRole.DESENVOLVEDOR) {
        mapped = mapped.filter(sub => sub.unit === user.unit);
      }
      
      setLoadSubmissions(mapped);
    } else {
      console.error('Error fetching load checklists:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchLoadSubmissions();
    } else {
      setLoadSubmissions([]);
    }
  }, [isAuthenticated, user]);

  const addLoadSubmission = async (data: Omit<LoadChecklistSubmission, 'id' | 'timestamp'>) => {
    if (!user) throw new Error("Usuário não autenticado");

    const dbPayload = {
      load_map_id: data.loadMapId,
      user_id: user.id,
      items: data.items,
    };

    const { data: inserted, error } = await supabase
      .from('load_checklists')
      .insert([dbPayload])
      .select('*, users(name, rank, mil_number), load_maps(name, unit, vehicles(prefix))')
      .single();

    if (!error && inserted) {
      setLoadSubmissions((prev) => [mapSubmissionFromDB(inserted), ...prev]);
    } else {
      console.error('Error adding load checklist:', error);
      throw error;
    }
  };

  const updateLoadSubmission = async (id: string, updates: Partial<Omit<LoadChecklistSubmission, 'id' | 'timestamp' | 'userName' | 'userRank' | 'userMilNumber' | 'loadMapName' | 'unit' | 'vehiclePrefix'>>) => {
    if (!user) throw new Error("Usuário não autenticado");

    const dbPayload: any = {};
    if (updates.items !== undefined) dbPayload.items = updates.items;

    const { data: updated, error } = await supabase
      .from('load_checklists')
      .update(dbPayload)
      .eq('id', id)
      .select('*, users(name, rank, mil_number), load_maps(name, unit, vehicles(prefix))')
      .single();

    if (!error && updated) {
      setLoadSubmissions((prev) => prev.map((s) => (s.id === id ? mapSubmissionFromDB(updated) : s)));
    } else {
      console.error('Error updating load checklist:', error);
      throw error;
    }
  };

  const deleteLoadSubmission = async (id: string) => {
    if (!user) throw new Error("Usuário não autenticado");
    
    const { error } = await supabase.from('load_checklists').delete().eq('id', id);
    if (!error) {
      setLoadSubmissions((prev) => prev.filter((s) => s.id !== id));
    } else {
      console.error('Error deleting load checklist:', error);
      throw error;
    }
  };

  return (
    <LoadChecklistContext.Provider value={{ loadSubmissions, isLoading, addLoadSubmission, updateLoadSubmission, deleteLoadSubmission, refreshLoadSubmissions: fetchLoadSubmissions }}>
      {children}
    </LoadChecklistContext.Provider>
  );
}

export function useLoadChecklists() {
  const context = useContext(LoadChecklistContext);
  if (context === undefined) {
    throw new Error('useLoadChecklists must be used within a LoadChecklistProvider');
  }
  return context;
}
