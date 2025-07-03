const Category = require('../models/Category');

// Türkçe karakterleri İngilizce karşılığına çevirip küçülten normalize fonksiyonu
function normalizeCategoryName(name) {
  const map = {
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
    Ç: 'c',
    Ğ: 'g',
    Ö: 'o',
    Ş: 's',
    Ü: 'u',
  };
  return name
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('');
}

// Kategori oluştur (Admin için)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const normalizedName = normalizeCategoryName(name);

    const category = new Category({ name, slug, normalizedName });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Kategori oluşturulamadı', error: err.message });
  }
};

// Tüm kategorileri getir
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Kategoriler alınamadı', error: err.message });
  }
};

// Belirli kategoriyi isimle sil (admin)
const deleteCategory = async (req, res) => {
  try {
    const categoryName = req.params.name;
    // Silme işleminde normalize kullanabilirsin
    const normalizedName = normalizeCategoryName(categoryName);

    const deletedCategory = await Category.findOneAndDelete({ normalizedName });

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    res.json({ message: `Kategori '${categoryName}' silindi` });
  } catch (err) {
    res.status(500).json({ message: 'Kategori silinemedi', error: err.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};
