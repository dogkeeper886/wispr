import { Request, Response, NextFunction } from 'express';
import { ruckusNBIService } from '../services/ruckus-nbi.service';
import { logger } from '../utils/logger';
import { HTTP_STATUS, NBI_REPLY_CODES } from '../utils/constants';
import { AppError } from '../middleware/error-handler';
import type { APIResponse, NBIResponse } from '../types/wispr.types';
import type { EncryptInput, DecryptInput } from '../validators/crypto.validator';

function mapNBIResponse(nbiResponse: NBIResponse): APIResponse<NBIResponse> {
  const success = nbiResponse.ReplyCode === NBI_REPLY_CODES.SUCCESS;
  return {
    success,
    code: nbiResponse.ReplyCode || HTTP_STATUS.OK,
    message: nbiResponse.ReplyMessage || (success ? 'Success' : 'Failed'),
    data: nbiResponse,
  };
}

export async function encrypt(
  req: Request<object, APIResponse, EncryptInput>,
  res: Response<APIResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { nbiIP, ueIP } = req.body;

    logger.info('Encrypt request', { nbiIP, ueIP });

    const nbiResponse = await ruckusNBIService.encrypt({
      nbiIP,
      ueIP,
    });

    const apiResponse = mapNBIResponse(nbiResponse);

    res.status(HTTP_STATUS.OK).json(apiResponse);
  } catch (error) {
    logger.error('Encrypt error', { error });
    next(new AppError('Encrypt failed', HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
}

export async function decrypt(
  req: Request<object, APIResponse, DecryptInput>,
  res: Response<APIResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { nbiIP, ueIP } = req.body;

    logger.info('Decrypt request', { nbiIP, ueIP });

    const nbiResponse = await ruckusNBIService.decrypt({
      nbiIP,
      ueIP,
    });

    const apiResponse = mapNBIResponse(nbiResponse);

    res.status(HTTP_STATUS.OK).json(apiResponse);
  } catch (error) {
    logger.error('Decrypt error', { error });
    next(new AppError('Decrypt failed', HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
}
