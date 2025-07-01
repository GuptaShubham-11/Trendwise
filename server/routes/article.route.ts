import { Router } from 'express';
import { articleController } from '../controllers/article.controller';

const router = Router();

router.get('/all', articleController.getAllArticles);
router.post('/generate', articleController.generateArticle);

export default router;
