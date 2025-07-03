import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dropdown({ onClose }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Kategori alınamadı', err));
  }, []);

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
