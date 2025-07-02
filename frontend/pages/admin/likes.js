import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/AdminLayout';

const API_BASE = 'http://localhost:5000/api'; // Backend URL'ini .env ile yönetebilirsin

const Likes = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLikes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token'); // Admin token'ını burada alıyoruz
      const res = await axios.get(`${API_BASE}/likes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLikes(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Beğeniler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tüm Beğeniler</h1>

        {loading && <p>Yükleniyor...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Kullanıcı</th>
                <th className="border border-gray-300 p-2 text-left">E-posta</th>
                <th className="border border-gray-300 p-2 text-left">Blog Başlığı</th>
                <th className="border border-gray-300 p-2 text-left">Beğeni Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {likes.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    Beğeni bulunamadı.
                  </td>
                </tr>
              )}
              {likes.map((like) => (
                <tr key={like._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{like.user?.name || '-'}</td>
                  <td className="border border-gray-300 p-2">{like.user?.email || '-'}</td>
                  <td className="border border-gray-300 p-2">{like.blog?.title || '-'}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(like.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default Likes;
