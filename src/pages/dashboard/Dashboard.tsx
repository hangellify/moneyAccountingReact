import React from 'react';

export function Dashboard(): React.ReactElement {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your financial dashboard
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">
            Dashboard content will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
