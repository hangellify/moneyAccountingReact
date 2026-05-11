import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactElement } from 'react';

export function RequireAuth({
  children,
}: {
  children: ReactElement;
}): ReactElement | null {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) return null;
  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
