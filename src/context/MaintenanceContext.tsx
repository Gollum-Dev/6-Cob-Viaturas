import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MaintenanceRecord, MaintenanceStatus, MaintenanceType, UserRole, Commitment, CommitmentStatus, CommitmentCategory } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useVehicles } from './VehicleContext';

interface MaintenanceContextType {
  records: MaintenanceRecord[];
  commitments: Commitment[];
  isLoading: boolean;
  addRecord: (record: Omit<MaintenanceRecord, 'id'>) => Promise<void>;
  updateRecord: (id: string, updates: Partial<MaintenanceRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  refreshRecords: () => Promise<void>;
  
  // Ações de Empenho
  addCommitment: (commitment: Omit<Commitment, 'id' | 'balance' | 'createdAt'>) => Promise<void>;
  updateCommitment: (id: string, updates: Partial<Commitment>) => Promise<void>;
  deleteCommitment: (id: string) => Promise<void>;
  refreshCommitments: () => Promise<void>;
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
    servicesPerformed: dbR.services_performed,
    budgetDocument: dbR.budget_document,
    commitmentDocument: dbR.commitment_document,
    invoiceDocument: dbR.invoice_document,
    seiDocument: dbR.sei_document,
    invoiceValue: Number(dbR.invoice_value || 0),
    commitmentId: dbR.commitment_id,
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
  if (r.servicesPerformed !== undefined) dbR.services_performed = r.servicesPerformed;
  if (r.budgetDocument !== undefined) dbR.budget_document = r.budgetDocument;
  if (r.commitmentDocument !== undefined) dbR.commitment_document = r.commitmentDocument;
  if (r.invoiceDocument !== undefined) dbR.invoice_document = r.invoiceDocument;
  if (r.seiDocument !== undefined) dbR.sei_document = r.seiDocument;
  if (r.invoiceValue !== undefined) dbR.invoice_value = r.invoiceValue;
  if (r.commitmentId !== undefined) dbR.commitment_id = r.commitmentId;
  return dbR;
}

function mapCommitmentFromDB(dbC: any): Commitment {
  return {
    id: dbC.id,
    unit: dbC.unit,
    sei: dbC.sei,
    status: dbC.status as CommitmentStatus,
    category: dbC.category as CommitmentCategory,
    city: dbC.city,
    supplier: dbC.supplier,
    number: dbC.number,
    year: Number(dbC.year || new Date().getFullYear()),
    initialValue: Number(dbC.initial_value || 0),
    reinforcementValue: Number(dbC.reinforcement_value || 0),
    cancellationValue: Number(dbC.cancellation_value || 0),
    budgetedToPay: Number(dbC.budgeted_to_pay || 0),
    liquidatedValue: Number(dbC.liquidated_value || 0),
    balance: Number(dbC.balance || 0),
    createdAt: dbC.created_at,
    partDiscount: dbC.part_discount !== null && dbC.part_discount !== undefined ? Number(dbC.part_discount) : undefined,
    partTax: dbC.part_tax !== null && dbC.part_tax !== undefined ? Number(dbC.part_tax) : undefined,
    laborRate: dbC.labor_rate !== null && dbC.labor_rate !== undefined ? Number(dbC.labor_rate) : undefined,
    laborTax: dbC.labor_tax !== null && dbC.labor_tax !== undefined ? Number(dbC.labor_tax) : undefined,
  };
}

function mapCommitmentToDB(c: Partial<Commitment>): any {
  const dbC: any = {};
  if (c.unit !== undefined) dbC.unit = c.unit;
  if (c.sei !== undefined) dbC.sei = c.sei;
  if (c.status !== undefined) dbC.status = c.status;
  if (c.category !== undefined) dbC.category = c.category;
  if (c.city !== undefined) dbC.city = c.city;
  if (c.supplier !== undefined) dbC.supplier = c.supplier;
  if (c.number !== undefined) dbC.number = c.number;
  if (c.year !== undefined) dbC.year = c.year;
  if (c.initialValue !== undefined) dbC.initial_value = c.initialValue;
  if (c.reinforcementValue !== undefined) dbC.reinforcement_value = c.reinforcementValue;
  if (c.cancellationValue !== undefined) dbC.cancellation_value = c.cancellationValue;
  if (c.budgetedToPay !== undefined) dbC.budgeted_to_pay = c.budgetedToPay;
  if (c.liquidatedValue !== undefined) dbC.liquidated_value = c.liquidatedValue;
  if (c.partDiscount !== undefined) dbC.part_discount = c.partDiscount;
  if (c.partTax !== undefined) dbC.part_tax = c.partTax;
  if (c.laborRate !== undefined) dbC.labor_rate = c.laborRate;
  if (c.laborTax !== undefined) dbC.labor_tax = c.laborTax;
  return dbC;
}

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { vehicles } = useVehicles();

