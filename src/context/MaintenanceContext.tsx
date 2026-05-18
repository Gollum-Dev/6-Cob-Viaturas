import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MaintenanceRecord, MaintenanceStatus, MaintenanceType, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useVehicles } from './VehicleContext';

interface MaintenanceContextType {
  records: MaintenanceRecord[];
  isLoading: boolean;
  addRecord: (record: Omit<MaintenanceRecord, 'id'>) => Promise<void>;
  updateRecord: (id: string, updates: Partial<MaintenanceRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  refreshRecords: () => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

function mapRecordFromDB(dbR: any): MaintenanceRecord {
  return {
    id: dbR.id,
    vehicleId: dbR.vehicle_id,
    type: dbR.type as MaintenanceType,
    workshop: dbR.workshop,
    date: dbR.date?.split('T')[0],
    odometerAtMaintenance: dbR.odometer_at_maintenance,
    status: dbR.status as MaintenanceStatus,
    cost: Number(dbR.cost),
    notes: dbR.notes,
    progress: dbR.progress,
    estimatedDelivery: dbR.estimated_delivery?.split('T')[0],
  };
}

function mapRecordToDB(r: Partial<MaintenanceRecord>): any {
  const dbR: any = {};
  if (r.vehicleId !== undefined) dbR.vehicle_id = r.vehicleId;
  if (r.type !== undefined) dbR.type = r.type;
  if (r.workshop !== undefined) dbR.workshop = r.workshop;
  if (r.date !== undefined) dbR.date = r.date ? new Date(r.date).toISOString() : null;
  if (r.odometerAtMaintenance !== undefined) dbR.odometer_at_maintenance = r.odometerAtMaintenance;
  if (r.status !== undefined) dbR.status = r.status;
  if (r.cost !== undefined) dbR.cost = r.cost;
  if (r.notes !== undefined) dbR.notes = r.notes;
  if (r.progress !== undefined) dbR.progress = r.progress;
  if (r.estimatedDelivery !== undefined) dbR.estimated_delivery = r.estimatedDelivery ? new Date(r.estimatedDelivery).toISOString() : null;
  return dbR;
}

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { vehicles } = useVehicles();

  const fetchRecords = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase.from('maintenance_records').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      let mapped = data.map(mapRecordFromDB);
      
      // If not ADMINISTRADOR, filter by allowed vehicles of this unit
      if (user.role !== UserRole.ADMINISTRADOR) {
        const allowedVehicleIds = new Set(vehicles.map(v => v.id));
        mapped = mapped.filter(rec => allowedVehicleIds.has(rec.vehicleId));
      }
      
      setRecords(mapped);
    } else {
      console.error('Error fetching maintenance records:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchRecords();
    } else {
      setRecords([]);
    }
  }, [isAuthenticated, user, vehicles]);

  const addRecord = async (data: Omit<MaintenanceRecord, 'id'>) => {
    const dbPayload = mapRecordToDB(data);
    const { data: inserted, error } = await supabase.from('maintenance_records').insert([dbPayload]).select().single();
    if (!error && inserted) {
      setRecords((prev) => [mapRecordFromDB(inserted), ...prev]);
    } else {
      console.error('Error adding maintenance record:', error);
      throw error;
    }
  };

  const updateRecord = async (id: string, updates: Partial<MaintenanceRecord>) => {
    const dbPayload = mapRecordToDB(updates);
    const { error } = await supabase.from('maintenance_records').update(dbPayload).eq('id', id);
    if (!error) {
      setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    } else {
      console.error('Error updating maintenance record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase.from('maintenance_records').delete().eq('id', id);
    if (!error) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } else {
      console.error('Error deleting maintenance record:', error);
      throw error;
    }
  };

  return (
    <MaintenanceContext.Provider value={{ records, isLoading, addRecord, updateRecord, deleteRecord, refreshRecords: fetchRecords }}>
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
