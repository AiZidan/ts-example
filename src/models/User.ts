import { z } from 'zod';
import { BaseEntity, UserRole } from '../types/common';

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
}

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  profile: z.object({
    bio: z.string().max(500, 'Bio too long').optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    location: z.string().max(100, 'Location too long').optional(),
    website: z.string().url('Invalid website URL').optional(),
  }).optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;