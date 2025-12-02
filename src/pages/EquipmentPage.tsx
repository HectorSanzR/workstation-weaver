import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EquipmentForm } from '@/components/equipment/EquipmentForm';
import { EquipmentTable } from '@/components/equipment/EquipmentTable';
import { useInventory } from '@/hooks/useInventory';
import { EquipmentType, equipmentTypeLabels } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Plus, Monitor, Printer, ScanBarcode, Smartphone, MonitorSmartphone, Mouse, Keyboard, Package } from 'lucide-react';
import { toast } from 'sonner';

const typeIcons: Record<EquipmentType, React.ElementType> = {
  computer: Monitor,
  printer: Printer,
  scanner: ScanBarcode,
  pda: Smartphone,
  screen: MonitorSmartphone,
  mouse: Mouse,
  keyboard: Keyboard,
  combo: Package,
};

export default function EquipmentPage() {
  const { type } = useParams<{ type: EquipmentType }>();
  const [formOpen, setFormOpen] = useState(false);
  const { equipment, addEquipment, deleteEquipment } = useInventory();

  if (!type || !equipmentTypeLabels[type]) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tipo de equipo no válido</p>
        </div>
      </Layout>
    );
  }

  const filteredEquipment = equipment.filter(item => item.type === type);
  const Icon = typeIcons[type];

  const handleSubmit = (data: { brand: string; model: string; serialNumber: string; notes?: string }) => {
    addEquipment({ ...data, type });
    toast.success(`${equipmentTypeLabels[type]} agregado correctamente`);
  };

  const handleDelete = (id: string) => {
    deleteEquipment(id);
    toast.success('Equipo eliminado correctamente');
  };

  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center equipment-${type}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{equipmentTypeLabels[type]}</h1>
              <p className="text-muted-foreground">
                {filteredEquipment.length} {filteredEquipment.length === 1 ? 'equipo registrado' : 'equipos registrados'}
              </p>
            </div>
          </div>
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar
          </Button>
        </div>

        <EquipmentTable 
          equipment={filteredEquipment} 
          onDelete={handleDelete}
        />

        <EquipmentForm
          type={type}
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleSubmit}
        />
      </div>
    </Layout>
  );
}
