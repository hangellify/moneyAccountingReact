import '@/i18n';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { NewBillReview } from './NewBillReview';
import { useBillDraftStore } from '@/stores/billDraftStore';

function LocationProbe(): null {
  const loc = useLocation();
  useEffect(() => {
    document.body.dataset.pathname = loc.pathname;
  }, [loc.pathname]);
  return null;
}

function seedDraft(): void {
  const file = new File(['x'], 'r.jpg', { type: 'image/jpeg' });
  Object.defineProperty(file, 'size', { value: 1024 });
  useBillDraftStore.getState().setDraft(file, {
    market_name: 'Lidl',
    bill_date: '2026-05-07',
    currency: 'EUR',
    total_amount: 10,
    items: [],
    raw_extracted_text: 'LIDL',
  });
}

describe('NewBillReview', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:fake'),
      configurable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(),
      configurable: true,
    });
    useBillDraftStore.getState().clear();
  });

  it('redirects to / when the store has no draft', async () => {
    render(
      <MemoryRouter initialEntries={['/bills/review']}>
        <Routes>
          <Route path="/" element={<LocationProbe />} />
          <Route path="/bills/review" element={<NewBillReview />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(document.body.dataset.pathname).toBe('/');
    });
  });

  it('renders photo + editable fields when draft exists', () => {
    seedDraft();
    render(
      <MemoryRouter initialEntries={['/bills/review']}>
        <Routes>
          <Route path="/bills/review" element={<NewBillReview />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue('Lidl')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-05-07')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('Cancel opens a confirm dialog when fields are edited', async () => {
    seedDraft();
    render(
      <MemoryRouter initialEntries={['/bills/review']}>
        <Routes>
          <Route path="/dashboard" element={<LocationProbe />} />
          <Route path="/bills/review" element={<NewBillReview />} />
        </Routes>
      </MemoryRouter>
    );
    const marketInput = screen.getByDisplayValue('Lidl');
    await userEvent.clear(marketInput);
    await userEvent.type(marketInput, 'Rewe');

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(await screen.findByText(/discard this bill\?/i)).toBeInTheDocument();
  });
});
