import { Equipment, equipmentTypeLabels } from '@/types/inventory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EquipmentTableProps {
  equipment: Equipment[];
  onDelete: (id: string) => void;
  onEdit?: (equipment: Equipment) => void;
}

const statusLabels = {
  available: 'Disponible',
  assigned: 'Asignado',
  maintenance: 'Mantenimiento',
};

const statusStyles = {
  available: 'bg-green-100 text-green-700 border-green-200',
  assigned: 'bg-blue-100 text-blue-700 border-blue-200',
  maintenance: 'bg-amber-100 text-amber-700 border-amber-200',
};

export function EquipmentTable({ equipment, onDelete, onEdit }: EquipmentTableProps) {
  if (equipment.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground">No hay equipos registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Nº Serie</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{item.brand}</TableCell>
              <TableCell>{item.model}</TableCell>
              <TableCell className="font-mono text-sm">{item.serialNumber}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn('border', statusStyles[item.status])}>
                  {statusLabels[item.status]}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {item.notes || '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    disabled={item.status === 'assigned'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
