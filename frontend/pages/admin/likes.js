import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/AdminLayout';

const API_BASE = 'http://localhost:5000/api';

const Likes = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLikes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
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
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#555936' }}>
          Tüm Beğeniler
        </h1>

        {loading && (
          <p className="text-center text-gray-500 italic">Yükleniyor...</p>
        )}

        {error && (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="min-w-full border-collapse text-sm text-[#555936]">
              <thead>
                <tr
                  style={{ backgroundColor: '#8C7A64' }}
                  className="text-white uppercase tracking-wide"
                >
                  <th className="p-4 text-left">Kullanıcı</th>
                  <th className="p-4 text-left">E-posta</th>
                  <th className="p-4 text-left">Blog Başlığı</th>
                  <th className="p-4 text-left">Beğeni Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {likes.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-6 text-center text-gray-400 italic"
                    >
                      Beğeni bulunamadı.
                    </td>
                  </tr>
                ) : (
                  likes.map((like, i) => (
                    <tr
                      key={like._id}
                      className={`cursor-default ${
                        i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-[#f0f0dc] transition-colors duration-200`}
                    >
                      <td className="p-4 max-w-xs truncate">{like.user?.name || '-'}</td>
                      <td className="p-4 max-w-xs truncate">{like.user?.email || '-'}</td>
                      <td className="p-4 max-w-xs truncate">{like.blog?.title || '-'}</td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(like.createdAt).toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Likes;
