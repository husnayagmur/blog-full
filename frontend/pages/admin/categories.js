import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';

export default function KategoriYonetimi() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError('Kategoriler alınamadı');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error('Ekleme hatası');

      setName('');
      fetchCategories();
    } catch (err) {
      setError('Kategori eklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (catName) => {
    if (!confirm(`"${catName}" kategorisini silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/categories/${catName}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      fetchCategories();
    } catch {
      alert('Kategori silinemedi');
    }
  };

  return (
   <AdminLayout>
     <div className="max-w-3xl mx-auto p-6 bg-[#f9fafb] min-h-screen">
      <h1 className="text-3xl font-bold text-[#555936] mb-6 text-center">Kategori Yönetimi</h1>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Yeni kategori adı"
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8C7A64]"
        />
        <button
          onClick={handleAddCategory}
          disabled={loading}
          className="bg-[#8C7A64] text-white px-4 py-2 rounded hover:bg-[#6e5f4c] transition"
        >
          Ekle
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="flex justify-between items-center bg-white border border-gray-200 rounded p-3 shadow-sm hover:shadow-md transition"
          >
            <span className="text-[#555936]">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.name)}
              className="text-sm text-red-500 hover:underline"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
   </AdminLayout>
  );
}
