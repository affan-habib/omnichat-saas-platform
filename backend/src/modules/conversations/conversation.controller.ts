import { Response, NextFunction } from 'express';
import * as conversationService from './conversation.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status,
      assigneeId: req.query.assigneeId,
      teamId: req.query.teamId,
      channel: req.query.channel,
    };
    const conversations = await conversationService.getConversations(req.user!.tenantId, filters);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const conversation = await conversationService.createConversation(req.user!.tenantId, req.body);
    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const detail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const conversation = await conversationService.getConversationById(req.params.id, req.user!.tenantId);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

export const assign = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const conversation = await conversationService.assignConversation(req.params.id, req.user!.tenantId, req.body.assigneeId);
    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

export const transfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const conversation = await conversationService.transferConversation(req.params.id, req.user!.tenantId, req.body.teamId);
    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: any = { status: req.body.status };
    if (req.body.status === 'RESOLVED') {
      data.resolvedAt = new Date();
      data.disposition = req.body.disposition;
    }
    const conversation = await conversationService.updateConversation(req.params.id, req.user!.tenantId, data);
    res.json(conversation);
  } catch (error) {
    next(error);
  }
};
