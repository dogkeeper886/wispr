import { Request, Response, NextFunction } from 'express';
import { ruckusNBIService } from '../services/ruckus-nbi.service';
import { logger } from '../utils/logger';
import { HTTP_STATUS, NBI_REPLY_CODES } from '../utils/constants';
import { AppError } from '../middleware/error-handler';
import type { APIResponse, NBIResponse } from '../types/wispr.types';
import type {
  LoginInput,
  LoginAsyncInput,
  StatusInput,
  LogoutInput,
} from '../validators/auth.validator';

function mapNBIResponse(nbiResponse: NBIResponse): APIResponse<NBIResponse> {
  // NBI returns ResponseCode, not ReplyCode
  const responseCode = nbiResponse.ResponseCode ?? nbiResponse.ReplyCode;
  const success = responseCode === NBI_REPLY_CODES.SUCCESS;
  return {
    success,
    code: responseCode || HTTP_STATUS.OK,
    message: nbiResponse.ReplyMessage || (success ? 'Success' : 'Failed'),
    data: nbiResponse,
  };
}

export async function login(
  req: Request<object, APIResponse, LoginInput>,
  res: Response<APIResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { username, password, nbiIP, ueIP, ueMac } = req.body;

    logger.info('Login attempt', { nbiIP, ueIP, ueMac, username });

    const nbiResponse = await ruckusNBIService.login({
      nbiIP,
      ueIP,
      ueMac,
      username,
      password,
    });

    const apiResponse = mapNBIResponse(nbiResponse);

    logger.info('Login result', {
      success: apiResponse.success,
      code: apiResponse.code,
      ueIP,
    });

    res.status(HTTP_STATUS.OK).json(apiResponse);
  } catch (error) {
    logger.error('Login error', { error });
    next(new AppError('Login failed', HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
}

export async function loginAsync(
  req: Request<object, APIResponse, LoginAsyncInput>,
  res: Response<APIResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { username, password, nbiIP, ueIP, ueMac } = req.body;

    logger.info('Async login attempt', { nbiIP, ueIP, ueMac, username });

    const nbiResponse = await ruckusNBIService.loginAsync({
      nbiIP,
      ueIP,
      ueMac,
      username,
      password,
    });

    const apiResponse = mapNBIResponse(nbiResponse);

    logger.info('Async login result', {
      success: apiResponse.success,
      code: apiResponse.code,
      ueIP,
    });

    res.status(HTTP_STATUS.OK).json(apiResponse);
  } catch (error) {
    logger.error('Async login error', { error });
    next(new AppError('Async login failed', HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
}

export async function status(
  req: Request<object, APIResponse, StatusInput>,
  res: Response<APIResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { nbiIP, ueIP, ueMac } = req.body;

    logger.info('Status check', { nbiIP, ueIP, ueMac });

    const nbiResponse = await ruckusNBIService.status({
      nbiIP,
      ueIP,
      ueMac,
    });

    const apiResponse = mapNBIResponse(nbiResponse);

    res.status(HTTP_STATUS.OK).json(apiResponse);
  } catch (error) {
    logger.error('Status check error', { error });
    next(new AppError('Status check failed', HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
}

export async function logout(
  req: Request<object, APIResponse, LogoutInput>,
  res: Response<APIResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { nbiIP, ueIP, ueMac } = req.body;

    logger.info('Logout attempt', { nbiIP, ueIP, ueMac });

    const nbiResponse = await ruckusNBIService.logout({
      nbiIP,
      ueIP,
      ueMac,
    });

    const apiResponse = mapNBIResponse(nbiResponse);

    logger.info('Logout result', {
      success: apiResponse.success,
      code: apiResponse.code,
      ueIP,
    });

    res.status(HTTP_STATUS.OK).json(apiResponse);
  } catch (error) {
    logger.error('Logout error', { error });
    next(new AppError('Logout failed', HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
}
