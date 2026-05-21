import '@/i18n';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BillItemCard } from './BillItemCard';
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

describe('BillItemCard (refactor parity)', () => {
  it('renders name and price inputs in a card layout', () => {
    render(<BillItemCard item={makeItem()} index={0} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('Bread')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1.2')).toBeInTheDocument();
  });
});
