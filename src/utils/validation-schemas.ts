import { z } from 'zod';

export const IdParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
});

export const BooleanQuerySchema = z.object({
  value: z.coerce.boolean(),
});

export const SlugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export const StatusQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'archived']),
});

export const RoleQuerySchema = z.object({
  role: z.enum(['admin', 'user', 'moderator']),
});

export const TagsQuerySchema = z.object({
  tags: z
    .string()
    .transform(val => val.split(',').map(tag => tag.trim()))
    .pipe(z.array(z.string().min(1))),
});