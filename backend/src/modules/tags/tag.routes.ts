import { Router } from 'express';
import * as tagController from './tag.controller';
import { protect } from '../../middleware/auth';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: List all tags in tenant
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: List of tags
 */
router.get('/', tagController.list);

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     responses:
 *       201:
 *         description: Tag created
 */
router.post('/', tagController.create);

/**
 * @swagger
 * /api/tags/conversation/{conversationId}:
 *   post:
 *     summary: Add tag to conversation
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Tag added
 */
router.post('/conversation/:conversationId', tagController.link);

/**
 * @swagger
 * /api/tags/conversation/{conversationId}/{tagId}:
 *   delete:
 *     summary: Remove tag from conversation
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Tag removed
 */
router.delete('/conversation/:conversationId/:tagId', tagController.unlink);

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     summary: Update tag
 *     tags: [Tags]
 *   delete:
 *     summary: Delete tag
 *     tags: [Tags]
 */
router.put('/:id', tagController.update);
router.delete('/:id', tagController.remove);

export default router;
