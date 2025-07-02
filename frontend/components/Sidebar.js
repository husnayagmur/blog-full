import Link from 'next/link';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white shadow h-screen p-4 fixed">
            <div className="mb-8 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-200" />
                <h2 className="mt-2 font-semibold">Hüsna Yağmur</h2>
            </div>
            <nav className="space-y-2">
                <Link href="/" className="block p-2 hover:bg-gray-100 rounded">Kontrol Paneli</Link>
                <Link href="/admin/blogs" className="block p-2 hover:bg-gray-100 rounded">Blog Yönetimi</Link>
                <Link href="/admin" className="block p-2 hover:bg-gray-100 rounded">Kullanıcı Yönetimi</Link>
                <Link href="/admin/categories" className="block p-2 hover:bg-gray-100 rounded">Kategori Yönetimi</Link>
                <Link href="/admin/tags" className="block p-2 hover:bg-gray-100 rounded">Etiket Yönetimi</Link>
                <Link href="/admin/comments" className="block p-2 hover:bg-gray-100 rounded">Yorum Yönetimi</Link>
                 <Link href="/admin/likes" className="block p-2 hover:bg-gray-100 rounded">Beğeni Yönetimi</Link>
            </nav>
            <div className="absolute bottom-6">
                <button className="block p-2 hover:bg-gray-100 rounded">Ayarlar</button>
                <button className="block p-2 hover:bg-gray-100 rounded">Çıkış Yap</button>
            </div>
        </aside>
    );
};

export default Sidebar;
