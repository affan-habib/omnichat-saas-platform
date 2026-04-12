import { Router } from 'express';
import * as authController from './auth.controller';
import { protect } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new tenant and owner user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, tenantName, slug]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               tenantName: { type: string }
 *               slug: { type: string }
 *     responses:
 *       201:
 *         description: Registered successfully
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to get JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 */
router.get('/me', protect, authController.getMe);

export default router;
