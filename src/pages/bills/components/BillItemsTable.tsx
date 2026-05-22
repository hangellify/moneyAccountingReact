import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { BillEditItem } from '@/types/bills';
import { BillItemRow } from './BillItemRow';
import { BillItemCard } from './BillItemCard';

interface BillItemsTableProps {
  items: BillEditItem[];
  onUpdateItem: (index: number, patch: Partial<BillEditItem>) => void;
  onRemoveItem: (index: number) => void;
}

export function BillItemsTable({
  items,
  onUpdateItem,
  onRemoveItem,
}: BillItemsTableProps): ReactElement {
  const { t } = useTranslation('bills');
  const cols = t('review.items.columns', { returnObjects: true }) as Record<
    string,
    string
  >;
  const [pendingDelete, setPendingDelete] = useState<{
    index: number;
    name: string;
  } | null>(null);

  const requestDelete = (index: number, item: BillEditItem): void => {
    setPendingDelete({
      index,
      name: item.name || t('review.items.deleteUnnamed'),
    });
  };

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
              <th className="px-3 py-2">{cols.weightKg}</th>
              <th className="px-3 py-2">{cols.pricePerKg}</th>
              <th className="px-3 py-2">{cols.finalPrice}</th>
              <th className="px-3 py-2">{cols.category}</th>
              <th className="px-3 py-2 w-12" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <BillItemRow
                key={i}
                item={item}
                index={i}
                onChange={(patch) => onUpdateItem(i, patch)}
                onDelete={() => requestDelete(i, item)}
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
            onDelete={() => requestDelete(i, item)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title={t('review.items.deleteTitle')}
        description={
          pendingDelete
            ? t('review.items.deleteDescription', { name: pendingDelete.name })
            : undefined
        }
        variant="destructive"
        onConfirm={() => {
          if (pendingDelete) onRemoveItem(pendingDelete.index);
          setPendingDelete(null);
        }}
      />
    </section>
  );
}
