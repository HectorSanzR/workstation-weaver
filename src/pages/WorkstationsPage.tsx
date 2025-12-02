import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/hooks/useInventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Laptop, Monitor, Mouse, Keyboard, Printer, Smartphone, ScanBarcode, Package, MonitorSmartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

export default function WorkstationsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [personId, setPersonId] = useState('');
  const [computerId, setComputerId] = useState('');
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [mouseId, setMouseId] = useState('');
  const [keyboardId, setKeyboardId] = useState('');
  const [comboId, setComboId] = useState('');
  const [printerId, setPrinterId] = useState('');
  const [scannerId, setScannerId] = useState('');
  const [pdaId, setPdaId] = useState('');
  const [location, setLocation] = useState('');

  const { 
    persons, 
    workstations, 
    addWorkstation, 
    deleteWorkstation, 
    getAvailableEquipment,
    getEquipmentById,
    getPersonById
  } = useInventory();

  const availableComputers = getAvailableEquipment('computer');
  const availableScreens = getAvailableEquipment('screen');
  const availableMice = getAvailableEquipment('mouse');
  const availableKeyboards = getAvailableEquipment('keyboard');
  const availableCombos = getAvailableEquipment('combo');
  const availablePrinters = getAvailableEquipment('printer');
  const availableScanners = getAvailableEquipment('scanner');
  const availablePDAs = getAvailableEquipment('pda');

  const resetForm = () => {
    setName('');
    setPersonId('');
    setComputerId('');
    setSelectedScreens([]);
    setMouseId('');
    setKeyboardId('');
    setComboId('');
    setPrinterId('');
    setScannerId('');
    setPdaId('');
    setLocation('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personId || !computerId) {
      toast.error('Debe seleccionar una persona y una computadora');
      return;
    }

    addWorkstation({
      name,
      personId,
      computerId,
      peripherals: {
        screens: selectedScreens,
        mouse: mouseId || undefined,
        keyboard: keyboardId || undefined,
        combo: comboId || undefined,
        printer: printerId || undefined,
        scanner: scannerId || undefined,
        pda: pdaId || undefined,
      },
      location: location || undefined,
    });

    resetForm();
    setFormOpen(false);
    toast.success('Puesto de trabajo creado correctamente');
  };

  const handleDelete = (id: string) => {
    deleteWorkstation(id);
    toast.success('Puesto de trabajo eliminado. Equipos liberados al inventario.');
  };

  const toggleScreen = (screenId: string) => {
    setSelectedScreens(prev => 
      prev.includes(screenId) 
        ? prev.filter(id => id !== screenId)
        : [...prev, screenId]
    );
  };

  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Laptop className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Puestos de Trabajo</h1>
              <p className="text-muted-foreground">
                {workstations.length} {workstations.length === 1 ? 'puesto configurado' : 'puestos configurados'}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setFormOpen(true)} 
            className="gap-2"
            disabled={persons.length === 0 || availableComputers.length === 0}
          >
            <Plus className="w-4 h-4" />
            Crear Puesto
          </Button>
        </div>

        {(persons.length === 0 || availableComputers.length === 0) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
            <p className="text-sm">
              {persons.length === 0 && 'Necesitas agregar personas antes de crear puestos de trabajo. '}
              {availableComputers.length === 0 && 'Necesitas agregar computadoras disponibles antes de crear puestos de trabajo.'}
            </p>
          </div>
        )}

        {workstations.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No hay puestos de trabajo configurados</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workstations.map((ws) => {
              const person = getPersonById(ws.personId);
              const computer = getEquipmentById(ws.computerId);
              
              return (
                <div key={ws.id} className="bg-card rounded-xl border border-border p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{ws.name}</h3>
                      <p className="text-sm text-muted-foreground">{person?.name}</p>
                      {ws.location && (
                        <p className="text-xs text-muted-foreground mt-1">{ws.location}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(ws.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Monitor className="w-4 h-4 text-equipment-computer" />
                      <span>{computer?.brand} {computer?.model}</span>
                    </div>

                    {ws.peripherals.screens.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <MonitorSmartphone className="w-4 h-4 text-equipment-screen mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {ws.peripherals.screens.map(screenId => {
                            const screen = getEquipmentById(screenId);
                            return (
                              <Badge key={screenId} variant="secondary" className="text-xs">
                                {screen?.brand} {screen?.model}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {ws.peripherals.mouse && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mouse className="w-4 h-4 text-equipment-mouse" />
                        <span>{getEquipmentById(ws.peripherals.mouse)?.brand}</span>
                      </div>
                    )}

                    {ws.peripherals.keyboard && (
                      <div className="flex items-center gap-2 text-sm">
                        <Keyboard className="w-4 h-4 text-equipment-keyboard" />
                        <span>{getEquipmentById(ws.peripherals.keyboard)?.brand}</span>
                      </div>
                    )}

                    {ws.peripherals.combo && (
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-equipment-combo" />
                        <span>{getEquipmentById(ws.peripherals.combo)?.brand}</span>
                      </div>
                    )}

                    {ws.peripherals.printer && (
                      <div className="flex items-center gap-2 text-sm">
                        <Printer className="w-4 h-4 text-equipment-printer" />
                        <span>{getEquipmentById(ws.peripherals.printer)?.brand}</span>
                      </div>
                    )}

                    {ws.peripherals.scanner && (
                      <div className="flex items-center gap-2 text-sm">
                        <ScanBarcode className="w-4 h-4 text-equipment-scanner" />
                        <span>{getEquipmentById(ws.peripherals.scanner)?.brand}</span>
                      </div>
                    )}

                    {ws.peripherals.pda && (
                      <div className="flex items-center gap-2 text-sm">
                        <Smartphone className="w-4 h-4 text-equipment-pda" />
                        <span>{getEquipmentById(ws.peripherals.pda)?.brand}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Puesto de Trabajo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ws-name">Nombre del Puesto</Label>
                <Input
                  id="ws-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Puesto Ventas 01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Persona Asignada</Label>
                <Select value={personId} onValueChange={setPersonId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar persona" />
                  </SelectTrigger>
                  <SelectContent>
                    {persons.map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name} - {person.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Computadora (Requerido)</Label>
                <Select value={computerId} onValueChange={setComputerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar computadora" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableComputers.map(eq => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.brand} {eq.model} - {eq.serialNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {availableScreens.length > 0 && (
                <div className="space-y-2">
                  <Label>Pantallas</Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
                    {availableScreens.map(screen => (
                      <div key={screen.id} className="flex items-center gap-2">
                        <Checkbox
                          id={screen.id}
                          checked={selectedScreens.includes(screen.id)}
                          onCheckedChange={() => toggleScreen(screen.id)}
                        />
                        <label htmlFor={screen.id} className="text-sm cursor-pointer">
                          {screen.brand} {screen.model}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {availableMice.length > 0 && (
                  <div className="space-y-2">
                    <Label>Mouse</Label>
                    <Select value={mouseId} onValueChange={setMouseId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin mouse</SelectItem>
                        {availableMice.map(eq => (
                          <SelectItem key={eq.id} value={eq.id}>
                            {eq.brand} {eq.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {availableKeyboards.length > 0 && (
                  <div className="space-y-2">
                    <Label>Teclado</Label>
                    <Select value={keyboardId} onValueChange={setKeyboardId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin teclado</SelectItem>
                        {availableKeyboards.map(eq => (
                          <SelectItem key={eq.id} value={eq.id}>
                            {eq.brand} {eq.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {availableCombos.length > 0 && (
                <div className="space-y-2">
                  <Label>Combo Mouse/Teclado</Label>
                  <Select value={comboId} onValueChange={setComboId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar combo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin combo</SelectItem>
                      {availableCombos.map(eq => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.brand} {eq.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {availablePrinters.length > 0 && (
                  <div className="space-y-2">
                    <Label>Impresora</Label>
                    <Select value={printerId} onValueChange={setPrinterId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin impresora</SelectItem>
                        {availablePrinters.map(eq => (
                          <SelectItem key={eq.id} value={eq.id}>
                            {eq.brand} {eq.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {availableScanners.length > 0 && (
                  <div className="space-y-2">
                    <Label>Lector</Label>
                    <Select value={scannerId} onValueChange={setScannerId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin lector</SelectItem>
                        {availableScanners.map(eq => (
                          <SelectItem key={eq.id} value={eq.id}>
                            {eq.brand} {eq.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {availablePDAs.length > 0 && (
                <div className="space-y-2">
                  <Label>PDA</Label>
                  <Select value={pdaId} onValueChange={setPdaId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar PDA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin PDA</SelectItem>
                      {availablePDAs.map(eq => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.brand} {eq.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación (opcional)</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Piso 2, Oficina 201"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { resetForm(); setFormOpen(false); }}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Puesto</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
