import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.post('/authenticate', userController.createOrUpdateUser);

export default router;
