import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Header } from '@/components/Header';

// Lazy load pages
const Home = lazy(() =>
  import('@/pages/home/Home').then((m) => ({ default: m.Home }))
);
const Dashboard = lazy(() =>
  import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const Login = lazy(() =>
  import('@/pages/auth/Login').then((m) => ({ default: m.Login }))
);
const Register = lazy(() =>
  import('@/pages/auth/Register').then((m) => ({ default: m.Register }))
);

function LoadingFallback(): ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App(): ReactElement {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
