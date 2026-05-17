import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, VehicleStatus } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface VehicleContextType {
  vehicles: Vehicle[];
  isLoading: boolean;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  getVehicle: (id: string) => Vehicle | undefined;
  refreshVehicles: () => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

// Helper function to map DB to React
function mapVehicleFromDB(dbV: any): Vehicle {
  return {
    id: dbV.id,
    prefix: dbV.prefix,
    plate: dbV.plate,
    type: dbV.type,
    unit: dbV.unit,
    status: dbV.status as VehicleStatus,
    odometer: dbV.odometer,
    lastOilChangeDate: dbV.last_oil_change_date?.split('T')[0],
    lastOilChangeOdometer: dbV.last_oil_change_odometer,
    nextOilChangeDate: dbV.next_oil_change_date?.split('T')[0],
    tireValidityDate: dbV.tire_validity_date?.split('T')[0],
    lastMaintenance: dbV.last_maintenance?.split('T')[0],
    imageUrl: dbV.image_url,
  };
}

// Helper to map React to DB
function mapVehicleToDB(v: Partial<Vehicle>): any {
  const dbV: any = {};
  if (v.prefix !== undefined) dbV.prefix = v.prefix;
  if (v.plate !== undefined) dbV.plate = v.plate;
  if (v.type !== undefined) dbV.type = v.type;
  if (v.unit !== undefined) dbV.unit = v.unit;
  if (v.status !== undefined) dbV.status = v.status;
  if (v.odometer !== undefined) dbV.odometer = v.odometer;
  
  if (v.lastOilChangeDate !== undefined) dbV.last_oil_change_date = v.lastOilChangeDate ? new Date(v.lastOilChangeDate).toISOString() : null;
  if (v.lastOilChangeOdometer !== undefined) dbV.last_oil_change_odometer = v.lastOilChangeOdometer;
  if (v.nextOilChangeDate !== undefined) dbV.next_oil_change_date = v.nextOilChangeDate ? new Date(v.nextOilChangeDate).toISOString() : null;
  if (v.tireValidityDate !== undefined) dbV.tire_validity_date = v.tireValidityDate ? new Date(v.tireValidityDate).toISOString() : null;
  if (v.lastMaintenance !== undefined) dbV.last_maintenance = v.lastMaintenance ? new Date(v.lastMaintenance).toISOString() : null;
  if (v.imageUrl !== undefined) dbV.image_url = v.imageUrl;

  return dbV;
}

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchVehicles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setVehicles(data.map(mapVehicleFromDB));
    } else {
      console.error('Error fetching vehicles:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchVehicles();
    } else {
      setVehicles([]);
    }
  }, [isAuthenticated]);

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    const dbPayload = mapVehicleToDB(vehicleData);
    const { data, error } = await supabase.from('vehicles').insert([dbPayload]).select().single();
    if (!error && data) {
      setVehicles((prev) => [mapVehicleFromDB(data), ...prev]);
    } else {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  };

  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    const dbPayload = mapVehicleToDB(vehicleData);
    const { error } = await supabase.from('vehicles').update(dbPayload).eq('id', id);
    if (!error) {
      setVehicles((prev) => 
        prev.map((v) => (v.id === id ? { ...v, ...vehicleData } : v))
      );
    } else {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (!error) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } else {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  };

  const getVehicle = (id: string) => {
    return vehicles.find((v) => v.id === id);
  };

  return (
    <VehicleContext.Provider value={{ 
      vehicles, 
      isLoading,
      addVehicle, 
      updateVehicle, 
      deleteVehicle, 
      getVehicle,
      refreshVehicles: fetchVehicles
    }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
}
