import { Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import { AuthRequest } from '../../middleware/auth';

export const listTenants = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenants = await adminService.getAllTenants();
    res.json(tenants);
  } catch (error) { next(error); }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const tenant = await adminService.updateTenantStatus(req.params.id, status);
    res.json(tenant);
  } catch (error) { next(error); }
};

export const getOverview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getPlatformOverview();
    res.json(stats);
  } catch (error) { next(error); }
};

export const getLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await adminService.getGlobalAuditLogs();
    res.json(logs);
  } catch (error) { next(error); }
};
