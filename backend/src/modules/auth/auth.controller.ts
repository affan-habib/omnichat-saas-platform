import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../../middleware/auth';
import prisma from '../../config/prisma';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerTenant(req.body);
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
