import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slice/authSlice';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/'); // Giriş başarılı ise anasayfaya yönlendir
    }
  }, [user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-yellow-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-10 border-4 border-[#8C7A64]">
        <h1 className="text-3xl font-extrabold text-[#4B5320] mb-2 text-center">Giriş Yap</h1>
        <p className="text-center text-[#6B705C] mb-8">Doğa ve kabile yaşamına katılmak için giriş yapın.</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block relative text-[#4B5320] font-semibold">
            <FaEnvelope className="absolute left-3 top-3 text-[#8C7A64]" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 pr-4 py-3 w-full border-2 border-[#8C7A64] rounded-lg text-[#3F4E00] placeholder-[#A4A49A] focus:outline-none focus:ring-2 focus:ring-[#A3B18A] transition"
              disabled={loading}
            />
          </label>

          <label className="block relative text-[#4B5320] font-semibold">
            <FaLock className="absolute left-3 top-3 text-[#8C7A64]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10 py-3 w-full border-2 border-[#8C7A64] rounded-lg text-[#3F4E00] placeholder-[#A4A49A] focus:outline-none focus:ring-2 focus:ring-[#A3B18A] transition"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-[#8C7A64] hover:text-[#555936] transition"
              aria-label={showPassword ? 'Parolayı gizle' : 'Parolayı göster'}
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8C7A64] text-white py-3 rounded-lg font-semibold hover:bg-[#555936] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            <FaLock />
          </button>
        </form>
        <p className="mt-6 text-center text-[#4B5320] font-medium">
          Hesabınız yok mu?{' '}
         
            <Link href="/auth/register" className="text-[#8C7A64] hover:text-[#555936] font-semibold underline cursor-pointer">
              Kayıt Ol
            </Link>
        </p>
      </div>
    </div>
  );
}
