import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, isAppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types/api';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';
  let details: unknown;

  if (isAppError(err)) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code || 'APP_ERROR';
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    details = err.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message,
      code: error.code,
    }));
  }

  const errorResponse: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] as string || 'unknown',
      version: '1.0.0',
    },
  };

  logger.error(`Error processing request: ${req.method} ${req.path}`, err, {
    statusCode,
    requestId: errorResponse.meta?.requestId,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'NOT_FOUND',
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] as string || 'unknown',
      version: '1.0.0',
    },
  };

  logger.warn(`Route not found: ${req.method} ${req.path}`, {
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  res.status(404).json(response);
};