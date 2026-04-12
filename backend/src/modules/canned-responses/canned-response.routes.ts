import { Router } from 'express';
import * as cannedController from './canned-response.controller';
import { protect } from '../../middleware/auth';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/canned-responses:
 *   get:
 *     summary: List canned responses
 *     tags: [Canned Responses]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of templates
 */
router.get('/', cannedController.list);

/**
 * @swagger
 * /api/canned-responses:
 *   post:
 *     summary: Create a canned response
 *     tags: [Canned Responses]
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', cannedController.create);

/**
 * @swagger
 * /api/canned-responses/{id}:
 *   put:
 *     summary: Update canned response
 *     tags: [Canned Responses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', cannedController.update);

/**
 * @swagger
 * /api/canned-responses/{id}:
 *   delete:
 *     summary: Delete canned response
 *     tags: [Canned Responses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/:id', cannedController.remove);

export default router;
