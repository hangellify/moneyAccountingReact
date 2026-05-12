import { apiClient } from '@/auth/apiClient';
import { BILLS_ENDPOINTS } from '@/const/bills';
import type { ParsedBillResponse } from '@/types/bills';
import type { AxiosRequestConfig } from 'axios';

export const billsApi = {
  parsePhoto: async (file: File): Promise<ParsedBillResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    // Override the instance-level 'Content-Type: application/json' so axios
    // (and the browser) set 'multipart/form-data; boundary=…' automatically.
    const config = {
      headers: { 'Content-Type': undefined },
    } as unknown as AxiosRequestConfig;
    const { data } = await apiClient.post<ParsedBillResponse>(
      BILLS_ENDPOINTS.PARSE_PHOTO,
      formData,
      config
    );
    return data;
  },
};
