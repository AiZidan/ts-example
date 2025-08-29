import { User, CreateUserInput, UpdateUserInput } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { BaseService } from './BaseService';
import { UserRole } from '../types/common';

export class UserService extends BaseService<User> {
  constructor(private userRepository: UserRepository) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.findByRole(role);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.findActiveUsers();
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    const user: Omit<User, keyof import('../types/common').BaseEntity> = {
      ...userData,
      isActive: true,
      viewCount: 0,
    };

    return this.create(user);
  }

  async updateUser(id: string, updates: UpdateUserInput): Promise<User | null> {
    return this.update(id, updates);
  }

  async deactivateUser(id: string): Promise<User | null> {
    return this.update(id, { isActive: false });
  }

  async activateUser(id: string): Promise<User | null> {
    return this.update(id, { isActive: true });
  }

  async updateLastLogin(id: string): Promise<User | null> {
    return this.userRepository.updateLastLogin(id);
  }

  async changeRole(id: string, newRole: UserRole): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }

    if (user.role === UserRole.ADMIN && newRole !== UserRole.ADMIN) {
      const adminCount = await this.userRepository.count({ role: UserRole.ADMIN });
      if (adminCount <= 1) {
        throw new Error('Cannot remove the last admin user');
      }
    }

    return this.update(id, { role: newRole });
  }

  protected async validateCreate(data: Omit<User, keyof import('../types/common').BaseEntity>): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error(`User with email ${data.email} already exists`);
    }
  }

  protected async validateUpdate(id: string, updates: Partial<Omit<User, keyof import('../types/common').BaseEntity>>): Promise<void> {
    if (updates.email) {
      const existingUser = await this.userRepository.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error(`User with email ${updates.email} already exists`);
      }
    }
  }

  protected async validateDelete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      return;
    }

    if (user.role === UserRole.ADMIN) {
      const adminCount = await this.userRepository.count({ role: UserRole.ADMIN });
      if (adminCount <= 1) {
        throw new Error('Cannot delete the last admin user');
      }
    }
  }
}