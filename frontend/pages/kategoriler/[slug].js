import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function KategoriSayfasi() {
  const router = useRouter();
  const { slug } = router.query;

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/blogs?tags=' + encodeURIComponent(slug));
        if (!res.ok) throw new Error('Bloglar yüklenemedi');
        const data = await res.json();

        const sorted = data.sort((a, b) => b.likeCount - a.likeCount);
        setBlogs(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [slug]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Yükleniyor...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!loading && blogs.length === 0) return <p className="text-center mt-10 text-gray-600">Bu kategoriye ait blog bulunamadı.</p>;

  const featuredBlogs = blogs.slice(0, 4);
  const otherBlogs = blogs.slice(4);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-12 text-center text-gray-800">
        {slug.replace(/-/g, ' ')}
      </h1>

      {/* 4 Büyük Öne Çıkan Kart */}
      <div className="space-y-10 mb-16">
        {featuredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="md:w-1/3 h-64 relative">
              <img
                src={blog.image || '/placeholder.png'}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-between md:w-2/3">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{blog.title}</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {blog.content.length > 300
                    ? blog.content.substring(0, 300) + '...'
                    : blog.content}
                </p>
              </div>
              <Link href={`/blog/${blog._id}`} className="text-green-700 hover:text-green-900 font-semibold transition-colors">
                Daha Fazlasını Oku &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {otherBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {blog.content.length > 150
                  ? blog.content.substring(0, 150) + '...'
                  : blog.content}
              </p>
            </div>
            <Link href={`/blog/${blog._id}`} className="text-green-700 hover:text-green-900 font-semibold transition-colors">
              Oku Devamı &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
