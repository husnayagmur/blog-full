import Link from 'next/link';
import {
  FaHome,
  FaBlog,
  
  FaListAlt,
  FaTags,
  FaComments,
  FaHeart,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow h-screen p-4 fixed flex flex-col justify-between">
      <div>
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-200" />
          <h2 className="mt-2 font-semibold">Hüsna Yağmur</h2>
        </div>
        <nav className="space-y-2">
         <Link href="/admin" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
            <FaHome /> Kontrol Paneli
          </Link>
          <Link href="/admin/blogs" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
            <FaBlog /> Blog Yönetimi
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
            <FaListAlt /> Kategori Yönetimi
          </Link>
          <Link href="/admin/tags" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
            <FaTags /> Etiket Yönetimi
          </Link>
          <Link href="/admin/comments" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
            <FaComments /> Yorum Yönetimi
          </Link>
          <Link href="/admin/likes" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
            <FaHeart /> Beğeni Yönetimi
          </Link>
        </nav>
      </div>

      <div className="space-y-2">
        <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded">
          <FaCog /> Ayarlar
        </button>
       <Link href="/">
  <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded">
    <FaSignOutAlt /> Çıkış Yap
  </button>
</Link>
      </div>
    </aside>
  );
};

export default Sidebar;
