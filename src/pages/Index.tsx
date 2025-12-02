import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/hooks/useInventory';
import { equipmentTypeLabels, EquipmentType } from '@/types/inventory';
import { 
  Monitor, 
  Printer, 
  ScanBarcode, 
  Smartphone, 
  MonitorSmartphone, 
  Mouse, 
  Keyboard, 
  Package,
  Users,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

export default function Index() {
  const { getStats, equipment } = useInventory();
  const stats = getStats();

  const equipmentTypes: EquipmentType[] = [
    'computer', 'printer', 'scanner', 'pda', 'screen', 'mouse', 'keyboard', 'combo'
  ];

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Resumen del inventario de equipos TI</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Equipos</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.available}</p>
                <p className="text-sm text-muted-foreground">Disponibles</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Laptop className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.assigned}</p>
                <p className="text-sm text-muted-foreground">Asignados</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.maintenance}</p>
                <p className="text-sm text-muted-foreground">Mantenimiento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/persons" className="stat-card group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.personsCount}</p>
                <p className="text-sm text-muted-foreground">Personas Registradas</p>
              </div>
            </div>
          </Link>

          <Link to="/workstations" className="stat-card group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Laptop className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.workstationsCount}</p>
                <p className="text-sm text-muted-foreground">Puestos de Trabajo</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Equipment by Type */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Inventario por Tipo</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentTypes.map((type) => {
              const Icon = typeIcons[type];
              const count = stats.byType[type] || 0;
              const availableCount = equipment.filter(e => e.type === type && e.status === 'available').length;

              return (
                <Link
                  key={type}
                  to={`/equipment/${type}`}
                  className="stat-card group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center equipment-${type} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{equipmentTypeLabels[type]}</p>
                        <p className="text-xs text-muted-foreground">{availableCount} disponibles</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Empty state */}
        {stats.total === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Inventario Vacío</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Comienza agregando equipos al inventario usando el menú lateral. 
              Luego podrás crear puestos de trabajo y asignar periféricos.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
