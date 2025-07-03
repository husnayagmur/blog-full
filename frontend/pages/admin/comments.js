import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, deleteComment } from '@/redux/slice/admin/adminCommentsSlice';
import AdminLayout from '@/components/AdminLayout';

const Comments = () => {
  const dispatch = useDispatch();
const { comments: commentList = [], loading, error } = useSelector((state) => state.adminComments);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    dispatch(deleteComment(id));
  };

  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((comment) => (
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
          <div className="mt-4">{renderComments(comment.children, level + 1)}</div>
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

       {!loading && !error && commentList.length > 0 && (
  <div className="mt-6 space-y-4">{renderComments(commentList)}</div>
)}

{!loading && !error && commentList.length === 0 && (
  <p className="text-gray-500">Henüz yorum yok.</p>
)}

      </div>
    </AdminLayout>
  );
};

export default Comments;
