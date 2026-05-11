export class ApiError extends Error {
  constructor(
    public status: number | undefined,
    public code: string | undefined,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
