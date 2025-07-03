const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    // name, email, bio ve profil alanlarını çekiyoruz
    const users = await User.find({}, 'name email bio profil');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcılar getirilemedi', error: err.message });
  }
};

module.exports = { getAllUsers };
