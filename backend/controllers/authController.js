const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const generateRandomToken = require('../utils/generateToken');
const path = require('path');
const fs = require('fs');

// Token Oluşturma Fonksiyonu
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });
    }

    const verificationToken = generateRandomToken();

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
    });

    const verificationLink = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

    await sendEmail(
      user.email,
      "E-Posta Doğrulama",
      `<h3>Merhaba ${user.name},</h3>
      <p>Lütfen e-posta adresini doğrulamak için aşağıdaki bağlantıya tıkla:</p>
      <a href="${verificationLink}">E-postamı doğrula</a>`
    );

    res.status(201).json({
      message: 'Kayıt başarılı. E-postanı doğrulamak için mail kutunu kontrol et.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      },
      token: generateToken(user._id)
    });


  } catch (err) {
    res.status(500).json({ message: 'Kayıt işlemi sırasında bir hata oluştu.', error: err.message });
  }
};
// Giriş (Login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Lütfen önce e-posta adresinizi doğrulayın.' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Giriş sırasında hata oluştu.', error: err.message });
  }
};
//şifremi unuttum
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.' });
    }

    const resetToken = generateRandomToken();
    const resetExpire = Date.now() + 1000 * 60 * 30; 

    user.resetToken = resetToken;
    user.resetTokenExpire = resetExpire;
    await user.save();

    const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
    await sendEmail(
      user.email,
      'Şifre Sıfırlama',
      `<p>Şifreni sıfırlamak için aşağıdaki bağlantıya tıkla:</p>
       <a href="${resetLink}">Şifremi Sıfırla</a>`
    );

    res.status(200).json({
      message: 'Şifre sıfırlama bağlantısı e-posta adresine gönderildi.',
      resetToken
    });

  } catch (err) {
    res.status(500).json({ message: 'Şifre sıfırlama sırasında bir hata oluştu.', error: err.message });
  }
};
//Şifre resetleme
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token geçersiz ya da süresi dolmuş.' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Şifre başarıyla güncellendi. Giriş yapabilirsiniz.' });
  } catch (err) {
    res.status(500).json({ message: 'Şifre sıfırlama sırasında hata oluştu.', error: err.message });
  }
};
// E-posta Doğrulama
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş doğrulama bağlantısı.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'E-posta başarıyla doğrulandı. Giriş yapabilirsiniz.' });
  } catch (err) {
    res.status(500).json({ message: 'Doğrulama işlemi sırasında bir hata oluştu.', error: err.message });
  }
};

const uploadProfil = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi.' });
    }

    // Kullanıcıyı bul
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Önce eski profil varsa sil (isteğe bağlı)
    if (user.profil) {
      const oldPath = path.join(__dirname, '..', 'uploads', user.profil);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Yeni profil dosyasının ismini kaydet
    user.profil = req.file.filename;
    await user.save();

    res.status(200).json({ message: 'profil yüklendi.', profil: user.profil });
  } catch (err) {
    res.status(500).json({ message: 'profil yüklenirken hata oluştu.', error: err.message });
  }
};

const bcrypt = require('bcryptjs'); // şifre güncellenecekse gerekli

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    const { name, email, password } = req.body;

    // Metinsel alanlar
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Profil resmi güncellemesi
    if (req.file) {
     if (user.profil) {
  const oldPath = path.join(__dirname, '..', 'uploads', user.profil);
  if (fs.existsSync(oldPath)) {
    fs.unlink(oldPath, (err) => {
      if (err) {
        console.error('Dosya silinemedi:', err);
      } else {
        console.log('Eski profil resmi başarıyla silindi.');
      }
    });
  }
}


      // Yeni resmi kaydet
      user.profil = req.file.filename;
    }

    await user.save();

    res.status(200).json({
      message: 'Profil başarıyla güncellendi',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profil: user.profil || null
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Profil güncellenemedi', error: err.message });
  }
};


module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  uploadProfil,
  updateProfile
};

