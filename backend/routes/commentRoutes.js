const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Yorum ekleme
router.post('/:blogId', authMiddleware, commentController.addComment);

// Tüm yorumları getirme
router.get('/', commentController.getAllComments);

// Belirli bir blog için yorumları getirme
router.get('/:blogId', commentController.getCommentsByBlog);

// Yorum silme işlemi
router.delete('/:commentId', authMiddleware, commentController.deleteComment); // Burada deleteComment fonksiyonunu ekliyoruz

module.exports = router;
