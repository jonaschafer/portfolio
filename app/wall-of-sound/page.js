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

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        router.push('/wall-of-sound/login');
      }
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

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary">
        <WallOfSoundNavigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-text-dark font-geist">Loading...</div>
        </div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-primary">
        <WallOfSoundNavigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-black text-text-dark mb-4">
              «« wall of sound »»
            </h1>
            <p className="text-text-dark mb-8">
              Supabase configuration required to use this feature.
            </p>
            <a 
              href="/" 
              className="bg-text-dark text-primary px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
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
    <div className="min-h-screen bg-primary">
      <Navigation />
      <MusicWall user={user} />
    </div>
  );
}
