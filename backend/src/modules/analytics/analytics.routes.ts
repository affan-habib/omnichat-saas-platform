import { Router } from 'express';
import * as analyticsController from './analytics.controller';
import { protect, authorize } from '../../middleware/auth';
import { cacheMiddleware } from '../../middleware/cache.middleware';

const router = Router();

router.use(protect);
router.use(authorize('OWNER', 'ADMIN', 'SUPERVISOR'));

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get overall metrics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Overview stats
 */
router.get('/overview', cacheMiddleware(60), analyticsController.overview);

/**
 * @swagger
 * /api/analytics/agents:
 *   get:
 *     summary: Get per-agent performance
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Agent stats
 */
router.get('/agents', cacheMiddleware(60), analyticsController.agents);

/**
 * @swagger
 * /api/analytics/channels:
 *   get:
 *     summary: Get breakdown by channel
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Channel stats
 */
router.get('/channels', cacheMiddleware(60), analyticsController.channels);

/**
 * @swagger
 * /api/analytics/dispositions:
 *   get:
 *     summary: Get breakdown by disposition
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Disposition stats
 */
router.get('/dispositions', cacheMiddleware(60), analyticsController.dispositions);
router.get('/reports', analyticsController.getReports);

export default router;
