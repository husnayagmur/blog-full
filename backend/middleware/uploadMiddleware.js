const multer = require('multer');
const path = require('path');

// Dosyaların kaydedileceği klasör ve isimlendirme
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

// Dosya filtreleme (isteğe bağlı, sadece resim kabul et)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
