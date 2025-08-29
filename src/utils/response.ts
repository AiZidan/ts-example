import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types/api';

export class ResponseHelper {
  static success<T>(res: Response, data: T, statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.get('x-request-id') || 'unknown',
        version: '1.0.0',
      },
    };

    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginatedResponse<T>['pagination'],
    statusCode: number = 200
  ): Response {
    const response: PaginatedResponse<T> = {
      success: true,
      data,
      pagination,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.get('x-request-id') || 'unknown',
        version: '1.0.0',
      },
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T): Response {
    return ResponseHelper.success(res, data, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}

export const successResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  meta: {
    timestamp: new Date().toISOString(),
    requestId: 'server-generated',
    version: '1.0.0',
  },
});

export const errorResponse = (
  message: string,
  code?: string,
  details?: unknown
): ApiResponse => ({
  success: false,
  error: {
    message,
    code,
    details,
  },
  meta: {
    timestamp: new Date().toISOString(),
    requestId: 'server-generated',
    version: '1.0.0',
  },
});