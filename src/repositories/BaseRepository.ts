import { BaseEntity, DeepPartial } from '../types/common';
import { QueryParams } from '../types/api';

export interface IRepository<T extends BaseEntity> {
  findAll(params?: QueryParams): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: Omit<T, keyof BaseEntity>): Promise<T>;
  update(id: string, updates: DeepPartial<Omit<T, keyof BaseEntity>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filters?: Record<string, unknown>): Promise<number>;
}

export abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected items: T[] = [];
  private idCounter = 1;

  protected generateId(): string {
    return `${Date.now()}-${this.idCounter++}`;
  }

  protected createBaseEntity(): Pick<BaseEntity, 'id' | 'createdAt' | 'updatedAt'> {
    const now = new Date();
    return {
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };
  }

  async findAll(params?: QueryParams): Promise<T[]> {
    let result = [...this.items];

    if (params?.search) {
      result = this.applySearch(result, params.search);
    }

    if (params?.sort) {
      result = this.applySorting(result, params.sort, params.order || 'asc');
    }

    if (params?.page && params?.limit) {
      const start = (params.page - 1) * params.limit;
      const end = start + params.limit;
      result = result.slice(start, end);
    }

    return result;
  }

  async findById(id: string): Promise<T | null> {
    const item = this.items.find(item => item.id === id);
    return item || null;
  }

  async create(entityData: Omit<T, keyof BaseEntity>): Promise<T> {
    const entity = {
      ...this.createBaseEntity(),
      ...entityData,
    } as T;

    this.items.push(entity);
    return entity;
  }

  async update(id: string, updates: DeepPartial<Omit<T, keyof BaseEntity>>): Promise<T | null> {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      return null;
    }

    const updatedItem = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date(),
    } as T;

    this.items[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }

  async count(filters?: Record<string, unknown>): Promise<number> {
    if (!filters) {
      return this.items.length;
    }

    return this.items.filter(item => 
      Object.entries(filters).every(([key, value]) => 
        (item as Record<string, unknown>)[key] === value
      )
    ).length;
  }

  protected abstract applySearch(items: T[], searchTerm: string): T[];

  protected applySorting(items: T[], sortBy: string, order: 'asc' | 'desc'): T[] {
    return items.sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortBy];
      const bValue = (b as Record<string, unknown>)[sortBy];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}