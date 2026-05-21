import type { ReactElement } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BillEditItem } from '@/types/bills';
import { BillItemRow } from './BillItemRow';

interface BillItemsTableProps {
  items: BillEditItem[];
  onUpdateItem: (index: number, patch: Partial<BillEditItem>) => void;
}

const UNITS: BillEditItem['unit'][] = ['', 'kg', 'g', 'l', 'ml', 'piece'];

export function BillItemsTable({
  items,
  onUpdateItem,
}: BillItemsTableProps): ReactElement {
  const { t } = useTranslation('bills');
  const cols = t('review.items.columns', { returnObjects: true }) as Record<
    string,
    string
  >;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{t('review.items.heading')}</h2>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-md border md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">{cols.name}</th>
              <th className="px-3 py-2">{cols.quantity}</th>
              <th className="px-3 py-2">{cols.unit}</th>
              <th className="px-3 py-2">{cols.finalPrice}</th>
              <th className="px-3 py-2">{cols.category}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <BillItemRow
                key={i}
                item={item}
                index={i}
                onChange={(patch) => onUpdateItem(i, patch)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((item, i) => (
          <div key={i} className="rounded-md border p-3 space-y-2">
            <div className="space-y-1">
              <Label htmlFor={`item-${i}-name`}>{cols.name}</Label>
              <Input
                id={`item-${i}-name`}
                value={item.name}
                onChange={(e) => onUpdateItem(i, { name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor={`item-${i}-qty`}>{cols.quantity}</Label>
                <Input
                  id={`item-${i}-qty`}
                  type="number"
                  step="0.001"
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdateItem(i, { quantity: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`item-${i}-unit`}>{cols.unit}</Label>
                <select
                  id={`item-${i}-unit`}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm"
                  value={item.unit}
                  onChange={(e) =>
                    onUpdateItem(i, {
                      unit: e.target.value as BillEditItem['unit'],
                    })
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
              <Label htmlFor={`item-${i}-price`}>{cols.finalPrice}</Label>
              <Input
                id={`item-${i}-price`}
                type="number"
                step="0.01"
                value={item.final_price}
                onChange={(e) =>
                  onUpdateItem(i, { final_price: Number(e.target.value) })
                }
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
        ))}
      </div>
    </section>
  );
}
