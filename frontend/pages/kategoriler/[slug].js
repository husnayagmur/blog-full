import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Categories() {
  const router = useRouter();
  const { slug } = router.query;
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function turkishToEnglish(str) {
    const map = {
      ç: 'c', ğ: 'g', ı: 'i', İ: 'i',
      ö: 'o',
      ş: 's',
      ü: 'u',
      Ç: 'c',
      Ğ: 'g',
      Ö: 'o',
      Ş: 's',
      Ü: 'u',
    };
    return str
      .split('')
      .map(char => map[char] || char)
      .join('');
  }

  useEffect(() => {
    if (!slug) return;
    const categoryName = turkishToEnglish(slug.replace(/-/g, ' ').toLowerCase());

    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/blogs?category=${encodeURIComponent(categoryName)}`);
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
    <div className="max-w-7xl mx-auto px-6 py-12 bg-[#f9fafb]">
      <h1 className="text-4xl font-serif font-semibold mb-12 text-center text-[#555936] capitalize tracking-wider drop-shadow-sm">
        {slug?.replace(/-/g, ' ')} {/* Görsel için orijinal slug, okunabilir */}
        <span className="block w-24 h-1 bg-[#8C7A64] mx-auto mt-4 rounded"></span>
      </h1>
      <div className="space-y-10 mb-16">
        {featuredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="flex flex-col md:flex-row bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
          >
            <div className="md:w-1/3 h-64 relative">
              {blog.imageUrl && (
                <figure className="w-full h-full rounded-xl overflow-hidden border-4 border-[#8C7A64] shadow-lg">
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
            </div>

            <div className="p-6 flex flex-col justify-between md:w-2/3 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#555936] mb-2">{blog.title}</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {blog.content.length > 300 ? blog.content.substring(0, 300) + '...' : blog.content}
                </p>
              </div>
              <Link
                href={`/blog/${blog._id}`}
                className="text-[#8C7A64] font-medium text-sm hover:underline hover:text-[#6e5f4c] transition"
              >
                Daha Fazlasını Oku →
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {otherBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#555936]">{blog.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {blog.content.length > 150 ? blog.content.substring(0, 150) + '...' : blog.content}
              </p>
            </div>
            <Link
              href={`/blog/${blog._id}`}
              className="mt-4 text-sm text-[#8C7A64] font-medium hover:underline hover:text-[#6e5f4c] transition"
            >
              İçeriği Oku →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
