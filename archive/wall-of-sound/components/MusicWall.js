'use client';

import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import AlbumCard from './AlbumCard';
import AddTrackModal from './AddTrackModal';
import { supabase } from '../lib/supabase';

export default function MusicWall({ user }) {
  const [songs, setSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllGenres, setShowAllGenres] = useState(false);

  useEffect(() => {
    fetchSongs();
    
    // Listen for add track event from navigation
    const handleAddTrack = () => {
      if (user) {
        setShowAddForm(true);
      }
      // If no user, the navigation will handle redirecting to login
    };
    
    window.addEventListener('addTrack', handleAddTrack);
    
    return () => {
      window.removeEventListener('addTrack', handleAddTrack);
    };
  }, []);

  const fetchSongs = async () => {
    const response = await fetch('/wall-of-sound/api/songs');
    const data = await response.json();
    
    if (response.status === 503) {
      // Supabase not configured
      setSongs([]);
    } else {
      setSongs(data);
    }
    setLoading(false);
  };

  const genres = [...new Set(songs.map(song => song.genre))];
  const filteredSongs = selectedGenre 
    ? songs.filter(song => song.genre === selectedGenre)
    : songs;

  const handleAddSong = async (newSong) => {
    setSongs([newSong, ...songs]);
    setShowAddForm(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFDAD9] flex items-center justify-center">
        <div className="text-[#1e1e1e] font-geist">Loading your music wall...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFDAD9]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-7 mb-12">
          {/* Wall of Sound Header Image - Export from Figma and place in public folder */}
          <img src="/wall-of-sound-header.svg" alt="wall of sound" className="w-full max-w-3xl" />
          
          <p className="text-[#1e1e1e] text-lg text-center max-w-2xl font-normal leading-relaxed tracking-wide">
            An on-going collection of recent and long-time faves, tracks on heavy rotation, and/or gems that the world should 100% know about.
          </p>
        </div>

        {/* Genre Filter */}
        {genres.length > 0 && (
          <div className="mb-12">
            <div className={`flex gap-3 flex-wrap justify-center transition-all duration-300 ${
              showAllGenres && genres.length > 8 
                ? 'max-h-32 overflow-y-auto pr-2' 
                : ''
            }`}>
              <button
                onClick={() => setSelectedGenre(null)}
                className={`px-5 py-2 rounded-full text-sm transition-all ${
                  !selectedGenre 
                    ? 'bg-[#1e1e1e] text-[#FFDAD9] font-medium' 
                    : 'bg-white/50 text-[#1e1e1e] hover:bg-white/80'
                }`}
              >
                All
              </button>
              {(showAllGenres ? genres : genres.slice(0, 5)).map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-5 py-2 rounded-full text-sm transition-all ${
                    selectedGenre === genre 
                      ? 'bg-[#1e1e1e] text-[#FFDAD9] font-medium' 
                      : 'bg-white/50 text-[#1e1e1e] hover:bg-white/80'
                  }`}
                >
                  {genre}
                </button>
              ))}
              {genres.length > 5 && (
                <button
                  onClick={() => setShowAllGenres(!showAllGenres)}
                  className="px-5 py-2 rounded-full text-sm transition-all bg-transparent border border-[#1e1e1e] text-[#1e1e1e] hover:bg-[#1e1e1e] hover:text-[#FFDAD9]"
                >
                  {showAllGenres ? 'See less' : `See all ${genres.length - 5}+`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Album Grid - Fully Responsive */}
        {/* 2 columns mobile, 3 tablet (640px+), 4 desktop (1024px+), 5 wide desktop (1600px+) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 pb-32 justify-items-center">
          {filteredSongs.length > 0 ? (
            filteredSongs.map(song => (
              <AlbumCard 
                key={song.id} 
                song={song}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-[#1e1e1e]/60 text-lg">
                {loading ? 'Loading...' : 'No songs found. Add some music to get started!'}
              </p>
            </div>
          )}
        </div>
      </main>

      {showAddForm && (
        <AddTrackModal 
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddSong}
        />
      )}
    </div>
  );
}
