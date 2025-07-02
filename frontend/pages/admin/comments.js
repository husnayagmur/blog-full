import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/AdminLayout';

const API_BASE = 'http://localhost:5000/api/comments'; // backend yorum endpoint

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Yorumları çek (tüm bloglar için ya da backendde farklı endpoint varsa onu kullan)
  const fetchComments = async () => {
    setLoading(true);
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

  // Yorum silme (admin yetkisiyle)
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

  // Yorumları ağaç yapısında listelemek için recursive fonksiyon
  const renderComments = (commentsList, level = 0) => {
    return commentsList.map(comment => (
      <div key={comment._id} style={{ marginLeft: level * 20, borderLeft: level ? '1px solid #ccc' : 'none', paddingLeft: 10, marginBottom: 10 }}>
        <div><strong>{comment.author?.name || 'Bilinmeyen'}</strong> ({comment.author?.email || 'E-posta yok'})</div>
        <div style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(comment.createdAt).toLocaleString()}</div>
        <button onClick={() => handleDelete(comment._id)} style={{ color: 'red', cursor: 'pointer', marginTop: 5 }}>Sil</button>
        {comment.children && comment.children.length > 0 && renderComments(comment.children, level + 1)}
      </div>
    ));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Yorum Yönetimi</h1>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div>
          {comments.length === 0 && <p>Yorum bulunamadı.</p>}
          {renderComments(comments)}
        </div>
      )}
    </AdminLayout>
  );
};

export default Comments;
