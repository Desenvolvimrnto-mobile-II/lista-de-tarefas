import { Router } from 'express';
import { TasksController } from '../controllers/TasksController.js';

const router = Router();

router.get('/', TasksController.index);
router.get('/:id', TasksController.show);
router.post('/', TasksController.create);
router.put('/:id', TasksController.update);
router.delete('/:id', TasksController.destroy);

export default router;
