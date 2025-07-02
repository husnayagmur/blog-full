import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/tags')
      .then(res => {
        if (!res.ok) throw new Error('Taglar çekilemedi');
        return res.json();
      })
      .then(data => setTags(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-extrabold mb-6 text-[#555936] border-b-4 border-[#8C7A64] pb-2">
          Etiketler
        </h2>

        {loading && <p className="text-gray-500">Yükleniyor...</p>}
        {error && <p className="text-red-600 font-medium">{error}</p>}

        {!loading && !error && (
          <ul className="flex flex-wrap gap-3">
            {tags.length === 0 ? (
              <p className="text-gray-400">Henüz etiket yok.</p>
            ) : (
              tags.map((tag) => (
                <li
                  key={tag}
                  className="px-4 py-2 bg-[#f0f0dc] text-[#555936] rounded-full font-semibold shadow-sm cursor-default
                    hover:bg-[#8C7A64] hover:text-white transition-colors duration-300"
                >
                  #{tag}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

export default TagList;
