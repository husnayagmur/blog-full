// components/Register.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '@/redux/slice/authSlice';
import { useRouter } from 'next/router';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Redux ile kullanıcı kaydını başlat
      const userData = { name, email, password };
      dispatch(registerUser(userData)).then((result) => {
        if (result.error) {
          setError(result.error.message); // Hata varsa kullanıcıya göster
        } else {
          // Başarılı kayıt sonrası login sayfasına yönlendir
          router.push('/auth/login');
        }
      });
    } catch (err) {
      setError('Kayıt başarısız. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-yellow-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-10 border-4 border-[#8C7A64]">
        <h1 className="text-3xl font-extrabold text-[#4B5320] mb-2 text-center">Kayıt Ol</h1>
        <p className="text-center text-[#6B705C] mb-8">Doğa ve kabile yaşamına katılmak için kayıt olun.</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* İsim */}
          <label className="block relative text-[#4B5320] font-semibold">
            <FaUser className="absolute left-3 top-3 text-[#8C7A64]" />
            <input
              type="text"
              placeholder="İsim"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-10 pr-4 py-3 w-full border-2 border-[#8C7A64] rounded-lg text-[#3F4E00] placeholder-[#A4A49A] focus:outline-none focus:ring-2 focus:ring-[#A3B18A] transition"
            />
          </label>

          {/* Email */}
          <label className="block relative text-[#4B5320] font-semibold">
            <FaEnvelope className="absolute left-3 top-3 text-[#8C7A64]" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 pr-4 py-3 w-full border-2 border-[#8C7A64] rounded-lg text-[#3F4E00] placeholder-[#A4A49A] focus:outline-none focus:ring-2 focus:ring-[#A3B18A] transition"
            />
          </label>

          {/* Parola */}
          <label className="block relative text-[#4B5320] font-semibold">
            <FaLock className="absolute left-3 top-3 text-[#8C7A64]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10 py-3 w-full border-2 border-[#8C7A64] rounded-lg text-[#3F4E00] placeholder-[#A4A49A] focus:outline-none focus:ring-2 focus:ring-[#A3B18A] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-[#8C7A64] hover:text-[#555936] transition"
              aria-label={showPassword ? 'Parolayı gizle' : 'Parolayı göster'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          {/* Submit Butonu */}
          <button
            type="submit"
            className="w-full bg-[#8C7A64] text-white py-3 rounded-lg font-semibold hover:bg-[#555936] transition flex items-center justify-center gap-2"
          >
            Kayıt Ol
            <FaUser />
          </button>
        </form>

        <p className="mt-6 text-center text-[#6B705C] text-sm">
          Zaten hesabın var mı?{' '}
          <a
            href="/auth/login"
            className="text-[#8C7A64] font-semibold hover:underline cursor-pointer"
          >
            Giriş Yap
          </a>
        </p>
      </div>
    </div>
  );
}
