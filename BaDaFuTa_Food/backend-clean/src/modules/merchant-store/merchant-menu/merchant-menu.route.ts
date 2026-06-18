import { Router } from 'express';
import { merchantMenuController } from './merchant-menu.controller';

const router = Router();

router.get('/menu', merchantMenuController.getMenu);
router.post('/menu', merchantMenuController.addMenu);
router.put('/menu/:id', merchantMenuController.updateMenu);
router.put('/menu/:id/toggle', merchantMenuController.toggleMenu);
router.delete('/menu/:id', merchantMenuController.deleteMenu);

export default router;
