import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChecklistSubmission } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ReportContextType {
  submissions: ChecklistSubmission[];
  isLoading: boolean;
  addSubmission: (submission: Omit<ChecklistSubmission, 'id' | 'timestamp'>) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  refreshSubmissions: () => Promise<void>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

function mapSubmissionFromDB(dbS: any): ChecklistSubmission {
  return {
    id: dbS.id,
    vehicleId: dbS.vehicle_id,
    userId: dbS.user_id,
    timestamp: new Date(dbS.created_at).toLocaleString('pt-BR'),
    odometer: dbS.odometer,
    items: dbS.items,
    vehiclePrefix: dbS.vehicles?.prefix || 'Desconhecido',
    vehicleType: dbS.vehicles?.type || 'Desconhecido',
    userName: dbS.users?.name || 'Usuário Indefinido',
    userRank: dbS.users?.rank || '',
    userMilNumber: dbS.users?.mil_number || 'N/A',
  };
}

export function ReportProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<ChecklistSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const fetchSubmissions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('checklists')
      .select('*, users(name, rank, mil_number), vehicles(prefix, type)')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setSubmissions(data.map(mapSubmissionFromDB));
    } else {
      console.error('Error fetching checklists:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    } else {
      setSubmissions([]);
    }
  }, [isAuthenticated]);

  const addSubmission = async (data: Omit<ChecklistSubmission, 'id' | 'timestamp'>) => {
    if (!user) throw new Error("Usuário não autenticado");

    const dbPayload = {
      vehicle_id: data.vehicleId,
      user_id: user.id,
      odometer: data.odometer,
      items: data.items,
    };

    const { data: inserted, error } = await supabase
      .from('checklists')
      .insert([dbPayload])
      .select('*, users(name, rank, mil_number), vehicles(prefix, type)')
      .single();
    
    if (!error && inserted) {
      setSubmissions((prev) => [mapSubmissionFromDB(inserted), ...prev]);
    } else {
      console.error('Error adding checklist:', error);
      throw error;
    }
  };

  const deleteSubmission = async (id: string) => {
    console.error("Atenção: Passagens de Serviço são documentos imutáveis e não podem ser deletadas do banco de dados.");
    alert("Operação bloqueada por segurança. Passagens de Serviço não podem ser excluídas.");
    // No backend operation is performed
  };

  return (
    <ReportContext.Provider value={{ submissions, isLoading, addSubmission, deleteSubmission, refreshSubmissions: fetchSubmissions }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
}
