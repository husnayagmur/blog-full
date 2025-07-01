import Header from '../../components/Header';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';
import { fetchBlogs } from '@/services/blogService';

const BACKEND_URL = 'http://localhost:5000';

const Bloglar = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setBlogs(data);
      } catch (err) {
        setError(err.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            >
              <img
                src={blog.imageUrl ? `${BACKEND_URL}${blog.imageUrl}` : '/default-image.jpg'} // backend’de imageUrl yoksa default resim
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{blog.description || blog.excerpt}</p>

                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>Yazar: <strong>{blog.author?.name || 'Bilinmiyor'}</strong></span>
                  <span>{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>

                <div className="flex gap-4 items-center text-gray-500 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <FaHeart className="text-red-500" />
                    <span>{blog.likeCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaComment />
                    <span>{blog.commentsCount || 0}</span>
                  </div>
                </div>

                <button className="px-4 py-2 bg-[#262610] text-white rounded hover:bg-[#3a3a24] transition">
                  Oku →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bloglar;
