import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
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
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

const inventoryItems = [
  { icon: Monitor, label: 'Computadoras', path: '/equipment/computer' },
  { icon: Printer, label: 'Impresoras', path: '/equipment/printer' },
  { icon: ScanBarcode, label: 'Lectores', path: '/equipment/scanner' },
  { icon: Smartphone, label: 'PDAs', path: '/equipment/pda' },
  { icon: MonitorSmartphone, label: 'Pantallas', path: '/equipment/screen' },
  { icon: Mouse, label: 'Mouse', path: '/equipment/mouse' },
  { icon: Keyboard, label: 'Teclados', path: '/equipment/keyboard' },
  { icon: Package, label: 'Combos', path: '/equipment/combo' },
];

export function Sidebar() {
  const [inventoryOpen, setInventoryOpen] = useState(true);

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Laptop className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">IT Inventory</h1>
            <p className="text-xs text-muted-foreground">Gestión de Equipos</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <div className="pt-2">
          <button
            onClick={() => setInventoryOpen(!inventoryOpen)}
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
          >
            <span className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              Inventario
            </span>
            <ChevronDown className={cn('w-4 h-4 transition-transform', inventoryOpen && 'rotate-180')} />
          </button>
          
          {inventoryOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
              {inventoryItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <NavLink
          to="/persons"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )
          }
        >
          <Users className="w-5 h-5" />
          Personas
        </NavLink>

        <NavLink
          to="/workstations"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )
          }
        >
          <Laptop className="w-5 h-5" />
          Puestos de Trabajo
        </NavLink>
      </nav>
    </aside>
  );
}
