import express from 'express';
const router = express.Router();
import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  getTopPosts,
  updatePost,
} from '../controllers/postController.js';
router.route('/').get(getPosts);
router.route('/:id').get(getPostById);
router.post('/', createPost);
router.delete('/:id', deletePost);
router.route('/top', getTopPosts);
router.put('/:id', updatePost);
export default router;
