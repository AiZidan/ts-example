import { z } from 'zod';
import { BaseEntity, PostStatus } from '../types/common';

export interface Post extends BaseEntity {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: PostStatus;
  authorId: string;
  tags: string[];
  publishedAt?: Date;
  viewCount: number;
  metadata?: PostMetadata;
}

export interface PostMetadata {
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  estimatedReadTime?: number;
}

export const CreatePostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(300, 'Excerpt too long').optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  authorId: z.string().uuid('Invalid author ID'),
  tags: z.array(z.string()).max(10, 'Too many tags').default([]),
  metadata: z.object({
    seoTitle: z.string().max(60, 'SEO title too long').optional(),
    seoDescription: z.string().max(160, 'SEO description too long').optional(),
    featuredImage: z.string().url('Invalid image URL').optional(),
  }).optional(),
});

export const UpdatePostSchema = CreatePostSchema.partial().extend({
  publishedAt: z.date().optional(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;