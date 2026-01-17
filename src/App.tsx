import { Routes, Route } from 'react-router-dom';
import type { ReactElement } from 'react';

function Home(): ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Accounting App</h1>
        <p className="text-muted-foreground">
          React + TypeScript + shadcn/ui + React Router + TanStack Query
        </p>
      </div>
    </div>
  );
}

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
