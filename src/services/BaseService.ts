import { BaseEntity, DeepPartial } from '../types/common';
import { QueryParams, PaginatedResponse } from '../types/api';
import { IRepository } from '../repositories/BaseRepository';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected repository: IRepository<T>) {}

  async findAll(params?: QueryParams): Promise<T[]> {
    return this.repository.findAll(params);
  }

  async findAllPaginated(params: QueryParams): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 10 } = params;
    const items = await this.repository.findAll(params);
    const total = await this.repository.count();
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    await this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, updates: DeepPartial<Omit<T, keyof BaseEntity>>): Promise<T | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    await this.validateUpdate(id, updates);
    return this.repository.update(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    await this.validateDelete(id);
    return this.repository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const entity = await this.repository.findById(id);
    return entity !== null;
  }

  protected abstract validateCreate(data: Omit<T, keyof BaseEntity>): Promise<void>;
  protected abstract validateUpdate(id: string, updates: DeepPartial<Omit<T, keyof BaseEntity>>): Promise<void>;
  protected abstract validateDelete(id: string): Promise<void>;
}