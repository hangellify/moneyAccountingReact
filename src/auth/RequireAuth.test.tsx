import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';

// Render a controlled tree where AuthContext is mocked at the provider boundary.
import { vi } from 'vitest';
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('@/contexts/AuthContext')>(
    '@/contexts/AuthContext',
  );
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});
import { useAuth } from '@/contexts/AuthContext';

const profile = {
  id: '1', email: 'a@b.c', first_name: 'A', currency: 'USD',
  created_at: '2026-01-01', updated_at: '2026-01-01',
} as const;

function renderAt(initial: string): void {
  render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/login" element={<div>login-page</div>} />
        <Route
          path="/dashboard"
          element={<RequireAuth><div>secret</div></RequireAuth>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAuth', () => {
  it('renders nothing while user is undefined (bootstrapping)', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: undefined });
    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>login-page</div>} />
          <Route path="/dashboard" element={<RequireAuth><div>secret</div></RequireAuth>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(container.textContent).toBe('');
  });

  it('redirects to /login when user is null', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });
    renderAt('/dashboard');
    expect(screen.getByText('login-page')).toBeInTheDocument();
  });

  it('renders children when user is a profile', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: profile });
    renderAt('/dashboard');
    expect(screen.getByText('secret')).toBeInTheDocument();
  });
});
