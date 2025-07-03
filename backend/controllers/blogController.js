const Blog = require('../models/Blog');
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    let parsedTags = [];
    try {
      parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
    } catch {
      parsedTags = [tags];
    }
    const blog = await Blog.create({
      title,
      content,
      tags: parsedTags,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Blog oluşturulamadı', error: err.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const { tags, author, search, sort, startDate, endDate } = req.query;
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
    let filter = {};
    function slugToTag(slug) {
      return slug.toLowerCase().replace(/-/g, ' ');
    }
    function tagToSlug(tag) {
      return tag.toLowerCase().replace(/ /g, '-');
    }

    if (tags) {
      const tagList = tags.split(',').map(t => tagToSlug(t.trim()));
      filter.tags = { $in: tagList };
    }
    if (author) {
      filter.author = author;
    }
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        filter.createdAt.$lt = nextDay;
      }
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === 'popular') sortOption = { likes: -1 };

    const blogs = await Blog.find(filter)
      .populate('author', 'name email bio profil')
      .sort(sortOption)
      .lean();
    const blogsWithImages = blogs.map(blog => ({
      ...blog,
      imageUrl: blog.imageUrl
        ? (blog.imageUrl.startsWith('http') ? blog.imageUrl : `${BACKEND_URL}${blog.imageUrl}`)
        : null,
      author: {
        ...blog.author,
        avatar: blog.author.profil
          ? (blog.author.profil.startsWith('http') ? blog.author.profil : `${BACKEND_URL}${blog.author.profil}`)
          : null,
      }
    }));

    res.json(blogsWithImages);

  } catch (err) {
    res.status(500).json({ message: 'Bloglar getirilemedi', error: err.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email bio profil');
    if (!blog) return res.status(404).json({ message: 'Blog bulunamadı' });

    const blogWithFullPaths = {
      ...blog.toObject(),
      imageUrl: blog.imageUrl
        ? (blog.imageUrl.startsWith('http') ? blog.imageUrl : `${BACKEND_URL}${blog.imageUrl}`)
        : null,
      author: {
        ...blog.author.toObject(),
        avatar: blog.author.profil
          ? (blog.author.profil.startsWith('http') ? blog.author.profil : `${BACKEND_URL}${blog.author.profil}`)
          : null,
      }
    };

    res.json(blogWithFullPaths);
  } catch (err) {
    res.status(500).json({ message: 'Blog getirilemedi', error: err.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog bulunamadı' });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu blogu güncelleyemezsiniz' });
    }

    const { title, content, tags } = req.body;
    blog.title = title || blog.title;
    blog.content = content || blog.content;

    // tags gelirse parse et
    if (tags) {
      try {
        blog.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch {
        blog.tags = [tags];
      }
    }

    // ✅ Resim güncelleme kontrolü
    if (req.file) {
      blog.imageUrl = req.file.filename; // veya tam yol istersen: `uploads/${req.file.filename}`
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Blog güncellenemedi', error: err.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog bulunamadı' });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu blogu silemezsiniz' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Blog silinemedi', error: err.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
