import { Router } from 'express';
import * as merchantController from './merchant.controller'; // Import controller của merchant

const router = Router();

router.post('/login', merchantController.login);

export default router;
