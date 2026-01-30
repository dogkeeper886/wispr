import { Request, Response, NextFunction } from 'express';
import { ruckusNBIService } from '../services/ruckus-nbi.service';
import { logger } from '../utils/logger';
import { HTTP_STATUS, NBI_REPLY_CODES } from '../utils/constants';
import { AppError } from '../middleware/error-handler';
import type { APIResponse, NBIResponse } from '../types/wispr.types';
import type { DisconnectInput } from '../validators/auth.validator';

function mapNBIResponse(nbiResponse: NBIResponse): APIResponse<NBIResponse> {
  const success = nbiResponse.ReplyCode === NBI_REPLY_CODES.SUCCESS;
  return {
    success,
    code: nbiResponse.ReplyCode || HTTP_STATUS.OK,
    message: nbiResponse.ReplyMessage || (success ? 'Success' : 'Failed'),
    data: nbiResponse,
  };
}

export async function disconnect(
  req: Request<object, APIResponse, DisconnectInput>,
  res: Response<APIResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { nbiIP, ueIP, ueMac } = req.body;

    logger.info('Disconnect attempt', { nbiIP, ueIP, ueMac });

    const nbiResponse = await ruckusNBIService.disconnect({
      nbiIP,
      ueIP,
      ueMac,
    });

    const apiResponse = mapNBIResponse(nbiResponse);

    logger.info('Disconnect result', {
      success: apiResponse.success,
      code: apiResponse.code,
      ueIP,
    });

    res.status(HTTP_STATUS.OK).json(apiResponse);
  } catch (error) {
    logger.error('Disconnect error', { error });
    next(new AppError('Disconnect failed', HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
}
