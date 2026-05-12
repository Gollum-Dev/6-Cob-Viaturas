/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum VehicleStatus {
  AVAILABLE = 'DISPONÍVEL',
  DOWN = 'BAIXADA',
  DISCHARGE_PROCESS = 'PROCESSO DE DESCARGA',
  DISCHARGE_AVAILABLE = 'DISPONÍVEL PARA DESCARGA',
}

export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  CIA_OP = 'CIA OP',
  CBU = 'CBU',
  OPERACIONAL = 'OPERACIONAL',
}

export interface User {
  id: string;
  role: UserRole;
  milNumber: string;
  rank: string;
  name: string;
  unit: string;
}

export interface Vehicle {
  id: string;
  prefix: string;
  plate: string;
  type: string;
  unit: string;
  imageUrl?: string;
  status: VehicleStatus;
  odometer: number;
  lastOilChangeDate?: string;
  lastOilChangeOdometer?: number;
  nextOilChangeDate?: string;
  tireValidityDate?: string;
  lastMaintenance?: string;
  image?: string;
}

export interface ChecklistItem {
  id: string;
  description: string;
  status: 'OK' | 'X';
  observation?: string;
}

export enum MaintenanceStatus {
  COMPLETED = 'CONCLUÍDO',
  IN_PROGRESS = 'EM ANDAMENTO',
  SCHEDULED = 'AGENDADO',
}

export enum MaintenanceType {
  OIL_CHANGE = 'TROCA DE ÓLEO',
  TIRE_ROTATION = 'RODÍZIO DE PNEUS',
  TIRE_REPLACEMENT = 'SUBSTITUIÇÃO DE PNEUS',
  BRAKE_SERVICE = 'FREIOS',
  ENGINE_TUNEUP = 'MOTOR',
  ELECTRICAL = 'ELÉTRICA',
  PREVENTIVE_GENERAL = 'PREVENTIVA GERAL',
  CORRECTIVE = 'CORRETIVA',
  INSPECTION = 'VISTORIA',
}

export interface MaintenanceRecord {
  id: string;
  type: MaintenanceType;
  date: string;
  odometerAtMaintenance: number;
  workshop: string;
  status: MaintenanceStatus;
  cost: number;
  vehicleId: string;
  notes?: string;
  progress?: number;
  estimatedDelivery?: string;
}

export interface ChecklistSubmission {
  id: string;
  timestamp: string;
  vehicleId: string;
  vehiclePrefix: string;
  vehicleType: string;
  userId: string;
  userName: string;
  userRank: string;
  userMilNumber: string;
  odometer: number;
  items: { description: string; status: boolean; observation?: string }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string; // login identifier
  milNumber: string; // military number
  action: string;
  resourceType: string;
  ip: string;
  severity: 'ALERTA' | 'AVISO' | 'INFO';
}
