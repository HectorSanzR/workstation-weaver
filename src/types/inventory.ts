export type EquipmentType = 
  | 'computer' 
  | 'printer' 
  | 'scanner' 
  | 'pda' 
  | 'screen' 
  | 'mouse' 
  | 'keyboard' 
  | 'combo';

export interface Equipment {
  id: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber: string;
  status: 'available' | 'assigned' | 'maintenance';
  notes?: string;
  createdAt: Date;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  createdAt: Date;
}

export interface Workstation {
  id: string;
  name: string;
  personId: string;
  computerId: string;
  peripherals: {
    screens: string[];
    mouse?: string;
    keyboard?: string;
    combo?: string;
    printer?: string;
    scanner?: string;
    pda?: string;
  };
  location?: string;
  createdAt: Date;
}

export const equipmentTypeLabels: Record<EquipmentType, string> = {
  computer: 'Computadora',
  printer: 'Impresora',
  scanner: 'Lector de Código',
  pda: 'Equipo PDA',
  screen: 'Pantalla',
  mouse: 'Mouse',
  keyboard: 'Teclado',
  combo: 'Combo Mouse/Teclado',
};

export const equipmentTypeIcons: Record<EquipmentType, string> = {
  computer: 'Monitor',
  printer: 'Printer',
  scanner: 'ScanBarcode',
  pda: 'Smartphone',
  screen: 'MonitorSmartphone',
  mouse: 'Mouse',
  keyboard: 'Keyboard',
  combo: 'Package',
};
