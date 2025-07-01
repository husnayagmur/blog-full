const Blog = require('../Blog-Backend-/models/Blog');
const createBlog = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        const blog = await Blog.create({
            title,
            content,
            tags,
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
            .populate('author', 'name email')
            .sort(sortOption);

        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Bloglar getirilemedi', error: err.message });
    }
};


const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name email');
        if (!blog) return res.status(404).json({ message: 'Blog bulunamadı' });
        res.json(blog);
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
        blog.tags = tags || blog.tags;

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
