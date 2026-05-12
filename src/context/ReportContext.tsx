import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChecklistSubmission } from '../types';

interface ReportContextType {
  submissions: ChecklistSubmission[];
  addSubmission: (submission: Omit<ChecklistSubmission, 'id' | 'timestamp'>) => void;
  deleteSubmission: (id: string) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<ChecklistSubmission[]>(() => {
    const saved = localStorage.getItem('fire_fleet_reports');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fire_fleet_reports', JSON.stringify(submissions));
  }, [submissions]);

  const addSubmission = (data: Omit<ChecklistSubmission, 'id' | 'timestamp'>) => {
    const newSubmission: ChecklistSubmission = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString('pt-BR'),
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  const deleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <ReportContext.Provider value={{ submissions, addSubmission, deleteSubmission }}>
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
