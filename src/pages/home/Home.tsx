import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function Home(): React.ReactElement {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Money Accounting App
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern, efficient solution for managing your personal finances
              and tracking your expenses with ease.
            </p>
          </div>

          <div className="py-8 space-y-6">
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Track Expenses</h3>
                <p className="text-sm text-muted-foreground">
                  Keep track of all your expenses in one place. Categorize and
                  analyze your spending patterns.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Budget Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Set budgets for different categories and monitor your progress
                  towards your financial goals.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Reports & Analytics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate detailed reports and visualize your financial data
                  with interactive charts and graphs.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Tech Stack</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                React 19
              </span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                TypeScript
              </span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                shadcn/ui
              </span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                React Router
              </span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                TanStack Query
              </span>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Tailwind CSS
              </span>
            </div>
          </div>

          <div className="pt-8">
            {isAuthenticated ? (
              <Button size="lg" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <div className="flex gap-4 justify-center">
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
