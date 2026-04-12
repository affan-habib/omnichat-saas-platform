import { Response, NextFunction } from 'express';
import * as messageService from './message.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const messages = await messageService.getMessages(
      req.params.conversationId, 
      req.user!.tenantId,
      req.query.limit ? parseInt(req.query.limit as string) : 50,
      req.query.cursor as string
    );
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const send = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const message = await messageService.sendMessage(
      req.params.conversationId,
      req.user!.tenantId,
      {
        ...req.body,
        senderType: req.body.senderType || 'AGENT',
        senderId: req.user!.id
      }
    );
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const message = await messageService.markAsRead(req.params.id, req.user!.tenantId);
    res.json(message);
  } catch (error) {
    next(error);
  }
};
