import Link from 'next/link';

const categories = [
  { name: 'Kabile Yaşamı', slug: 'kabile-yasami' },
  { name: 'Yaşam Kalitesi', slug: 'yasam-kalitesi' },
  { name: 'Şifalı Bitkiler', slug: 'sifali-bitkiler' },
  { name: 'Hayatta Kalma ve Avcılık', slug: 'hayatta-kalma-ve-avcilik' },
];

export default function Dropdown({ onClose }) {
  return (
    <div className="mt-2 w-56 bg-white shadow-lg border rounded z-50">
      {categories.map((cat) => (
        <Link key={cat.slug} href={`/kategoriler/${cat.slug}`}>
          <div
            onClick={onClose}
            className="block px-4 py-2 hover:bg-[#e6e6e6] text-sm text-gray-800 cursor-pointer"
          >
            {cat.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
