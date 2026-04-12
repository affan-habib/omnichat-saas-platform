import { Response, NextFunction } from 'express';
import * as auditService from './audit-log.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { action, resource, userId, from, to } = req.query;
    const logs = await auditService.getLogs(req.user!.tenantId, { action, resource, userId, from, to });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
