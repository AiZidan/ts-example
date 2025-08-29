import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface RequestLogContext {
  method: string;
  path: string;
  query: Record<string, unknown>;
  userAgent?: string;
  ip: string;
  requestId: string;
  duration?: number;
  statusCode?: number;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  req.headers['x-request-id'] = requestId;

  const context: RequestLogContext = {
    method: req.method,
    path: req.path,
    query: req.query,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    requestId,
  };

  logger.info(`Incoming request: ${req.method} ${req.path}`, context);

  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    const logContext: RequestLogContext = {
      ...context,
      duration,
      statusCode: res.statusCode,
    };

    const logLevel = res.statusCode >= 500 ? 'error' : 
                    res.statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel](`Request completed: ${req.method} ${req.path}`, logContext);

    return originalSend.call(this, data);
  };

  next();
};