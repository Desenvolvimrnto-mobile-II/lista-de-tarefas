import { Router } from 'express';
import users from './users.routes.js';
import tasks from './tasks.routes.js';

const router = Router();

router.use('/users', users);
router.use('/tasks', tasks);

export default router;
