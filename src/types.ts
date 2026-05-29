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
  DESENVOLVEDOR = 'DESENVOLVEDOR',
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
  phone?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  fullName?: string;
  ala?: string;
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
  
  // Novos campos adicionados
  vehicleClass?: string;
  patrimony?: string;
  yearOfManufacture?: number;
  model?: string;
  documentLink?: string;
  radioModel?: string;
  radioPatrimony?: string;
  radioStatus?: string;
  frontTireModel?: string;
  rearTireModel?: string;
  vehicleValue?: number;
  marketValue?: number;
}

export interface ChecklistItem {
  id: string;
  description: string;
  status: 'OK' | 'X';
  observation?: string;
}

export enum CommitmentStatus {
  VIGENTE = 'vigente',
  FINALIZADO = 'finalizado',
}

export enum CommitmentCategory {
  LEVE = 'leve',
  PESADO = 'pesado',
}

export interface Commitment {
  id: string;
  unit: string;
  sei: string;
  status: CommitmentStatus;
  category: CommitmentCategory;
  city: string;
  supplier: string;
  number: string;
  year: number;
  initialValue: number;
  reinforcementValue: number;
  cancellationValue: number;
  budgetedToPay: number;
  liquidatedValue: number;
  balance: number;
  createdAt: string;
  partDiscount?: number;
  partTax?: number;
  laborRate?: number;
  laborTax?: number;
}

export enum MaintenanceStatus {
  CONCLUIDO = 'CONCLUIDO',
  MANUTENCAO = 'MANUTENÇÃO',
  ORCAMENTO = 'ORÇAMENTO',
  NOTA_FISCAL = 'NOTA FISCAL',
  SEI = 'SEI',
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
  servicesPerformed?: string;
  budgetDocument?: string;
  commitmentDocument?: string;
  invoiceDocument?: string;
  seiDocument?: string;
  invoiceValue?: number;
  commitmentId?: string;
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

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string | null; // null means sent to "Administrators"
  content: string;
  created_at: string;
  is_read: boolean;
  sender_name: string;
  sender_rank: string;
}

export interface LoadMap {
  id: string;
  vehicleId?: string | null;
  unit: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoadMapSector {
  id: string;
  loadMapId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoadMapItem {
  id: string;
  sectorId: string;
  name: string;
  quantity: number;
  description?: string;
  status: 'DISPONÍVEL' | 'AUSENTE' | 'MANUTENÇÃO';
  createdAt: string;
  updatedAt: string;
}

export interface LoadChecklistItem {
  itemId: string;
  name: string;
  quantity: number;
  sectorName: string;
  status: boolean; // true for OK, false for not OK/Ressalva
  observation?: string;
}

export interface LoadChecklistSubmission {
  id: string;
  timestamp: string;
  loadMapId: string;
  loadMapName: string;
  vehiclePrefix?: string;
  userId: string;
  userName: string;
  userRank: string;
  userMilNumber: string;
  unit: string;
  items: LoadChecklistItem[];
}

export enum TimeBankType {
  WORKED = 'TRABALHADA',
  OVERTIME = 'EXTRA',
  TIME_OFF = 'FOLGA',
}

export interface TimeBankRecord {
  id: string;
  userId: string;
  type: TimeBankType;
  hours: number;
  date: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
  creatorRank?: string;
  creatorName?: string;
  km?: number;
}

