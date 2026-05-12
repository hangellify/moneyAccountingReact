import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export function Dashboard(): ReactElement {
  const { t } = useTranslation('header');
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t('nav.dashboard')}</h1>
        </div>
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <p className="text-muted-foreground">
            {/* Placeholder — real content lands in a future spec. */}
            Dashboard content will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
