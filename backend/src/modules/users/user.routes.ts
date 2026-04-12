import { Router } from 'express';
import * as userController from './user.controller';
import { protect, authorize } from '../../middleware/auth';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users in tenant
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', userController.list);

/**
 * @swagger
 * /api/users/invite:
 *   post:
 *     summary: Invite a new user to the tenant
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User invited
 */
router.post('/invite', authorize('OWNER', 'ADMIN'), userController.invite);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', userController.update);

/**
 * @swagger
 * /api/users/{id}/status:
 *   put:
 *     summary: Update user online status
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [ONLINE, AWAY, BUSY, OFFLINE] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', userController.status);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deactivate user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: User deactivated
 */
router.delete('/:id', authorize('OWNER', 'ADMIN'), userController.remove);

export default router;
