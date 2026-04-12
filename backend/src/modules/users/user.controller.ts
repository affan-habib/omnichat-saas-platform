import { Response, NextFunction } from 'express';
import * as userService from './user.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers(req.user!.tenantId, req.user);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const invite = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.inviteUser(req.user!.tenantId, req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.params.id, req.user!.tenantId, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id, req.user!.tenantId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const status = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateStatus(req.params.id, req.user!.tenantId, req.body.status);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
