const Like = require('../models/Like');
const Blog = require('../models/Blog');

const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.blogId;

    const existingLike = await Like.findOne({ user: userId, blog: blogId });

    if (existingLike) {
      // Beğeni varsa kaldır
      await Like.deleteOne({ _id: existingLike._id });
      await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: -1 } });
      return res.json({ liked: false, message: 'Beğeni kaldırıldı' });
    } else {
      // Beğeni yoksa ekle
      await Like.create({ user: userId, blog: blogId });
      await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: 1 } });
      return res.json({ liked: true, message: 'Beğenildi' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Beğeni işlemi başarısız', error: err.message });
  }
};

const getAllLikes = async (req, res) => {
  try {
    const likes = await Like.find()
      .populate('user', 'name email')   
      .populate('blog', 'title')         // Blogdan sadece başlık al
      .sort({ createdAt: -1 })            // En yeni beğeniler önce
      .lean();

    res.json(likes);
  } catch (err) {
    res.status(500).json({ message: 'Beğeniler alınamadı', error: err.message });
  }
};

module.exports = { toggleLike, getAllLikes };

