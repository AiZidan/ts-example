import { Request, Response } from 'express';
import { BaseService } from '../services/BaseService';
import { BaseEntity } from '../types/common';
import { QueryParams } from '../types/api';
import { ResponseHelper } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError } from '../utils/errors';

export abstract class BaseController<T extends BaseEntity> {
  constructor(protected service: BaseService<T>) {}

  getAll = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const queryParams = req.query as QueryParams;
    
    if (queryParams.page && queryParams.limit) {
      const result = await this.service.findAllPaginated(queryParams);
      return ResponseHelper.paginated(res, result.data || [], result.pagination);
    }

    const items = await this.service.findAll(queryParams);
    return ResponseHelper.success(res, items);
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const item = await this.service.findById(id);

    if (!item) {
      throw new NotFoundError(this.getResourceName(), id);
    }

    return ResponseHelper.success(res, item);
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const item = await this.service.create(req.body);
    return ResponseHelper.created(res, item);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const item = await this.service.update(id, req.body);

    if (!item) {
      throw new NotFoundError(this.getResourceName(), id);
    }

    return ResponseHelper.success(res, item);
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const deleted = await this.service.delete(id);

    if (!deleted) {
      throw new NotFoundError(this.getResourceName(), id);
    }

    return ResponseHelper.noContent(res);
  });

  protected abstract getResourceName(): string;
}