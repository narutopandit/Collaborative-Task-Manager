import { Router } from 'express';
import { TaskController } from '../../controllers/task/controller';
import { authMiddleware } from '../../middleware/auth/middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', TaskController.create);
router.get('/', TaskController.getAll);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.remove);

export default router;
