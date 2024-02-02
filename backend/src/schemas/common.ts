import { z } from '@hono/zod-openapi';
import { config } from 'config';

export const passwordSchema = z.string().min(8).max(100).openapi({
  example: '12345678',
});

export const cookieSchema = z.string().openapi({
  example: `${config.slug}-session-v1=4z32pgmh91th9xigf6nlu1stptms03jdafch4khr; Expires=Wed, 06 Nov 2024 09:20:00 GMT; Path=/; Secure; HttpOnly; Domain=localhost`,
  description: 'Cookie containing the session id',
});

export const errorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.string().openapi({
    description: 'Error message localized in user language or English',
    example: 'Error',
  }),
});

export const paginationQuerySchema = z.object({
  q: z
    .string()
    .optional()
    .openapi({
      param: {
        description: 'Search query',
      },
      example: 'test',
    }),
  sort: z
    .enum(['id'])
    .optional()
    .default('id')
    .openapi({
      param: {
        description: 'Sort by',
      },
    }),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .default('asc')
    .openapi({
      param: {
        description: 'Sort order',
      },
    }),
  offset: z
    .string()
    .optional()
    .default('0')
    .refine((value) => {
      if (!Number.isNaN(Number(value)) && Number(value) >= 0) {
        return true;
      }

      return false;
    }, 'Must be a number greater than or equal to 0'),
  limit: z
    .string()
    .optional()
    .default('50')
    .refine((value) => {
      if (!Number.isNaN(Number(value)) && Number(value) > 0) {
        return true;
      }

      return false;
    }, 'Must be a number greater than 0'),
});

export const idSchema = z.string().openapi({
  example: '0eiVSdgpaHjd9v92PAxbw',
});

export const slugSchema = z.string().openapi({
  examples: ['john-doe'],
});
