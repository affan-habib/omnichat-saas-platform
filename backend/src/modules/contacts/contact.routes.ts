import { Router } from 'express';
import * as contactController from './contact.controller';
import { protect } from '../../middleware/auth';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: List contacts with search
 *     tags: [Contacts]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search by name, email or phone
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.get('/', contactController.list);

/**
 * @swagger
 * /api/contacts/metrics:
 *   get:
 *     summary: Get CRM analytics metrics
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: CRM metrics returned
 */
router.get('/metrics', contactController.metrics);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     responses:
 *       201:
 *         description: Contact created
 */
router.post('/', contactController.create);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get contact detail with conversation history
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contact details
 */
router.get('/:id', contactController.detail);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contact updated
 */
router.put('/:id', contactController.update);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Contact deleted
 */
router.delete('/:id', contactController.remove);

export default router;
