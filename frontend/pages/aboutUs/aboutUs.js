import Header from '../../components/Header'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUserCircle, FaLeaf, FaSeedling, FaBookOpen, FaUsers, FaBookReader } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuthors } from '../../redux/slice/authorSlice'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, duration: 0.6 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const featureItems = [
  { icon: <FaLeaf className="text-[#8C7A64] w-7 h-7 mx-auto mb-2" />, title: "Kadim Ritüeller", desc: "İnsanlık tarihinin derinliklerinden günümüze ulaşan törenler, danslar ve kutsal ayinler." },
  { icon: <FaSeedling className="text-[#8C7A64] w-7 h-7 mx-auto mb-2" />, title: "Doğayla Uyum", desc: "Toprağın, suyun, ateşin ve havanın ruhuyla dans eden yaşam biçimleri." },
  { icon: <FaBookOpen className="text-[#8C7A64] w-7 h-7 mx-auto mb-2" />, title: "Şifalı Bitkiler", desc: "Binlerce yıl boyunca doğadan öğrenilmiş sağlık sırları." },
  { icon: <FaUsers className="text-[#8C7A64] w-7 h-7 mx-auto mb-2" />, title: "Yaşam Düzeni", desc: "Toplumsal yapılar, değerler ve günlük hayata dair incelikler." },
  { icon: <FaBookReader className="text-[#8C7A64] w-7 h-7 mx-auto mb-2" />, title: "Anlatılan Hikayeler", desc: "Efsaneler, mitler ve kuşaktan kuşağa aktarılan yaşam dersleri." },
]

const aboutUs = () => {
  const dispatch = useDispatch()
  const { list: authors, loading, error } = useSelector(state => state.authors)

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-24">

        {/* Ne Anlatıyoruz bölümü */}
        <motion.section
          className="bg-white rounded-3xl shadow-lg p-14 border-2 border-[#8C7A64]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          aria-labelledby="ne-anlatiyoruz-title"
        >
          <motion.h2
            id="ne-anlatiyoruz-title"
            className="text-3xl font-semibold text-[#555936] mb-12 text-center tracking-wide font-serif"
            variants={itemVariants}
          >
            Ne Anlatıyoruz?
          </motion.h2>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10" variants={itemVariants}>
            {featureItems.map(({ icon, title, desc }, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4">
                {icon}
                <h3 className="text-xl font-semibold text-[#8C7A64] mb-2">{title}</h3>
                <p className="text-[#3F4E00] leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* Yazarlarımız - Kartlar */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          aria-label="Yazarlarımız bölümü"
        >
          <motion.h2
            className="text-4xl font-serif font-bold text-[#4B5320] mb-14 text-center tracking-wide"
            variants={itemVariants}
          >
            Yazarlarımız
          </motion.h2>

          {loading && <p className="text-center text-gray-500">Yazarlar yükleniyor...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10"
              variants={containerVariants}
            >
              {authors.slice(0, 4).map((author) => (
                <motion.article
                  key={author._id}
                  className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border border-[#8C7A64] cursor-pointer
                    transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#8C7A64]"
                  tabIndex={0}
                  variants={itemVariants}
                  aria-label={`Yazar ${author.name}`}
                >
                  {author.photoUrl ? (
                    <img
                      src={author.photoUrl}
                      alt={`${author.name} fotoğrafı`}
                      className="rounded-full w-28 h-28 object-cover mb-6 border-4 border-[#8C7A64]"
                      loading="lazy"
                    />
                  ) : (
                    <FaUserCircle className="text-[#8C7A64] w-28 h-28 mb-6" />
                  )}

                  <h3 className="text-xl font-semibold text-[#3F4E00] tracking-wide mb-3">{author.name}</h3>
                  <p className="text-gray-700 mb-8 font-light leading-relaxed min-h-[72px]">{author.description}</p>
                  <Link href={`/aboutUs/${author._id}`}>
                    <button
                      type="button"
                      className="px-5 py-2 rounded-full border border-[#8C7A64] text-[#8C7A64] font-medium hover:bg-[#8C7A64] hover:text-white transition"
                    >
                      {author.buttonText}
                    </button>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </motion.section>
        <section className="bg-[#e6e7d9] rounded-3xl p-12 max-w-5xl mx-auto text-center shadow-md border border-[#8C7A64]">
          <h3 className="text-2xl font-semibold text-[#555936] mb-6 font-serif">Topluluk Hakkında</h3>
          <p className="text-[#4B5320] max-w-xl mx-auto leading-relaxed text-lg">
            Kabile yaşamı ve doğa kültürü üzerine yaptığımız araştırmalarla, binlerce yıllık mirası koruyup yaşatıyoruz. Amacımız; doğayla uyumlu, sürdürülebilir yaşam biçimlerini gelecek nesillere aktarmaktır.
          </p>
        </section>

      </main>
    </div>
  )
}

export default aboutUs
