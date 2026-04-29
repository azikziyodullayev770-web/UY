import { Router } from 'express';
import { createPost, getPosts, deletePost } from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getPosts);
router.post('/', authMiddleware, createPost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
