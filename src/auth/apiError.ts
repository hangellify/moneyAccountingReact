export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly body: unknown;

  constructor(
    status: number | undefined,
    code: string | undefined,
    message: string,
    body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
}
