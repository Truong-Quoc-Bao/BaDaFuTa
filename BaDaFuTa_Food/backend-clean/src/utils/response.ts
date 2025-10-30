export const ok = (data: unknown, meta?: unknown) => ({
  success: true,
  data,
  ...(meta ? { meta } : {}),
});
export const fail = (message: string, code?: string) => ({
  success: false,
  error: { message, code },
});
