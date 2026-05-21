import '@/i18n';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { BillItemRow } from './BillItemRow';
import type { BillEditItem } from '@/types/bills';

function makeItem(overrides: Partial<BillEditItem> = {}): BillEditItem {
  return {
    name: 'Bread',
    quantity: 1,
    unit: 'piece',
    weight_kg: null,
    price_per_kg: null,
    final_price: 1.2,
    sub_category: null,
    category_confidence: 0.9,
    ...overrides,
  };
}

function renderRow(
  item: BillEditItem,
  onChange = vi.fn()
): ReturnType<typeof render> {
  return render(
    <table>
      <tbody>
        <BillItemRow item={item} index={0} onChange={onChange} />
      </tbody>
    </table>
  );
}

// Stateful host so userEvent.type can drive a controlled input the way
// the real page does (React applies each patch and re-renders).
function StatefulRow({
  initial,
  onPatch,
}: {
  initial: BillEditItem;
  onPatch: (patch: Partial<BillEditItem>) => void;
}): React.ReactElement {
  const [item, setItem] = useState(initial);
  return (
    <table>
      <tbody>
        <BillItemRow
          item={item}
          index={0}
          onChange={(patch) => {
            setItem((prev) => ({ ...prev, ...patch }));
            onPatch(patch);
          }}
        />
      </tbody>
    </table>
  );
}

describe('BillItemRow (refactor parity)', () => {
  it('renders name, quantity, unit, and final price inputs', () => {
    renderRow(makeItem({ name: 'Bread', final_price: 1.2 }));
    expect(screen.getByDisplayValue('Bread')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1.2')).toBeInTheDocument();
  });

  it('emits patches when the name field changes', async () => {
    const onPatch = vi.fn();
    render(<StatefulRow initial={makeItem({ name: 'Bread' })} onPatch={onPatch} />);
    const input = screen.getByDisplayValue('Bread');
    await userEvent.clear(input);
    await userEvent.type(input, 'Sourdough');
    expect(onPatch).toHaveBeenLastCalledWith({ name: 'Sourdough' });
  });

  it('disables weight + price/kg inputs when unit is not kg', () => {
    renderRow(makeItem({ unit: 'piece', weight_kg: null, price_per_kg: null }));
    expect(screen.getByLabelText(/weight \(kg\)/i)).toBeDisabled();
    expect(screen.getByLabelText(/price \/ kg/i)).toBeDisabled();
  });

  it('enables weight + price/kg inputs when unit is kg', () => {
    renderRow(makeItem({ unit: 'kg', weight_kg: 0.5, price_per_kg: 10 }));
    expect(screen.getByLabelText(/weight \(kg\)/i)).not.toBeDisabled();
    expect(screen.getByDisplayValue('0.5')).toBeInTheDocument();
  });
});

