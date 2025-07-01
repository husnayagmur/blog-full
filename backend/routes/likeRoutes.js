const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:blogId', authMiddleware, likeController.toggleLike);

module.exports = router;
