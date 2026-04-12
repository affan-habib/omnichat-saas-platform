import { Router } from 'express';
import * as routingRuleController from './routing-rule.controller'; // wait I named it routing-rule.controller.ts
import { protect, authorize } from '../../middleware/auth';

const router = Router();

router.use(protect);
router.use(authorize('OWNER', 'ADMIN'));

/**
 * @swagger
 * /api/routing-rules:
 *   get:
 *     summary: List routing rules
 *     tags: [Routing Rules]
 *     responses:
 *       200:
 *         description: List of rules
 */
router.get('/', routingRuleController.list);

/**
 * @swagger
 * /api/routing-rules:
 *   post:
 *     summary: Create a routing rule
 *     tags: [Routing Rules]
 *     responses:
 *       201:
 *         description: Rule created
 */
router.post('/', routingRuleController.create);

/**
 * @swagger
 * /api/routing-rules/{id}:
 *   put:
 *     summary: Update routing rule
 *     tags: [Routing Rules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Rule updated
 */
router.put('/:id', routingRuleController.update);

/**
 * @swagger
 * /api/routing-rules/{id}:
 *   delete:
 *     summary: Delete routing rule
 *     tags: [Routing Rules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Rule deleted
 */
router.delete('/:id', routingRuleController.remove);

export default router;
