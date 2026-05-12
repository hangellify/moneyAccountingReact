import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '@/auth/apiClient';
import { ApiError } from '@/auth/apiError';
import { billsApi } from './api';

describe('billsApi.parsePhoto', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  function makeFile(): File {
    return new File(['hello'], 'receipt.jpg', { type: 'image/jpeg' });
  }

  it('POSTs multipart/form-data with an "image" field to /bills/parse-photo', async () => {
    mock.onPost('/bills/parse-photo').reply((config) => {
      const body = config.data as FormData;
      expect(body).toBeInstanceOf(FormData);
      expect(body.get('image')).toBeInstanceOf(File);
      expect((body.get('image') as File).name).toBe('receipt.jpg');
      // axios should let the browser set the Content-Type with a boundary.
      // We assert we did NOT override it to plain 'application/json'.
      const contentType = (config.headers?.['Content-Type'] ??
        config.headers?.['content-type']) as string | undefined;
      expect(contentType === 'application/json').toBe(false);
      return [
        200,
        {
          market_name: 'Lidl',
          bill_date: '2026-05-07',
          currency: 'EUR',
          total_amount: 23.45,
          items: [],
          raw_extracted_text: 'LIDL',
        },
      ];
    });

    const result = await billsApi.parsePhoto(makeFile());

    expect(result.market_name).toBe('Lidl');
    expect(result.items).toEqual([]);
  });

  it('maps 400 responses to ApiError with the server message', async () => {
    mock.onPost('/bills/parse-photo').reply(400, {
      message: 'File too large',
      statusCode: 400,
    });

    await expect(billsApi.parsePhoto(makeFile())).rejects.toMatchObject({
      status: 400,
      message: 'File too large',
    });
    await expect(billsApi.parsePhoto(makeFile())).rejects.toBeInstanceOf(
      ApiError
    );
  });

  it('maps 502 responses to ApiError and exposes the requestId in body', async () => {
    mock.onPost('/bills/parse-photo').reply(502, {
      message: 'AI providers failed',
      requestId: 'req-abc-123',
    });

    await expect(billsApi.parsePhoto(makeFile())).rejects.toMatchObject({
      status: 502,
      body: { requestId: 'req-abc-123' },
    });
  });
});
