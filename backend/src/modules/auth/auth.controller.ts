import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../../middleware/auth';
import prisma from '../../config/prisma';
import { notificationQueue } from '../../config/queues';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerTenant(req.body);
    
    // Offload welcome email to background queue
    await notificationQueue.add('WELCOME_EMAIL', {
      type: 'WELCOME_EMAIL',
      payload: {
        email: result.user.email,
        tenantId: result.tenant.id,
        name: result.user.name
      }
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { tenant: true }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }
    const result = await authService.changePassword(req.user!.id, currentPassword, newPassword);
    res.json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
};
