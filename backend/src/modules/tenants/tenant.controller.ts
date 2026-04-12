import { Response, NextFunction } from 'express';
import * as tenantService from './tenant.service';
import { AuthRequest } from '../../middleware/auth';

export const getSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenant = await tenantService.getTenantSettings(req.user!.tenantId);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenant = await tenantService.updateTenantSettings(req.user!.tenantId, req.body);
    res.json(tenant);
  } catch (error) {
    next(error);
  }
};
