import { Router } from 'express';
import * as conversationController from './conversation.controller';
import { protect } from '../../middleware/auth';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: List conversations with filters
 *     tags: [Conversations]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: assigneeId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of conversations
 */
router.get('/', conversationController.list);

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Create a new conversation manually
 *     tags: [Conversations]
 *     responses:
 *       201:
 *         description: Conversation created
 */
router.post('/', conversationController.create);

/**
 * @swagger
 * /api/conversations/{id}:
 *   get:
 *     summary: Get conversation detail with messages
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Conversation details
 */
router.get('/:id', conversationController.detail);

/**
 * @swagger
 * /api/conversations/{id}/assign:
 *   put:
 *     summary: Assign conversation to an agent
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Assigned successfully
 */
router.put('/:id/assign', conversationController.assign);

/**
 * @swagger
 * /api/conversations/{id}/transfer:
 *   put:
 *     summary: Transfer conversation to another team
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transferred successfully
 */
router.put('/:id/transfer', conversationController.transfer);

/**
 * @swagger
 * /api/conversations/{id}/status:
 *   put:
 *     summary: Update conversation status (Resolve, Reopen, etc.)
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', conversationController.updateStatus);

export default router;
