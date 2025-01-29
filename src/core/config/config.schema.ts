import { z } from 'zod';

const commaStringToArray = (input: string): string[] => {
  return input ? input.split(',').map((s) => s.trim()) : [];
};

export const appConfigSchema = z.object({
  EXCLUDED_ENDPOINTS: z.string().default('').transform(commaStringToArray),
  NODE_ENV: z.union([z.literal('development'), z.literal('production')], {
    required_error: 'NODE_ENV is required',
  }),
  SERVICE_PORT: z.coerce.string({
    required_error: 'SERVICE_PORT is required',
  }),
});

export type AppConfigSchema = z.infer<typeof appConfigSchema>;
