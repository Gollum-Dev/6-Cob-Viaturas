import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, VehicleStatus } from '../types';

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getVehicle: (id: string) => Vehicle | undefined;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

// Dados iniciais para demonstração caso o localStorage esteja vazio
const initialVehicles: Vehicle[] = [
  { id: '1', prefix: 'AB-1024', plate: 'BRA2E24', type: 'SALVAMENTO', unit: 'ITAJUBA', status: VehicleStatus.AVAILABLE, odometer: 45230, lastOilChangeDate: '2024-03-10', lastOilChangeOdometer: 44000, tireValidityDate: '2026-12-30' },
  { id: '2', prefix: 'AS-2001', plate: 'KLO9J12', type: 'SOCORRO', unit: 'POUSO ALEGRE', status: VehicleStatus.DOWN, odometer: 128910, lastOilChangeDate: '2024-01-15', lastOilChangeOdometer: 125000, tireValidityDate: '2025-06-15' },
  { id: '3', prefix: 'UC-0045', plate: 'MPR4F88', type: 'ADMINISTRATIVO', unit: 'EXTREMA', status: VehicleStatus.DISCHARGE_AVAILABLE, odometer: 12102, lastOilChangeDate: '2023-05-20', lastOilChangeOdometer: 10000, tireValidityDate: '2027-01-01' },
  { id: '4', prefix: 'UR-1209', plate: 'PYX8G32', type: 'RESGATE', unit: 'PARAISOPOLIS', status: VehicleStatus.DISCHARGE_PROCESS, odometer: 88400, lastOilChangeDate: '2024-02-12', lastOilChangeOdometer: 85000, tireValidityDate: '2026-08-20' },
  { id: '5', prefix: 'AP-0504', plate: 'HGB2S11', type: 'APOIO', unit: 'ITAJUBA', status: VehicleStatus.AVAILABLE, odometer: 33210, lastOilChangeDate: '2024-04-05', lastOilChangeOdometer: 32000, tireValidityDate: '2025-11-10' },
];

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('fire_fleet_vehicles');
    return saved ? JSON.parse(saved) : initialVehicles;
  });

  useEffect(() => {
    localStorage.setItem('fire_fleet_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: crypto.randomUUID(),
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const updateVehicle = (id: string, vehicleData: Partial<Vehicle>) => {
    setVehicles((prev) => 
      prev.map((v) => (v.id === id ? { ...v, ...vehicleData } : v))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const getVehicle = (id: string) => {
    return vehicles.find((v) => v.id === id);
  };

  return (
    <VehicleContext.Provider value={{ 
      vehicles, 
      addVehicle, 
      updateVehicle, 
      deleteVehicle, 
      getVehicle 
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
