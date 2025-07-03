import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchComments,
  addComment,
  addReply,
  toggleReplyBox,
  setReplyText,
} from '../../redux/slice/commentSlice';
import Image from 'next/image';

const BlogDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const [blog, setBlog] = useState(null);
  const [authorBlogs, setAuthorBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    list: comments,
    posting,
    postingReplyId,
    replyErrors,
    replyBoxes,
    replyTexts,
    error: commentError,
  } = useSelector((state) => state.comments);

  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    dispatch(fetchComments(id));

    fetch(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Blog verisi yüklenemedi');
        return res.json();
      })
      .then((blogData) => {
        setBlog(blogData);
        const authorName = blogData.author?.name;
        if (!authorName) {
          setAuthorBlogs([]);
          setLoading(false);
          return;
        }
        fetch(`http://localhost:5000/api/blogs?authors=${encodeURIComponent(authorName)}`)
          .then((res) => {
            if (!res.ok) throw new Error('Yazarın diğer yazıları yüklenemedi');
            return res.json();
          })
          .then((data) => {
            const filteredBlogs = Array.isArray(data) ? data.filter((b) => b._id !== id) : [];
            setAuthorBlogs(filteredBlogs);
            setLoading(false);
          })
          .catch(() => {
            setAuthorBlogs([]);
            setLoading(false);
          });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, dispatch]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    dispatch(addComment({ blogId: id, content: newComment.trim() }))
      .unwrap()
      .then(() => setNewComment(''));
  };

  const handleReplySubmit = (commentId) => {
    const content = replyTexts[commentId];
    if (!content || !content.trim()) return;
    dispatch(addReply({ commentId, content: content.trim() }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-xl text-[#8C7A64] font-semibold animate-pulse">Yükleniyor...</span>
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-red-600 font-semibold">
        {error}
      </div>
    );

  if (!blog)
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-600 font-medium">
        Blog bulunamadı.
      </div>
    );

  return (
    <article className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-serif font-bold text-[#555936] mb-3 leading-tight">
          {blog.title}
        </h1>
        <p className="text-md text-[#8C7A64] font-semibold tracking-wide">
          Yazar: <span className="italic">{blog.author?.name || 'Bilinmiyor'}</span>
        </p>
      </header>
      {blog.imageUrl && (
  <figure className="flex justify-center rounded-xl overflow-hidden border-4 border-[#8C7A64] shadow-lg max-w-[400px] mx-auto">
    <Image
      src={blog.imageUrl.startsWith('http') ? blog.imageUrl : `${BACKEND_URL}${blog.imageUrl}`}
      alt={blog.title}
      layout="responsive"
      width={400}  // Küçük boyut
      height={250} // Küçük boyut
      objectFit="cover"
      className="transition-transform duration-500 group-hover:scale-110"
      loading="lazy"
    />
  </figure>
)}


      <section
        className="prose max-w-none text-[#262610] leading-relaxed font-serif"
        style={{ whiteSpace: 'pre-line' }}
        aria-label="Blog içeriği"
      >
        {blog.content}
      </section>
      {blog.tags && blog.tags.length > 0 && (
        <section aria-label="Blog etiketleri">
          <div className="flex flex-wrap gap-3 mt-6">
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#8C7A64] text-white text-xs font-semibold px-4 py-1 rounded-full shadow-sm select-none"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="comments-title" className="mt-12">
        <h2 id="comments-title" className="text-2xl font-semibold text-[#555936] mb-6">
          Yorumlar ({comments.length})
        </h2>

        {comments.length === 0 && <p className="text-gray-500">Henüz yorum yok.</p>}

        <ul className="space-y-6">
          {comments.map((comment) => (
            <li key={comment._id} className="border border-[#8C7A64] rounded-xl p-4 bg-white shadow-sm">
              <p className="text-gray-800">{comment.content}</p>
              <button
                onClick={() => dispatch(toggleReplyBox(comment._id))}
                className="mt-2 text-sm text-[#8C7A64] hover:underline"
              >
                {replyBoxes[comment._id] ? 'İptal' : 'Cevapla'}
              </button>
              {replyBoxes[comment._id] && (
                <div className="mt-2">
                  <textarea
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Cevabınızı yazın..."
                    value={replyTexts[comment._id] || ''}
                    onChange={(e) => dispatch(setReplyText({ commentId: comment._id, text: e.target.value }))}
                  />
                  {replyErrors[comment._id] && (
                    <p className="text-red-600 text-sm">{replyErrors[comment._id]}</p>
                  )}
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    disabled={postingReplyId === comment._id}
                    className="mt-1 px-4 py-1 bg-[#8C7A64] text-white rounded-md hover:bg-[#6e5f4c]"
                  >
                    {postingReplyId === comment._id ? 'Gönderiliyor...' : 'Cevabı Gönder'}
                  </button>
                </div>
              )}
              {comment.replies && comment.replies.length > 0 && (
                <ul className="ml-6 mt-3 border-l border-gray-300 pl-4 space-y-3">
                  {comment.replies.map((reply) => (
                    <li key={reply._id} className="bg-gray-50 p-3 rounded-md shadow-inner">
                      <p className="text-gray-700">{reply.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
            rows="4"
            placeholder="Yorumunuzu yazın..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            aria-label="Yeni yorum"
          />
          {commentError && <p className="text-red-600 mt-2">{commentError}</p>}
          <button
            onClick={handleAddComment}
            disabled={posting}
            className="mt-3 px-6 py-2 bg-[#8C7A64] text-white rounded-md hover:bg-[#6e5f4c] transition"
          >
            {posting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
          </button>
        </div>
      </section>

      <section aria-labelledby="author-blogs-title">
        <h2 id="author-blogs-title" className="text-xl font-serif font-bold text-[#555936] mb-8">
          Yazarın Diğer Yazıları
        </h2>

        {authorBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {authorBlogs.map(({ _id, title, content }) => (
              <article
                key={_id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between border border-[#8C7A64] hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                tabIndex={0}
                aria-label={`Blog başlığı: ${title}`}
              >
                <h3 className="text-xl font-semibold text-[#4B5320] mb-3 line-clamp-2">{title}</h3>
                <p className="text-[#6e6e4a] text-sm leading-relaxed flex-grow line-clamp-4">
                  {content.slice(0, 180)}...
                </p>
                <a
                  href={`/blog/${_id}`}
                  className="mt-6 inline-block text-[#8C7A64] font-semibold hover:underline hover:text-[#6e5f4c] transition"
                  aria-label={`Devamını oku: ${title}`}
                >
                  Devamını oku →
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 font-medium">Yazarın başka yazısı yok.</p>
        )}
      </section>
    </article>
  );
};

export default BlogDetail;