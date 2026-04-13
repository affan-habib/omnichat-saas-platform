import { Response, NextFunction } from 'express';
import * as connectorService from './connector.service';
import { AuthRequest } from '../../middleware/auth';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const connectors = await connectorService.listConnectors(req.user!.tenantId);
    res.json(connectors);
  } catch (error) { next(error); }
};

export const detail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const connector = await connectorService.getConnector(req.params.id, req.user!.tenantId);
    if (!connector) return res.status(404).json({ error: 'Connector not found' });
    res.json(connector);
  } catch (error) { next(error); }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const connector = await connectorService.createConnector(req.user!.tenantId, req.body);
    res.status(201).json(connector);
  } catch (error) { next(error); }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const connector = await connectorService.updateConnector(req.params.id, req.user!.tenantId, req.body);
    res.json(connector);
  } catch (error) { next(error); }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await connectorService.deleteConnector(req.params.id, req.user!.tenantId);
    res.status(204).send();
  } catch (error) { next(error); }
};

export const test = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await connectorService.testConnector(req.params.id, req.user!.tenantId);
    if (!result) return res.status(404).json({ error: 'Connector not found' });
    res.json(result);
  } catch (error) { next(error); }
};
