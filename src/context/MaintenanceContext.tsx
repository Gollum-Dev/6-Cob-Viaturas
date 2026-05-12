import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MaintenanceRecord, MaintenanceStatus, MaintenanceType } from '../types';

interface MaintenanceContextType {
  records: MaintenanceRecord[];
  addRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  updateRecord: (id: string, updates: Partial<MaintenanceRecord>) => void;
  deleteRecord: (id: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

const initialRecords: MaintenanceRecord[] = [
  {
    id: '1',
    vehicleId: '1', 
    type: MaintenanceType.BRAKE_SERVICE,
    workshop: 'Oficina Central',
    date: '2023-10-20',
    odometerAtMaintenance: 45000,
    status: MaintenanceStatus.IN_PROGRESS,
    cost: 4250,
    progress: 65,
    estimatedDelivery: '2023-10-23'
  },
  {
    id: '2',
    vehicleId: '2', 
    type: MaintenanceType.ELECTRICAL,
    workshop: 'Auto Elétrica Wagner',
    date: '2023-10-21',
    odometerAtMaintenance: 32000,
    status: MaintenanceStatus.IN_PROGRESS,
    cost: 890,
    progress: 40,
    estimatedDelivery: '2023-10-22'
  }
];

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('fire_fleet_maintenance');
    return saved ? JSON.parse(saved) : initialRecords;
  });

  useEffect(() => {
    localStorage.setItem('fire_fleet_maintenance', JSON.stringify(records));
  }, [records]);

  const addRecord = (data: Omit<MaintenanceRecord, 'id'>) => {
    const newRecord: MaintenanceRecord = {
      ...data,
      id: crypto.randomUUID(),
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const updateRecord = (id: string, updates: Partial<MaintenanceRecord>) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <MaintenanceContext.Provider value={{ records, addRecord, updateRecord, deleteRecord }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}
