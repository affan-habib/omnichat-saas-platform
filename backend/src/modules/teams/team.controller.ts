import { Response, NextFunction } from 'express';
import * as teamService from './team.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const teams = await teamService.getTeams(req.user!.tenantId);
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const team = await teamService.createTeam(req.user!.tenantId, req.body);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const team = await teamService.updateTeam(req.params.id, req.user!.tenantId, req.body);
    res.json(team);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await teamService.deleteTeam(req.params.id, req.user!.tenantId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const member = await teamService.addMember(req.params.id, req.body.userId);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await teamService.removeMember(req.params.id, req.params.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
