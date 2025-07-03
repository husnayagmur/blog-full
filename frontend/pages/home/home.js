'use client'
import Header from '../../components/Header';
import React from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';

const imageData = [
  {
    src: '/image/kabileYasami.jpg',
    alt: 'Kabile Yaşamı',
    label: 'Kabile Yaşamı',
    description: 'Doğanın kalbinde, binlerce yıldır süregelen kabile yaşamları, insanların doğayla olan derin bağını ve geleneksel toplumsal düzenlerini yansıtır.',
  },
  {
    src: '/image/avcılık.jpg',
    alt: 'Avcılık',
    label: 'Hayatta Kalma ve Avcılık',
    description: 'Kabileler, yüzyıllardır süregelen avcılık yöntemleri ve doğayla uyumlu hayatta kalma teknikleri sayesinde varlıklarını sürdürüyorlar.',
  },
  {
    src: '/image/gelenekler.jpg',
    alt: 'Gelenekler',
    label: 'İnançlar ve Ritüeller',
    description: 'Kabilelerin kuşaktan kuşağa aktardığı inanç sistemleri, ritüelleri ve törenleri, onların kültürel kimliğini ve dayanışmasını güçlendirir.',
  },
  {
    src: '/image/gelenekler.jpg',
    alt: 'Gelenekler',
    label: 'Kabilelerin Kadim Zanaatları',
    description: 'Doğayla uyum içinde nesilden nesile aktarılan eşsiz el emeği zanaatları, kabilelerin kültürel mirasının vazgeçilmez bir parçasıdır.',
  },

];

const surmaSections = [
  {
    src: '/image/a1.jpg',
    alt: 'Turkana',
    title: 'Turkana',
    text: "Kenya'nın kuzeybatısında yaşayan Turkana kabilesi, renkli mücevherleri ve gelenekleriyle tanınır. Komşu Pokot kabilesiyle zaman zaman çatışmalar yaşarlar. Kökenleri Uganda'nın Karamojong bölgesine dayanır.",
    buttonText: 'Daha Fazlasını Oku →',
  },
  {
    src: '/image/a2.jpg',
    alt: 'Surma Kadını 2',
    title: 'Geleneksel Dudak Plakası',
    text: 'Bu gelenek, kabilede ergenlik ve kadınlığın sembolü olarak kabul edilir ve nesilden nesile aktarılır. Her plak, sahibinin kişisel hikayesini taşır.',
    buttonText: 'Daha Fazlasını Oku →',
  },
  {
    src: '/image/a3.jpg',
    alt: 'Nyangatom kadınları',
    title: 'Nyangatom kadınları',
    text: 'Genç kızlara babaları tarafından boncuklu bir kolye verilir. Özel günlerde, vesilelerde veya törenlerde kızlar daha fazla kolye alırlar. Ne kadar çok kolye olursa o kadar iyi olur ve evlendiklerinde bu tahta, cam veya plastik boncuklardan daha fazla ip alırlar. Boncuklu kolyelerin miktarı, kalitesi ve türü kadınların sosyal statüsünü temsil eder ve sembolize eder. .',
    buttonText: 'Daha Fazlasını Oku →',
  },
];

const Home = () => {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-4 space-y-10">
        <section className="relative h-[480px] rounded overflow-hidden shadow-lg">
          <img
            src="/image/anasayfa.jpg"
            alt="Ana Sayfa Resmi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-[#F2F2F2] px-4">
            <h1 className="text-3xl font-extrabold mb-3 drop-shadow-lg font-serif">
              Kabilelerin Kalbinde
            </h1>
            <p className=" max-w-3xl leading-relaxed drop-shadow-md">
              Ormanın derinliklerinde yüzyıllardır süregelen bir yaşam biçimi...
              Kültürlerin ve doğanın eşsiz buluşma noktası.
            </p>
            <Link href="/blog/bloglar" passHref>
              <button className="mt-8 bg-[#8C7A64] text-white px-8 py-3 rounded-lg hover:bg-[#555936] cursor-pointer transition">
                Daha Fazla Keşfet
              </button>
            </Link>
          </div>
        </section>
        <section className="py-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-semibold mb-6 text-[#555936] tracking-wide font-serif">
              Doğa ve Kabile Temalı Yazılarımız
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Binlerce yılın deneyiminden süzülmüş kültürel zenginlikleri ve doğa ile uyumu keşfetmek için hemen aşağıdaki kartlara göz atın.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {imageData.map((item, index) => (
              <article
                key={index}
                className="relative w-full md:w-1/3 h-[340px] rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/70" />
                <span className="absolute top-4 left-4 bg-white/80 text-[#555936] text-xs px-3 py-1 rounded-full z-30 backdrop-blur-sm font-medium">
                  {item.category || "Kültür"}
                </span>
                <div className="absolute bottom-6 left-6 right-6 text-white z-20 transition-all duration-500 group-hover:-translate-y-8">
                  <h3 className="text-lg font-bold drop-shadow-md">{item.label}</h3>
                  <p className="text-sm mt-1 opacity-90">{item.description}</p>
                  <p className="text-[11px] mt-1 text-gray-200">
                    {item.date || "Haziran 2025"} — {item.readTime || "4 dk. okuma"}
                  </p>
                </div>
                <button className="absolute bottom-6 left-6 px-4 py-1 border border-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-500 text-white hover:bg-white hover:text-black z-30 flex items-center gap-1 text-sm">
                  Oku <span className="inline-block">→</span>
                </button>
              </article>
            ))}
          </div>
        </section>
        <section className="space-y-20 max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-semibold text-[#555936] text-center mb-4 font-serif">
            Kabileler: Gelenekler, Kültür ve Yaşam Biçimleri
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Farklı coğrafyalarda yaşayan kabileler, kendilerine has gelenekleri, renkli kültürleri ve yaşam tarzları ile dünyanın zenginliğini yansıtıyor. Bu bölümde, bazı dikkat çekici kabile yaşamlarına yakından bakıyoruz.
          </p>

          {surmaSections.map((section, index) => (
            <motion.article
              key={index}
              className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: index * 0.15 }}
            >
              <div className="md:w-1/2 px-4">
                <img
                  src={section.src}
                  alt={section.alt}
                  className="w-full max-w-[400px] h-[400px] object-cover rounded-lg shadow-md mx-auto hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="md:w-1/2 px-4 space-y-4">
                <h3 className="text-2xl font-semibold text-[#555936]">{section.title}</h3>
                <p className="text-gray-700 leading-relaxed">{section.text}</p>
                <div className="bg-[#f8f8f2] border-l-4 border-[#8C7A64] p-4 rounded shadow-sm text-sm text-gray-600">
                  <span className="font-medium text-[#555936]">Bilgi:</span> {section.fact || "Bu kabile, yüz boyama gelenekleriyle tanınır ve doğayla iç içe bir yaşam sürer."}
                </div>
                <button className="bg-[#8C7A64] text-white px-6 py-2 rounded hover:bg-[#555936] transition duration-300 shadow">
                  {section.buttonText}
                </button>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#8C7A64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                  </svg>
                  <span>Daha fazla bilgi için keşfetmeye devam et</span>
                </div>
              </div>
            </motion.article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;