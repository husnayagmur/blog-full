import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/AdminLayout';

const API_BASE = 'http://localhost:5000/api'; // .env'den alabilirsin

export default function BlogYonetimi() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error('Blogları alma hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = async () => {
    try {
      const token = localStorage.getItem('token'); // admin token
      const res = await axios.post(
        `${API_BASE}/blogs`,
        {
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs([res.data, ...blogs]);
      setTitle('');
      setContent('');
      setTags('');
    } catch (err) {
      console.error('Blog ekleme hatası:', err);
      alert(err?.response?.data?.message || 'Hata oluştu');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Bu blogu silmek istediğinize emin misiniz?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (err) {
      console.error('Silme hatası:', err);
      alert(err?.response?.data?.message || 'Silinemedi');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Blog Yönetimi</h1>

      {/* Blog Ekleme */}
      <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <h2 className="font-semibold">Yeni Blog Ekle</h2>
        <input
          type="text"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="İçerik"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded h-32"
        />
        <input
          type="text"
          placeholder="Etiketler (virgülle ayır)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleAddBlog}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Blog Ekle
        </button>
      </div>

      {/* Blog Listesi */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Mevcut Bloglar</h2>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Başlık</th>
                <th className="p-2">Yazar</th>
                <th className="p-2">Tarih</th>
                <th className="p-2">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-t">
                  <td className="p-2">{blog.title}</td>
                  <td className="p-2">{blog.author?.name || '—'}</td>
                  <td className="p-2">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button className="text-red-600" onClick={() => handleDeleteBlog(blog._id)}>
                      Sil
                    </button>
                    {/* Düzenle için modal vs. sonra eklenebilir */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
