import asyncHandler from '../middleware/asyncHandler.js';
import Post from '../models/postModel.js';
// import { ContactSchema } from "../schemas/Contact.js";
// @desc  Fetch all posts
// @route GET /api/posts
// @acess public
const createPost = asyncHandler(async (req, res) => {
  const { name, image, content } = req.body;

  const post = await Post.create({
    name,
    image,
    content,
  });
  return res.json({
    message: 'Thêm bài viết thành công',
    post,
  });
});

const getPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// @desc  Fetch a posts
// @route GET /api/posts/:id
// @acess public

const getPostById = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({
        message: 'Không tìm thấy bài viết',
      });
    }
    return res.json({
      message: 'Lấy bài viết thành công',
      post,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});
const deletePost = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(400).json({
        message: 'Không tìm thấy bài viết',
      });
    }

    return res.json({
      message: 'Xóa bài viết thành công',
      post,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});
const updatePost = asyncHandler(async (req, res) => {
  const { name, image, content } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    post.name = name;
    post.image = image;
    post.content = content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});
const getTopPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).sort({ rating: -1 }).limit(3);

  res.json(posts);
});
export {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  getTopPosts,
  updatePost,
};
