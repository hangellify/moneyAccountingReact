import type { ReactElement } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BillEditItem } from '@/types/bills';

const UNITS: BillEditItem['unit'][] = ['', 'kg', 'g', 'l', 'ml', 'piece'];

interface BillItemCardProps {
  item: BillEditItem;
  index: number;
  onChange: (patch: Partial<BillEditItem>) => void;
}

export function BillItemCard({
  item,
  index,
  onChange,
}: BillItemCardProps): ReactElement {
  const { t } = useTranslation('bills');
  const cols = t('review.items.columns', { returnObjects: true }) as Record<
    string,
    string
  >;

  return (
    <div className="rounded-md border p-3 space-y-2">
      <div className="space-y-1">
        <Label htmlFor={`item-${index}-name`}>{cols.name}</Label>
        <Input
          id={`item-${index}-name`}
          value={item.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor={`item-${index}-qty`}>{cols.quantity}</Label>
          <Input
            id={`item-${index}-qty`}
            type="number"
            step="0.001"
            value={item.quantity}
            onChange={(e) => onChange({ quantity: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`item-${index}-unit`}>{cols.unit}</Label>
          <select
            id={`item-${index}-unit`}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm"
            value={item.unit}
            onChange={(e) =>
              onChange({ unit: e.target.value as BillEditItem['unit'] })
            }
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u || '—'}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`item-${index}-price`}>{cols.finalPrice}</Label>
        <Input
          id={`item-${index}-price`}
          type="number"
          step="0.01"
          value={item.final_price}
          onChange={(e) => onChange({ final_price: Number(e.target.value) })}
        />
      </div>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {item.category_confidence < 0.5 && (
          <AlertTriangle
            className="h-4 w-4 text-yellow-600"
            aria-label={t('review.items.lowConfidence')}
          />
        )}
        <span>
          {cols.category}:{' '}
          {item.sub_category
            ? `${item.sub_category.category_name} / ${item.sub_category.name}`
            : '—'}
        </span>
      </div>
    </div>
  );
}