  const fetchRecords = async () => {
    if (!user) return;
    const { data, error } = await supabase.from('maintenance_records').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      let mapped = data.map(mapRecordFromDB);
      
      // For non-ADMIN/DEV, filter records based on their unit's vehicles
      if (user.role !== UserRole.ADMINISTRADOR && user.role !== UserRole.DESENVOLVEDOR) {
        const allowedVehicleIds = new Set(vehicles.map(v => v.id));
        mapped = mapped.filter(rec => allowedVehicleIds.has(rec.vehicleId));
      }
      
      setRecords(mapped);
    } else {
      console.error('Error fetching maintenance records:', error);
    }
  };

  const fetchCommitments = async () => {
    if (!user) return;
    const { data, error } = await supabase.from('commitments').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      let mapped = data.map(mapCommitmentFromDB);
      
      // Filtrar empenhos pela unidade do usuário se não for Admin ou Dev
      if (user.role !== UserRole.ADMINISTRADOR && user.role !== UserRole.DESENVOLVEDOR) {
        mapped = mapped.filter(c => c.unit === user.unit);
      }
      setCommitments(mapped);
    } else {
      console.error('Error fetching commitments:', error);
    }
  };

  const loadAll = async () => {
    if (!user) return;
    setIsLoading(true);
    await Promise.all([fetchRecords(), fetchCommitments()]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadAll();
    } else {
      setRecords([]);
      setCommitments([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user, vehicles]);

  const syncCommitmentLiquidatedValue = async (commitmentId: string) => {
    if (!commitmentId) return;
    try {
      const { data: recordsData, error: recordsError } = await supabase
        .from('maintenance_records')
        .select('invoice_value')
        .eq('commitment_id', commitmentId);

      if (recordsError) {
        console.error('Error fetching records for commitment sync:', recordsError);
        return;
      }

      const totalLiquidated = (recordsData || []).reduce(
        (sum, item) => sum + Number(item.invoice_value || 0),
        0
      );

      const { data: updatedCommitment, error: updateError } = await supabase
        .from('commitments')
        .update({ liquidated_value: totalLiquidated })
        .eq('id', commitmentId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating commitment liquidated value:', updateError);
        return;
      }

      if (updatedCommitment) {
        setCommitments((prev) =>
          prev.map((c) => (c.id === commitmentId ? mapCommitmentFromDB(updatedCommitment) : c))
        );
      }
    } catch (err) {
      console.error('Failed to sync commitment liquidated value:', err);
    }
  };

  const addRecord = async (data: Omit<MaintenanceRecord, 'id'>) => {
    const dbPayload = mapRecordToDB(data);
    const { data: inserted, error } = await supabase.from('maintenance_records').insert([dbPayload]).select().single();
    if (!error && inserted) {
      const mappedRecord = mapRecordFromDB(inserted);
      setRecords((prev) => [mappedRecord, ...prev]);
      if (mappedRecord.commitmentId) {
        await syncCommitmentLiquidatedValue(mappedRecord.commitmentId);
      }
    } else {
      console.error('Error adding maintenance record:', error);
      throw error;
    }
  };

  const updateRecord = async (id: string, updates: Partial<MaintenanceRecord>) => {
    const oldRecord = records.find((r) => r.id === id);
    const dbPayload = mapRecordToDB(updates);
    const { error } = await supabase.from('maintenance_records').update(dbPayload).eq('id', id);
    if (!error) {
      setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));

      const oldCommitmentId = oldRecord?.commitmentId;
      const newCommitmentId = updates.commitmentId !== undefined ? updates.commitmentId : oldCommitmentId;

      if (newCommitmentId) {
        await syncCommitmentLiquidatedValue(newCommitmentId);
      }
      if (oldCommitmentId && oldCommitmentId !== newCommitmentId) {
        await syncCommitmentLiquidatedValue(oldCommitmentId);
      }
    } else {
      console.error('Error updating maintenance record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    const recordToDelete = records.find((r) => r.id === id);
    const { error } = await supabase.from('maintenance_records').delete().eq('id', id);
    if (!error) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (recordToDelete?.commitmentId) {
        await syncCommitmentLiquidatedValue(recordToDelete.commitmentId);
      }
    } else {
      console.error('Error deleting maintenance record:', error);
      throw error;
    }
  };

  const addCommitment = async (data: Omit<Commitment, 'id' | 'balance' | 'createdAt'>) => {
    const dbPayload = mapCommitmentToDB(data);
    const { data: inserted, error } = await supabase.from('commitments').insert([dbPayload]).select().single();
    if (!error && inserted) {
      setCommitments((prev) => [mapCommitmentFromDB(inserted), ...prev]);
    } else {
      console.error('Error adding commitment:', error);
      throw error;
    }
  };

  const updateCommitment = async (id: string, updates: Partial<Commitment>) => {
    const dbPayload = mapCommitmentToDB(updates);
    const { data: updated, error } = await supabase.from('commitments').update(dbPayload).eq('id', id).select().single();
    if (!error && updated) {
      setCommitments((prev) => prev.map((c) => (c.id === id ? mapCommitmentFromDB(updated) : c)));
    } else {
      console.error('Error updating commitment:', error);
      throw error;
    }
  };

  const deleteCommitment = async (id: string) => {
    const { error } = await supabase.from('commitments').delete().eq('id', id);
    if (!error) {
      setCommitments((prev) => prev.filter((c) => c.id !== id));
    } else {
      console.error('Error deleting commitment:', error);
      throw error;
    }
  };

  return (
    <MaintenanceContext.Provider value={{ 
      records, 
      commitments, 
      isLoading, 
      addRecord, 
      updateRecord, 
      deleteRecord, 
      refreshRecords: loadAll,
      addCommitment,
      updateCommitment,
      deleteCommitment,
      refreshCommitments: fetchCommitments
    }}>
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
