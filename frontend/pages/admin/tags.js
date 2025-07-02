import AdminLayout from '@/components/AdminLayout';
import React, { useEffect, useState } from 'react';

const TagList = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/tags')  // Backenddeki tag API endpoint'in
      .then(res => res.json())
      .then(data => setTags(data))
      .catch(err => console.error('Taglar çekilemedi:', err));
  }, []);

  return (
    <div>
      <AdminLayout>
        <h3>Taglar</h3>
      <ul>
        {tags.map(tag => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      </AdminLayout>
    </div>
  );
};

export default TagList;
