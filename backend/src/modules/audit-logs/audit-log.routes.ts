import { Router } from 'express';
import * as auditController from './audit-log.controller';
import { protect } from '../../middleware/auth';

const router = Router();

router.get('/', protect, auditController.list);

export default router;
