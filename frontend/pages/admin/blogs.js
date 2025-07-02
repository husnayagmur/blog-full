import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
const API_BASE = "http://localhost:5000/api";

export default function BlogYonetimi() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error("Blogları alma hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Başlık ve içerik boş olamaz.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/blogs`,
        {
          title,
          content,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs([res.data, ...blogs]);
      setTitle("");
      setContent("");
      setTags("");
    } catch (err) {
      console.error("Blog ekleme hatası:", err);
      alert(err?.response?.data?.message || "Hata oluştu");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Bu blogu silmek istediğinize emin misiniz?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert(err?.response?.data?.message || "Silinemedi");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8">
        <h1
          className="text-3xl font-extrabold mb-8"
          style={{ color: "#555936" }}
        >
          Blog Yönetimi
        </h1>

        {/* Blog Ekleme */}
        <section
          className="bg-white rounded-lg shadow-md p-6 mb-10"
          style={{ borderColor: "#8C7A64", borderWidth: "1.5px" }}
        >
          <h2
            className="text-xl font-semibold mb-5"
            style={{ color: "#555936" }}
          >
            Yeni Blog Ekle
          </h2>
          <input
            type="text"
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 rounded-md border border-gray-300 p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2"
            style={{ borderColor: "#8C7A64" }}
          />
          <textarea
            placeholder="İçerik"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mb-4 rounded-md border border-gray-300 p-3 text-gray-700 placeholder-gray-400 resize-none h-28 focus:outline-none focus:ring-2"
            style={{ borderColor: "#8C7A64" }}
          />
          <input
            type="text"
            placeholder="Etiketler (virgülle ayır)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full mb-6 rounded-md border border-gray-300 p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2"
            style={{ borderColor: "#8C7A64" }}
          />
          <button
            onClick={handleAddBlog}
            className="w-full bg-[#555936] hover:bg-[#8C7A64] transition-colors text-white font-semibold rounded-md py-3 shadow-lg"
          >
            Blog Ekle
          </button>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
  <h2
    className="text-xl font-semibold mb-6"
    style={{ color: "#555936" }}
  >
    Mevcut Bloglar
  </h2>

  {loading ? (
    <p className="text-gray-500">Yükleniyor...</p>
  ) : blogs.length === 0 ? (
    <p className="text-gray-400">Henüz blog yok.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="bg-[#f9faf5] rounded-lg shadow-sm p-5 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => console.log('Blog detay açılabilir:', blog._id)}
        >
          <div>
            <h3 className="text-lg font-semibold text-[#555936] truncate mb-2">{blog.title}</h3>
            <p className="text-sm text-gray-600 truncate">
              Yazar: <span className="font-medium">{blog.author?.name || "Bilinmiyor"}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Tarih: {new Date(blog.createdAt).toLocaleDateString("tr-TR")}
            </p>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Düzenle:', blog._id);
              }}
              className="flex items-center gap-1 text-[#8C7A64] hover:text-[#555936] font-semibold transition-colors"
              title="Düzenle"
            >
              <FaEdit />
              Düzenle
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBlog(blog._id);
              }}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold transition-colors"
              title="Sil"
            >
              <FaTrashAlt />
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
      </div>
    </AdminLayout>
  );
}
