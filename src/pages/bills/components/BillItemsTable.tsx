import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { BillEditItem } from '@/types/bills';
import { BillItemRow } from './BillItemRow';
import { BillItemCard } from './BillItemCard';

interface BillItemsTableProps {
  items: BillEditItem[];
  onUpdateItem: (index: number, patch: Partial<BillEditItem>) => void;
}

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
          <BillItemCard
            key={i}
            item={item}
            index={i}
            onChange={(patch) => onUpdateItem(i, patch)}
          />
        ))}
      </div>
    </section>
  );
}
