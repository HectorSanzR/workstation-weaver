import { useState, useEffect } from 'react';
import { Equipment, Person, Workstation, EquipmentType } from '@/types/inventory';

const STORAGE_KEYS = {
  equipment: 'inventory_equipment',
  persons: 'inventory_persons',
  workstations: 'inventory_workstations',
};

function loadFromStorage<T>(key: string, defaultValue: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: T & { createdAt: string }) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));
    }
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
}

export function useInventory() {
  const [equipment, setEquipment] = useState<Equipment[]>(() => 
    loadFromStorage<Equipment>(STORAGE_KEYS.equipment, [])
  );
  const [persons, setPersons] = useState<Person[]>(() => 
    loadFromStorage<Person>(STORAGE_KEYS.persons, [])
  );
  const [workstations, setWorkstations] = useState<Workstation[]>(() => 
    loadFromStorage<Workstation>(STORAGE_KEYS.workstations, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.equipment, equipment);
  }, [equipment]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.persons, persons);
  }, [persons]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.workstations, workstations);
  }, [workstations]);

  const addEquipment = (item: Omit<Equipment, 'id' | 'createdAt' | 'status'>) => {
    const newItem: Equipment = {
      ...item,
      id: crypto.randomUUID(),
      status: 'available',
      createdAt: new Date(),
    };
    setEquipment(prev => [...prev, newItem]);
    return newItem;
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const addPerson = (person: Omit<Person, 'id' | 'createdAt'>) => {
    const newPerson: Person = {
      ...person,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setPersons(prev => [...prev, newPerson]);
    return newPerson;
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    setPersons(prev => prev.map(person => 
      person.id === id ? { ...person, ...updates } : person
    ));
  };

  const deletePerson = (id: string) => {
    setPersons(prev => prev.filter(person => person.id !== id));
  };

  const addWorkstation = (workstation: Omit<Workstation, 'id' | 'createdAt'>) => {
    const newWorkstation: Workstation = {
      ...workstation,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    // Update equipment status
    const equipmentIds = [
      workstation.computerId,
      ...workstation.peripherals.screens,
      workstation.peripherals.mouse,
      workstation.peripherals.keyboard,
      workstation.peripherals.combo,
      workstation.peripherals.printer,
      workstation.peripherals.scanner,
      workstation.peripherals.pda,
    ].filter(Boolean) as string[];

    setEquipment(prev => prev.map(item => 
      equipmentIds.includes(item.id) ? { ...item, status: 'assigned' as const } : item
    ));

    setWorkstations(prev => [...prev, newWorkstation]);
    return newWorkstation;
  };

  const updateWorkstation = (id: string, updates: Partial<Workstation>) => {
    setWorkstations(prev => prev.map(ws => 
      ws.id === id ? { ...ws, ...updates } : ws
    ));
  };

  const deleteWorkstation = (id: string) => {
    const workstation = workstations.find(ws => ws.id === id);
    if (workstation) {
      const equipmentIds = [
        workstation.computerId,
        ...workstation.peripherals.screens,
        workstation.peripherals.mouse,
        workstation.peripherals.keyboard,
        workstation.peripherals.combo,
        workstation.peripherals.printer,
        workstation.peripherals.scanner,
        workstation.peripherals.pda,
      ].filter(Boolean) as string[];

      setEquipment(prev => prev.map(item => 
        equipmentIds.includes(item.id) ? { ...item, status: 'available' as const } : item
      ));
    }
    setWorkstations(prev => prev.filter(ws => ws.id !== id));
  };

  const getAvailableEquipment = (type?: EquipmentType) => {
    return equipment.filter(item => 
      item.status === 'available' && (!type || item.type === type)
    );
  };

  const getEquipmentById = (id: string) => {
    return equipment.find(item => item.id === id);
  };

  const getPersonById = (id: string) => {
    return persons.find(person => person.id === id);
  };

  const getStats = () => {
    const total = equipment.length;
    const available = equipment.filter(e => e.status === 'available').length;
    const assigned = equipment.filter(e => e.status === 'assigned').length;
    const maintenance = equipment.filter(e => e.status === 'maintenance').length;

    const byType = equipment.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<EquipmentType, number>);

    return {
      total,
      available,
      assigned,
      maintenance,
      byType,
      personsCount: persons.length,
      workstationsCount: workstations.length,
    };
  };

  return {
    equipment,
    persons,
    workstations,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    addPerson,
    updatePerson,
    deletePerson,
    addWorkstation,
    updateWorkstation,
    deleteWorkstation,
    getAvailableEquipment,
    getEquipmentById,
    getPersonById,
    getStats,
  };
}
