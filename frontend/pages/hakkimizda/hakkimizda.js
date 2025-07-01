import Header from '../../components/Header'
import React from 'react'
import { motion } from 'framer-motion'
import { FaUserCircle, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
const authors = [
  {
    name: 'Yağız Aydın',
    description: 'Şaman gelenekleri, kutsal objeler ve ruhani törenler üzerine yazar.',
    buttonText: "Yağız'ın yazılarına git",
  },
  {
    name: 'Sema Demir',
    description: 'Kadim ritüeller ve doğayla uyum üzerine makaleler yazar.',
    buttonText: "Sema'nın yazılarına git",
  },
  {
    name: 'Elif Yıldız',
    description: 'Doğa ve kabile yaşamı üzerine araştırmalar yapar.',
    buttonText: "Elif'in yazılarına git",
  },
  {
    name: 'Burak Koç',
    description: 'Şamanik gelenekleri araştırır ve anlatır.',
    buttonText: "Burak'ın yazılarına git",
  },
  {
    name: 'Hüsna Yağmur',
    description: 'Doğayla kadın arasındaki bağları işler.',
    buttonText: "Hüsna'nın yazılarına git",
  },
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, duration: 0.6 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const Hakkimizda = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20 bg-white mt-4">

        <motion.section
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-12 border-2 border-[#8C7A64]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-2xl font-semibold text-[#555936] mb-8 text-center tracking-wide"
            variants={itemVariants}
          >
            Ne Anlatıyoruz?
          </motion.h2>
          <motion.ul
            className="list-disc list-inside space-y-4 text-[#262610] text-lg leading-relaxed font-normal"
            variants={itemVariants}
          >
            <li>
              <span className="font-semibold text-[#8C7A64]">Kadim Ritüeller:</span> İnsanlık tarihinin derinliklerinden günümüze ulaşan törenler, danslar ve kutsal ayinler.
            </li>
            <li>
              <span className="font-semibold text-[#8C7A64]">Doğayla Uyum:</span> Toprağın, suyun, ateşin ve havanın ruhuyla dans eden yaşam biçimleri.
            </li>
            <li>
              <span className="font-semibold text-[#8C7A64]">Şifalı Bitkiler ve Doğal Tedaviler:</span> Binlerce yıl boyunca doğadan öğrenilmiş sağlık sırları.
            </li>
            <li>
              <span className="font-semibold text-[#8C7A64]">Kabilelerin Yaşam Düzeni:</span> Toplumsal yapılar, değerler ve günlük hayata dair incelikler.
            </li>
            <li>
              <span className="font-semibold text-[#8C7A64]">Anlatılan Hikayeler:</span> Efsaneler, mitler ve kuşaktan kuşağa aktarılan yaşam dersleri.
            </li>
          </motion.ul>
        </motion.section>

        {/* Yazarlarımız - Kartlar */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl font-bold text-[#4B5320] mb-10 text-center tracking-wide"
            variants={itemVariants}
          >
            Yazarlarımız
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto"
            variants={containerVariants}
          >
            {authors.slice(0, 4).map((author, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-gray-200 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                variants={itemVariants}
              >
                <FaUserCircle className="text-[#8C7A64] text-9xl mb-5" />
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="text-lg font-semibold text-[#3F4E00] tracking-wide">{author.name}</h3>
                </div>
                <p className="text-gray-600 mb-6 font-light leading-relaxed min-h-[60px]">
                  {author.description}
                </p>
                <button
                  type="button"
                  className="px-5 py-2 rounded-full border border-[#8C7A64] text-[#8C7A64] font-medium hover:bg-[#8C7A64] hover:text-white transition"
                >
                  {author.buttonText}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
    </div>
  )
}

export default Hakkimizda
