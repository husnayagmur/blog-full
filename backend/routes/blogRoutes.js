const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// GET
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// POST - Resim de yükleniyor
router.post('/', authMiddleware, upload.single('image'), createBlog);

// PUT, DELETE
router.put('/:id', authMiddleware, upload.single('image'), updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);


module.exports = router;
