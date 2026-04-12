import { Response, NextFunction } from 'express';
import * as analyticsService from './analytics.service';
import { AuthRequest } from '../../middleware/auth';

export const overview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await analyticsService.getOverview(req.user!.tenantId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const agents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await analyticsService.getAgentStats(req.user!.tenantId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const channels = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await analyticsService.getChannelStats(req.user!.tenantId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const dispositions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await analyticsService.getDispositionStats(req.user!.tenantId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
