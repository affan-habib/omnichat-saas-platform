import { Response, NextFunction } from 'express';
import * as auditService from './audit-log.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await auditService.getLogs(req.user!.tenantId);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
