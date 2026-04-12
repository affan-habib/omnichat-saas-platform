import { Response, NextFunction } from 'express';
import * as tagService from './tag.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tags = await tagService.getTags(req.user!.tenantId);
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tag = await tagService.createTag(req.user!.tenantId, req.body);
    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

export const link = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await tagService.addTagToConversation(req.params.conversationId, req.body.tagId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const unlink = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await tagService.removeTagFromConversation(req.params.conversationId, req.params.tagId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
