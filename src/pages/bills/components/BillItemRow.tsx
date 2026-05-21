import type { ReactElement } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import type { BillEditItem } from '@/types/bills';

const UNITS: BillEditItem['unit'][] = ['', 'kg', 'g', 'l', 'ml', 'piece'];

interface BillItemRowProps {
  item: BillEditItem;
  index: number;
  onChange: (patch: Partial<BillEditItem>) => void;
}

export function BillItemRow({
  item,
  index,
  onChange,
}: BillItemRowProps): ReactElement {
  const { t } = useTranslation('bills');
  const cols = t('review.items.columns', { returnObjects: true }) as Record<
    string,
    string
  >;
  return (
    <tr className="border-t">
      <td className="px-3 py-2">
        <Input
          value={item.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </td>
      <td className="px-3 py-2 w-28">
        <Input
          type="number"
          step="0.001"
          value={item.quantity}
          onChange={(e) => onChange({ quantity: Number(e.target.value) })}
        />
      </td>
      <td className="px-3 py-2 w-28">
        <select
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
      </td>
      <td className="px-3 py-2 w-32">
        <Input
          aria-label={cols.weightKg}
          type="number"
          step="0.001"
          disabled={item.unit !== 'kg'}
          value={item.weight_kg ?? ''}
          onChange={(e) =>
            onChange({
              weight_kg: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />
      </td>
      <td className="px-3 py-2 w-32">
        <Input
          aria-label={cols.pricePerKg}
          type="number"
          step="0.01"
          disabled={item.unit !== 'kg'}
          value={item.price_per_kg ?? ''}
          onChange={(e) =>
            onChange({
              price_per_kg:
                e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />
      </td>
      <td className="px-3 py-2 w-32">
        <Input
          data-testid={`item-final-price-${index}`}
          type="number"
          step="0.01"
          value={item.final_price}
          onChange={(e) => onChange({ final_price: Number(e.target.value) })}
        />
      </td>
      <td className="px-3 py-2 text-muted-foreground">
        <div className="flex items-center gap-1.5">
          {item.category_confidence < 0.5 && (
            <AlertTriangle
              className="h-4 w-4 text-yellow-600"
              aria-label={t('review.items.lowConfidence')}
            />
          )}
          <span>
            {item.sub_category
              ? `${item.sub_category.category_name} / ${item.sub_category.name}`
              : '—'}
          </span>
        </div>
      </td>
    </tr>
  );
}
