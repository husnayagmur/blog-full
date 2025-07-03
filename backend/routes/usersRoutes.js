const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const authController = require('../controllers/authController');

router.get('/profile', authMiddleware, (req, res) => {
    res.json(req.user);
});

router.put(
    '/profile',
    authMiddleware,
    upload.single('profil'),
    authController.updateProfile
);

router.post('/upload-profil', authMiddleware, upload.single('profil'), authController.uploadProfil);

module.exports = router;
