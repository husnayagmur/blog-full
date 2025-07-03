const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require('../controllers/categoryController');

// Kategorileri getir
router.get('/', getCategories);

// Admin kategori oluşturabilir
router.post('/', createCategory);

// Admin kategori silebilir
router.delete('/:name', deleteCategory);

module.exports = router;
