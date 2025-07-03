const Blog = require('../models/Blog');

const getAllTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $unwind: '$tags' },                // Bloglardaki tags arrayini aç
      { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } }, // Tekil taglar
      { $project: { _id: 0, uniqueTags: 1 } }
    ]);
    res.json(tags.length > 0 ? tags[0].uniqueTags : []);
  } catch (error) {
    res.status(500).json({ message: 'Taglar alınamadı', error: error.message });
  }
};

module.exports = { getAllTags };
