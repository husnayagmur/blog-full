const Comment = require('../models/Comment');

const addComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const blogId = req.params.blogId;
        const { content, parentComment } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Yorum içeriği gereklidir' });
        }

        const newComment = new Comment({
            blog: blogId,
            author: userId,
            content,
            parentComment: parentComment || null,
        });

        await newComment.save();

        res.status(201).json({ message: 'Yorum eklendi', comment: newComment });
    } catch (err) {
        console.error("Yorum ekleme hatası:", err);  // <-- Bu satırı ekle
        res.status(500).json({ message: 'Yorum eklenemedi', error: err.message });
    }
};

const getCommentsByBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;

        // Tüm yorumları çek (parentComment dahil)
        let comments = await Comment.find({ blog: blogId })
            .populate('author', 'name email')
            .sort({ createdAt: 1 })
            .lean();

        // Yorumları id bazlı eşleme
        const commentMap = {};
        comments.forEach(c => commentMap[c._id] = {...c, children: [] });

        // Ana yorumları ve yanıtları ayır
        const rootComments = [];
        comments.forEach(c => {
            if (c.parentComment) {
                // Yanıt yorum -> parentComment'ın children dizisine ekle
                commentMap[c.parentComment]?.children.push(commentMap[c._id]);
            } else {
                // Ana yorum
                rootComments.push(commentMap[c._id]);
            }
        });

        res.json(rootComments);
    } catch (err) {
        res.status(500).json({ message: 'Yorumlar getirilemedi', error: err.message });
    }
};
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'name email')
      .populate('blog', 'title')
      .sort({ createdAt: -1 })
      .lean();

    // Dilersen ağaç yapısına dönüştür
    const commentMap = {};
    comments.forEach(c => commentMap[c._id] = {...c, children: []});

    const rootComments = [];
    comments.forEach(c => {
      if (c.parentComment) {
        commentMap[c.parentComment]?.children.push(commentMap[c._id]);
      } else {
        rootComments.push(commentMap[c._id]);
      }
    });

    res.json(rootComments);
  } catch (err) {
    res.status(500).json({ message: 'Yorumlar alınamadı', error: err.message });
  }
};



module.exports = { addComment, getCommentsByBlog,getAllComments };
