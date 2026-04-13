import { Router } from 'express';
import * as connectorController from './connector.controller';
import { protect, authorize } from '../../middleware/auth';

const router = Router();
router.use(protect);

// All agents can list connectors (to see channel status)
router.get('/', connectorController.list);
router.get('/:id', connectorController.detail);

// Only admins/owners can create, update, delete connectors
router.post('/', authorize('OWNER', 'ADMIN'), connectorController.create);
router.put('/:id', authorize('OWNER', 'ADMIN'), connectorController.update);
router.delete('/:id', authorize('OWNER', 'ADMIN'), connectorController.remove);

// Test connector health
router.post('/:id/test', connectorController.test);

export default router;
