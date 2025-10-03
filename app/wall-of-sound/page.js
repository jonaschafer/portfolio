'use client';

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import MusicWall from './components/MusicWall';
import { useRouter } from 'next/navigation';
import WallOfSoundNavigation from '../../components/WallOfSoundNavigation';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session) {
          router.push('/wall-of-sound/login');
        }
      }).catch((error) => {
        console.error('Error getting session:', error);
        setLoading(false);
        router.push('/wall-of-sound/login');
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          router.push('/wall-of-sound/login');
        }
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error initializing auth:', error);
      setLoading(false);
      router.push('/wall-of-sound/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFDAD9]">
        <WallOfSoundNavigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#1e1e1e] font-geist">Loading...</div>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#FFDAD9]">
        <WallOfSoundNavigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-black text-[#1e1e1e] mb-4">
              «« wall of sound »»
            </h1>
            <p className="text-[#1e1e1e] mb-8">
              Supabase configuration required to use this feature.
            </p>
            <a 
              href="/" 
              className="bg-[#1e1e1e] text-[#FFDAD9] px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Back to Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-[#FFDAD9]">
      <WallOfSoundNavigation />
      <MusicWall user={user} />
    </div>
  );
}
