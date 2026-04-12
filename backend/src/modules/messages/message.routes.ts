import { Router } from 'express';
import * as messageController from './message.controller';
import { protect } from '../../middleware/auth';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/messages/conversation/{conversationId}:
 *   get:
 *     summary: List messages in a conversation
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/conversation/:conversationId', messageController.list);

/**
 * @swagger
 * /api/messages/conversation/{conversationId}:
 *   post:
 *     summary: Send a message in a conversation
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post('/conversation/:conversationId', messageController.send);

/**
 * @swagger
 * /api/messages/{id}/read:
 *   put:
 *     summary: Mark message as read
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Marked as read
 */
router.put('/:id/read', messageController.markRead);

export default router;
