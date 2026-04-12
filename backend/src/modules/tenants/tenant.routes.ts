import { Router } from 'express';
import * as tenantController from './tenant.controller';
import { protect, authorize } from '../../middleware/auth';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/tenants/me:
 *   get:
 *     summary: Get current tenant settings
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tenant configuration
 */
router.get('/me', tenantController.getSettings);

/**
 * @swagger
 * /api/tenants/me:
 *   put:
 *     summary: Update tenant settings (admin/owner only)
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated tenant configuration
 */
router.put('/me', authorize('OWNER', 'ADMIN'), tenantController.updateSettings);

export default router;
