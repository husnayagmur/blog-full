const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

router.get('/', getAllBlogs);

router.get('/:id', getBlogById);

router.post('/', authMiddleware, createBlog);

router.put('/:id', authMiddleware, updateBlog);

router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
