import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { HTTP_STATUS } from '../utils/constants';
import type { APIResponse } from '../types/wispr.types';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<APIResponse>,
  _next: NextFunction
): void {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ZodError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      code: HTTP_STATUS.BAD_REQUEST,
      message: 'Validation error',
      data: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.statusCode,
      message: err.message,
    });
    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  });
}

export function notFoundHandler(
  req: Request,
  res: Response<APIResponse>,
  _next: NextFunction
): void {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    code: HTTP_STATUS.NOT_FOUND,
    message: `Route ${req.method} ${req.path} not found`,
  });
}
