const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim zorunludur.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-posta zorunludur.'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur.'],//şifre min 6 haneli
    minlength: 6
  },
  profil: {
    type: String, // Profil resmi dosya yolu
    default: ''
  },
  bio: {
  type: String,
  default: '',
},
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetToken: String,
  resetTokenExpire: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetToken: String,
  resetTokenExpire: Date,
  verificationToken: String,

}, { timestamps: true });

// Kullanıcı kaydolmadan önce şifre hashlenir
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Şifre değişmemişse geç
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Girişte şifre karşılaştırmak için metod
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
