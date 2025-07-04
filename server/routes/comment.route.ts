import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';

const router = Router();

router.post('/create/:articleId/:authorId', commentController.createComment);
router.get('/article/:articleId', commentController.getCommentsOfArticle);

export default router;
