import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  addBlog,
  deleteBlog,
  updateBlog,
} from "@/redux/slice/admin/adminBlogsSlice";
import AdminLayout from "@/components/AdminLayout";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Image from "next/image";

export default function BlogYonetimi() {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.adminBlogs);
  const user = useSelector((state) => state.auth?.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Başlık ve içerik boş olamaz.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append(
      "tags",
      JSON.stringify(
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );
    if (image) formData.append("image", image);

    if (!editMode && user?._id) {
      formData.append("author", user._id); // yeni blog için yazar id'sini ekle
    }

    if (editMode) {
      dispatch(updateBlog({ id: editBlogId, formData })).then((res) => {
        if (!res.error) resetForm();
        else alert(res.payload || "Blog güncellenemedi.");
      });
    } else {
      dispatch(addBlog(formData)).then((res) => {
        if (!res.error) resetForm();
        else alert(res.payload || "Blog eklenemedi.");
      });
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setEditBlogId(null);
    setTitle("");
    setContent("");
    setTags("");
    setImage(null);
  };

  const handleDeleteBlog = (id) => {
    if (!confirm("Bu blogu silmek istediğinize emin misiniz?")) return;
    dispatch(deleteBlog(id));
  };

  const handleEditClick = (blog) => {
    setEditMode(true);
    setEditBlogId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setTags(blog.tags?.join(", ") || "");
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-[#555936]">Blog Yönetimi</h1>

        {/* Blog Ekleme / Güncelleme */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-10 border border-[#8C7A64]">
          <h2 className="text-xl font-semibold mb-5 text-[#555936]">
            {editMode ? "Blog Güncelle" : "Yeni Blog Ekle"}
          </h2>

          <input
            type="text"
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 border border-[#8C7A64] p-3 rounded-md text-gray-700"
          />
          <textarea
            placeholder="İçerik"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mb-4 border border-[#8C7A64] p-3 rounded-md text-gray-700 h-28 resize-none"
          />
          <input
            type="text"
            placeholder="Etiketler (virgülle ayır)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full mb-4 border border-[#8C7A64] p-3 rounded-md text-gray-700"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mb-6"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-[#555936] hover:bg-[#8C7A64] text-white font-semibold rounded-md py-3"
          >
            {editMode ? "Blogu Güncelle" : "Blog Ekle"}
          </button>
        </section>

        {/* Blog Listesi */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-[#555936]">Mevcut Bloglar</h2>

          {loading ? (
            <p className="text-gray-500">Yükleniyor...</p>
          ) : error ? (
            <p className="text-red-600 font-medium">{error}</p>
          ) : blogs.length === 0 ? (
            <p className="text-gray-400">Henüz blog yok.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-[#f9faf5] rounded-lg p-5 shadow hover:shadow-lg transition-shadow"
                >
                  {blog.imageUrl && (
                    <div className="relative w-full h-40 mb-3">
                      <Image
                        src={blog.imageUrl.startsWith('http') ? blog.imageUrl : `${BACKEND_URL}${blog.imageUrl}`}
                        alt="Blog Görseli"
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-[#555936] mb-1">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Yazar:{" "}
                    <span className="font-medium">
                      {blog.author?.name || (blog.author === user._id ? user.name : "Bilinmiyor")}
                    </span>
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Tarih: {new Date(blog.createdAt).toLocaleDateString("tr-TR")}
                  </p>

                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleEditClick(blog)}
                      className="flex items-center gap-1 text-[#8C7A64] hover:text-[#555936]"
                    >
                      <FaEdit />
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
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
