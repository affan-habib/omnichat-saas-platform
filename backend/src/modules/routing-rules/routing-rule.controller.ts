import { Response, NextFunction } from 'express';
import * as ruleService from './routing-rule.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const rules = await ruleService.getRules(req.user!.tenantId);
    res.json(rules);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const rule = await ruleService.createRule(req.user!.tenantId, req.body);
    res.status(201).json(rule);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const rule = await ruleService.updateRule(req.params.id, req.user!.tenantId, req.body);
    res.json(rule);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await ruleService.deleteRule(req.params.id, req.user!.tenantId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
