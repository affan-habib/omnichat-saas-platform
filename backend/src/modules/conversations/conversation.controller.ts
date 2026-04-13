import { Response, NextFunction } from 'express';
import * as conversationService from './conversation.service';
import { AuthRequest } from '../../middleware/auth';
import { emitToTenant, emitToConversation, SOCKET_EVENTS } from '../../socket/socket.server';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status,
      assigneeId: req.query.assigneeId,
      teamId: req.query.teamId,
      channel: req.query.channel,
      contactId: req.query.contactId,
      limit: req.query.limit,
      offset: req.query.offset,
    };
    const conversations = await conversationService.getConversations(req.user!.tenantId, filters, req.user);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const conversation = await conversationService.createConversation(req.user!.tenantId, req.body);
    res.status(201).json(conversation);
    // Notify all tenant members of a new conversation
    emitToTenant(req.user!.tenantId, SOCKET_EVENTS.CONVERSATION_NEW, conversation);
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
    // Notify tenant of assignment change
    emitToTenant(req.user!.tenantId, SOCKET_EVENTS.CONVERSATION_ASSIGNED, conversation);
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
    // Notify tenant of status change
    const event = req.body.status === 'RESOLVED' ? SOCKET_EVENTS.CONVERSATION_RESOLVED : SOCKET_EVENTS.CONVERSATION_STATUS;
    emitToTenant(req.user!.tenantId, event, conversation);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await conversationService.deleteConversation(req.params.id, req.user!.tenantId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

