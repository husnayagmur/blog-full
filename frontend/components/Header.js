// components/Header.js
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaInstagram, FaTwitter, FaFacebookF, FaUsers, FaCaretDown } from 'react-icons/fa';
import Dropdown from './Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import {
  setActiveNav,
  toggleCategoryDropdown,
  closeCategoryDropdown,
  toggleUserDropdown,
  closeUserDropdown
} from '@/redux/slice/navigationSlice';
import { logout } from '@/redux/slice/authSlice';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const dropdownRef = useRef();
  const userRef = useRef();

  const { activeNav, showCategoryDropdown, showUserDropdown } = useSelector((state) => state.navigation);
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const navItems = [
    { href: '/', label: 'Anasayfa' },
    { href: '/blog/blogs', label: 'Bloglar' },
    { href: '#categories', label: 'Kategoriler', isDropdown: true },
    { href: '/aboutUs/aboutUs', label: 'Hakkımızda' },
  ];

  const handleCategoryClick = () => {
    dispatch(toggleCategoryDropdown());
    dispatch(closeUserDropdown());
  };

  const handleUserClick = () => {
    dispatch(toggleUserDropdown());
    dispatch(closeCategoryDropdown());
  };

  const handleNavClick = (href) => {
    dispatch(setActiveNav(href));
   
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dispatch(closeCategoryDropdown());
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        dispatch(closeUserDropdown());
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="bg-[#F2F2F2] w-full">
        <div className="flex flex-row gap-2 justify-end m-2">
          {[FaSearch, FaInstagram, FaTwitter, FaFacebookF].map((Icon, i) => (
            <div key={i} className="w-10 h-10 flex items-center justify-center rounded-md border border-[#262610] cursor-pointer">
              <Icon size={20} />
            </div>
          ))}

          {/* Kullanıcı Dropdown */}
          <div className="relative ml-4" ref={userRef}>
            <div
              onClick={handleUserClick}
              className="w-40 h-10 flex items-center justify-center gap-2 rounded-md border border-[#262610] cursor-pointer px-3 select-none"
            >
              <FaUsers size={20} />
              <h6 className="text-sm font-medium flex items-center gap-1">
                {isLoggedIn ? user?.name : 'Kullanıcı'} <FaCaretDown size={12} />
              </h6>
            </div>

            {showUserDropdown && (
              <div className="absolute top-full left-0 bg-white border border-gray-300 rounded shadow-sm w-40 z-50">
                {!isLoggedIn ? (
                  <>
                    <Link href="/auth/login" className="block px-3 py-2 hover:bg-gray-100 rounded">
                      Giriş Yap
                    </Link>
                    <Link href="/auth/register" className="block px-3 py-2 hover:bg-gray-100 rounded">
                      Kayıt Ol
                    </Link>
                  </>
                ) : (
                  <span
                    onClick={() => {
                      dispatch(logout());
                      dispatch(closeUserDropdown());
                      router.push('/');
                    }}
                    className="block px-3 py-2 cursor-pointer hover:bg-gray-100 rounded"
                  >
                    Çıkış Yap
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="font-bold text-4xl font-serif">Toprağın Çocukları</h1>
          <span className="text-md text-[#8C7A64]">
            “Doğayla bir olan kabilelerin inançları, ritüelleri ve yaşam biçimleri.”
          </span>
        </div>
        <div className="flex flex-row gap-16 relative">
          {navItems.map(({ href, label, isDropdown }) => {
            if (isDropdown) {
              return (
                <div
                  key={label}
                  className="relative cursor-pointer font-semibold"
                  style={{ color: activeNav === '#555936' , undefined }}
                  onClick={handleCategoryClick}
                  ref={dropdownRef}
                >
                  {label}
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                      <Dropdown onClose={() => dispatch(closeCategoryDropdown())} />
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <Link
                  key={href}
                  href={href}
                  className="font-semibold cursor-pointer"
                  onClick={() => handleNavClick(href)}
                  style={{ color: activeNav === href ? '#555936' : undefined }}
                >
                  {label}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
