'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!supabase) {
      alert('Supabase not configured');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/wall-of-sound');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!supabase) {
      alert('Supabase not configured');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email to confirm your account!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFDAD9] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-lg border-2 border-[#1e1e1e] w-full max-w-md shadow-xl">
        <h1 className="text-4xl font-black text-[#1e1e1e] mb-8 text-center">
          «« wall of sound »»
        </h1>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-[#1e1e1e]/20 rounded-lg text-[#1e1e1e] focus:outline-none focus:border-[#1e1e1e] placeholder:text-[#1e1e1e]/40"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-[#1e1e1e]/20 rounded-lg text-[#1e1e1e] focus:outline-none focus:border-[#1e1e1e] placeholder:text-[#1e1e1e]/40"
          />
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1e1e1e] text-[#FFDAD9] py-3 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 font-medium"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
          
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-white border-2 border-[#1e1e1e] text-[#1e1e1e] py-3 rounded-lg transition-all hover:bg-[#1e1e1e]/5 disabled:opacity-50 font-medium"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
