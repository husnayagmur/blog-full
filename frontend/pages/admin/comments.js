import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/AdminLayout';

const API_BASE = 'http://localhost:5000/api/comments';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Yorumlar alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Silme işlemi başarısız.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const renderComments = (commentsList, level = 0) => {
    return commentsList.map(comment => (
      <div
        key={comment._id}
        className={`rounded-md p-4 mb-4 shadow-sm transition-colors duration-200 ${
          level === 0 ? 'bg-[#f9f9f4]' : 'bg-[#efefe7]'
        }`}
        style={{
          marginLeft: level * 24,
          borderLeft: level ? '4px solid #8C7A64' : 'none',
        }}
      >
        <div className="flex justify-between items-center mb-1">
          <div>
            <strong className="text-[#555936]">{comment.author?.name || 'Bilinmeyen'}</strong>{' '}
            <span className="text-sm text-gray-500">({comment.author?.email || 'E-posta yok'})</span>
          </div>
          <button
            onClick={() => handleDelete(comment._id)}
            className="text-red-600 hover:text-red-800 transition-colors duration-150 font-semibold"
            aria-label="Yorumu sil"
          >
            Sil
          </button>
        </div>

        <p className="whitespace-pre-wrap text-gray-700 mb-2">{comment.content}</p>

        <div className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString('tr-TR')}
        </div>
        {comment.children && comment.children.length > 0 && (
          <div className="mt-4">
            {renderComments(comment.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-8 text-[#555936] border-b-4 border-[#8C7A64] pb-2">
          Yorum Yönetimi
        </h1>

        {loading && <p className="text-gray-500">Yükleniyor...</p>}
        {error && <p className="text-red-600 font-medium">{error}</p>}

        {!loading && !error && (
          <>
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center mt-20">Henüz yorum bulunmamaktadır.</p>
            ) : (
              <div>{renderComments(comments)}</div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Comments;
