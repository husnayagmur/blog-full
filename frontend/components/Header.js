import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaSearch, FaInstagram, FaTwitter, FaFacebookF, FaUsers } from 'react-icons/fa';
import Dropdown from './Dropdown';

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <div className="flex flex-col gap-4 items-center">
            <div className='bg-[#F2F2F2] w-full'>
                <div className='flex flex-row gap-2 justify-end m-2'>
                    <div className="w-10 h-10 flex items-center justify-center rounded-md border border-[#262610] cursor-pointer">
                        <FaSearch size={20} />
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-md border border-[#262610] cursor-pointer">
                        <FaInstagram size={20} />
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-md border border-[#262610] cursor-pointer">
                        <FaTwitter size={20} />
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-md border border-[#262610] cursor-pointer">
                        <FaFacebookF size={20} />
                    </div>
                    <Link href="/login">
                        <div className="w-40 h-10 ml-4 flex items-center justify-center gap-2 rounded-md border border-[#262610] cursor-pointer px-3">
                            <FaUsers size={20} />
                            <h6 className="text-sm font-medium">Kullanıcı Girişi</h6>
                        </div>
                    </Link>
                </div>
            </div>

<div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="font-bold text-4xl">Toprağın Çocukları</h1>
          <span className="text-md text-[#8C7A64]">
            “Doğayla bir olan kabilelerin inançları, ritüelleri ve yaşam biçimleri.”
          </span>
        </div>
        <div className="flex flex-row gap-16 relative">
          <Link href="/" className="font-semibold cursor-pointer text-[#555936]">Anasayfa</Link>
          <Link href="/blog/bloglar" className="font-semibold cursor-pointer">Bloglar</Link>

          {/* Kategoriler ve Dropdown container */}
          <div className="relative" ref={dropdownRef}>
            <span
              className="font-semibold cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Kategoriler
            </span>

            {showDropdown && (
              <div className="absolute top-full left-0 mt-1 z-50">
                <Dropdown onClose={() => setShowDropdown(false)} />
              </div>
            )}
          </div>

          <Link href="/hakkimizda/hakkimizda" className="font-semibold cursor-pointer">Hakkımızda</Link>
        </div>
      </div>
    </div>
    );
}
