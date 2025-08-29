import { User } from '../models/User';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(user => user.email === email);
    return user || null;
  }

  async findByRole(role: string): Promise<User[]> {
    return this.items.filter(user => user.role === role);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.items.filter(user => user.isActive);
  }

  protected applySearch(items: User[], searchTerm: string): User[] {
    const term = searchTerm.toLowerCase();
    return items.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.profile?.bio && user.profile.bio.toLowerCase().includes(term))
    );
  }

  async updateLastLogin(id: string): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }

    return this.update(id, {
      lastLoginAt: new Date(),
    });
  }
}