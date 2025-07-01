const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  let token;

  // Header'da Authorization varsa ve Bearer ile başlıyorsa
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token'ı al
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Doğrulanan token'dan kullanıcıyı bul ve request'e ekle
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Bir sonraki middleware'e geç
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Geçersiz token, yetkisiz erişim.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı, yetkisiz erişim.' });
  }
};

module.exports = authMiddleware;
