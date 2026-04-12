import { Response, NextFunction } from 'express';
import * as contactService from './contact.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const contacts = await contactService.getContacts(req.user!.tenantId, req.query.q as string);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const contact = await contactService.createContact(req.user!.tenantId, req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const detail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const contact = await contactService.getContactById(req.params.id, req.user!.tenantId);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const contact = await contactService.updateContact(req.params.id, req.user!.tenantId, req.body);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await contactService.deleteContact(req.params.id, req.user!.tenantId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
