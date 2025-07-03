import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
const AuthorDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const [authorInfo, setAuthorInfo] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // Yazar bilgisi
      fetch(`http://localhost:5000/api/authors/${id}`)
        .then(res => res.json())
        .then(data => {
          setAuthorInfo(data)
        })

      // Blogları çek
      fetch(`http://localhost:5000/api/blogs?author=${id}`)
        .then(res => res.json())
        .then(data => {
          setBlogs(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [id])

  if (loading) return <div className="text-center py-20">Yükleniyor...</div>

  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-16">

        {authorInfo && (
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-serif font-bold text-[#555936] mb-4 tracking-tight">
              {authorInfo.name}
            </h1>
            <p className="text-lg text-[#6e6e4a] leading-relaxed font-medium">
              {authorInfo.description}
            </p>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-semibold text-[#555936] mb-10 text-center font-serif tracking-wide">
            Yazarlara Ait Yazılar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between border border-[#8C7A64] hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                  tabIndex={0}
                  aria-label={`Blog başlığı: ${blog.title}`}
                >
                  <h3 className="text-xl font-semibold text-[#4B5320] mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-[#6e6e4a] text-sm leading-relaxed flex-grow line-clamp-4">
                    {blog.content.slice(0, 180)}...
                  </p>
                  <a
                    href={`/blog/${blog._id}`}
                    className="mt-6 inline-block text-[#8C7A64] font-semibold hover:underline hover:text-[#6e5f4c] transition"
                    aria-label={`Devamını oku: ${blog.title}`}
                  >
                    Devamını oku →
                  </a>
                </article>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3 font-medium">
                Bu yazara ait yazı bulunamadı.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>

  )
}

export default AuthorDetail
