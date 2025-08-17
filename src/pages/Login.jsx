import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import useLoading from '../hooks/useLoading';
import { CiMail, CiLock } from 'react-icons/ci';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    withLoading(async () => {
      const toastId = toast.loading('กำลังเข้าสู่ระบบ')
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
        toast.success('เข้าสู่ระบบสำเร็จ!', {
          id: toastId,
        })
      } catch (err) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        toast.error('เข้าสู่ระบบไม่สำเร็จ', {
          id: toastId,
        })
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-indigo-600 dark:text-indigo-400 mb-6">
          เข้าสู่ระบบ DevHub 🧑‍💻
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <CiMail className="absolute left-3 top-3 text-xl text-gray-400" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <CiLock className="absolute left-3 top-3 text-xl text-gray-400" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ยังไม่มีบัญชี?{' '}
          <a
            href="/register"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  );
}