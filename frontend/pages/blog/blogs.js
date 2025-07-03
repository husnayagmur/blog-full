import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs, toggleLike } from '@/redux/slice/blogSlice';
import Header from '../../components/Header';
import { FaHeart, FaComment, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const Blogs = () => {
  const dispatch = useDispatch();
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

  // Redux'tan blogları ve auth token'ını çek
  const { blogs, loading, error } = useSelector((state) => state.blog);
  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer relative"
            >
              <Link href={`/blog/${blog._id}`}>
                <div className="relative h-52 overflow-hidden">
                  {blog.imageUrl && (
                    <figure className="rounded-xl overflow-hidden border-4 border-[#8C7A64] shadow-lg">
                      <Image
                        src={blog.imageUrl.startsWith('http') ? blog.imageUrl : `${BACKEND_URL}${blog.imageUrl}`}
                        alt={blog.title}
                        layout="responsive"
                        width={600}          
                        height={320}     
                        objectFit="cover"     
                        className="transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"       
                      />
                    </figure>
                  )}

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300" />
                  <div className="absolute bottom-4 left-4 text-white z-10">
                    <span className="bg-[#8C7A64]/80 px-3 py-1 rounded-full text-xs font-medium backdrop-blur">
                      {blog.tags}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-[#3A3A24] group-hover:text-[#555936] transition">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">{blog.description}</p>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Yazar: <strong>{blog.author?.name || 'Bilinmiyor'}</strong></span>
                  <span>{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>

                <div className="flex gap-4 items-center text-gray-500 text-sm">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (!isLoggedIn || !token) {
                        alert("Beğenmek için giriş yapmalısınız!");
                        return;
                      }

                      dispatch(toggleLike(blog._id));
                    }}
                  >
                    <FaHeart className={blog.userLiked ? 'text-red-500' : 'text-gray-400'} />
                    <span>{blog.likeCount || 0}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaComment />
                    <span>{blog.commentsCount || 0}</span>
                  </div>

                  <div className="text-xs ml-auto italic">
                    {blog.readTime || '3 dk. okuma'}
                  </div>
                </div>

                <Link href={`/blog/${blog._id}`}>
                  <button className="mt-3 px-4 py-2 bg-[#262610] text-white rounded-md hover:bg-[#3a3a24] transition flex items-center gap-2 text-sm">
                    Oku <FaArrowRight className="text-xs" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
