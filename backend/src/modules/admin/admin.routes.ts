import { Router } from 'express';
import * as adminController from './admin.controller';
import { protect, authorize } from '../../middleware/auth';

const router = Router();

// Protect all admin routes - ONLY SUPERADMIN allowed
router.use(protect);
router.use(authorize('SUPERADMIN'));

router.get('/tenants', adminController.listTenants);
router.post('/tenants', adminController.createTenant);
router.put('/tenants/:id/status', adminController.updateStatus);
router.get('/overview', adminController.getOverview);
router.get('/logs', adminController.getLogs);

export default router;
