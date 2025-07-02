const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/:blogId', authMiddleware, commentController.addComment);

router.get('/',  commentController.getAllComments);

router.get('/:blogId', commentController.getCommentsByBlog);


module.exports = router;
