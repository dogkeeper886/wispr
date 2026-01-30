import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { HTTP_STATUS } from '../utils/constants';
import type { APIResponse } from '../types/wispr.types';

export function validate<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response<APIResponse>, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        code: HTTP_STATUS.BAD_REQUEST,
        message: 'Validation error',
        data: result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
