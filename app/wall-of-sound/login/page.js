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
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-lg border-2 border-text-dark w-full max-w-md shadow-xl">
        <h1 className="text-4xl font-black text-text-dark mb-8 text-center">
          «« wall of sound »»
        </h1>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-text-dark/20 rounded-lg text-text-dark focus:outline-none focus:border-text-dark placeholder:text-text-dark/40"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-text-dark/20 rounded-lg text-text-dark focus:outline-none focus:border-text-dark placeholder:text-text-dark/40"
          />
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-text-dark text-primary py-3 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 font-medium"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
          
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-white border-2 border-text-dark text-text-dark py-3 rounded-lg transition-all hover:bg-text-dark/5 disabled:opacity-50 font-medium"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
