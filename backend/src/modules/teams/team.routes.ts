import { Router } from 'express';
import * as teamController from './team.controller';
import { protect, authorize } from '../../middleware/auth';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: List all teams in tenant
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams
 */
router.get('/', teamController.list);

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Team created
 */
router.post('/', authorize('OWNER', 'ADMIN'), teamController.create);

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update team details
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Team updated
 */
router.put('/:id', authorize('OWNER', 'ADMIN'), teamController.update);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Team deleted
 */
router.delete('/:id', authorize('OWNER', 'ADMIN'), teamController.remove);

/**
 * @swagger
 * /api/teams/{id}/members:
 *   post:
 *     summary: Add member to team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Member added
 */
router.post('/:id/members', authorize('OWNER', 'ADMIN'), teamController.addMember);

/**
 * @swagger
 * /api/teams/{id}/members/{userId}:
 *   delete:
 *     summary: Remove member from team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Member removed
 */
router.delete('/:id/members/:userId', authorize('OWNER', 'ADMIN'), teamController.removeMember);

export default router;
