// services/blogService.js
export const fetchBlogs = async () => {
  const res = await fetch('http://localhost:5000/api/blogs');
  return res.json();
};
