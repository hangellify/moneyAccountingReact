import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { env } from '@/lib/env';

// Example API hook using TanStack Query
export function useExampleData(): UseQueryResult<unknown, Error> {
  return useQuery({
    queryKey: ['example'],
    queryFn: async (): Promise<unknown> => {
      // Replace with your actual API endpoint
      const response = await fetch(`${env.apiUrl}/example`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return (await response.json()) as unknown;
    },
  });
}
