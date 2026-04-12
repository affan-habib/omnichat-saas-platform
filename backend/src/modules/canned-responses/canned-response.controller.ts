import { Response, NextFunction } from 'express';
import * as cannedService from './canned-response.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const responses = await cannedService.getCannedResponses(req.user!.tenantId, req.query.q as string);
    res.json(responses);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const response = await cannedService.createCannedResponse(req.user!.tenantId, req.body);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const response = await cannedService.updateCannedResponse(req.params.id, req.user!.tenantId, req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await cannedService.deleteCannedResponse(req.params.id, req.user!.tenantId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
