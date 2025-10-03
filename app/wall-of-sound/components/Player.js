'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';

export default function Player({ song, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (song.preview_url && audioRef.current) {
      audioRef.current.src = song.preview_url;
      audioRef.current.load(); // Load the audio source
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('Autoplay failed:', error);
        setIsPlaying(false);
      });
    }
  }, [song]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Play failed:', error);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-text-dark p-4 z-50 shadow-2xl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Album Art */}
        <div className="bg-white p-1 shadow-md flex-shrink-0">
          <img 
            src={song.album_art} 
            alt={song.title}
            className="w-16 h-16 object-cover"
          />
        </div>
        
        {/* No Preview Available Message */}
        {!song.preview_url && (
          <div className="text-xs text-text-secondary bg-primary/50 px-3 py-2 rounded border border-text-dark/20">
            🎵 Preview not available - Click "Find it" to listen on your preferred service
          </div>
        )}
        
        {/* Track Info & Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate text-text-dark">{song.title}</div>
              <div className="text-sm text-text-secondary truncate">{song.artist}</div>
            </div>
            
            {/* Playback Controls */}
            <div className="flex items-center gap-3 ml-4">
              <button className="text-text-dark hover:opacity-60 transition-opacity opacity-50 cursor-not-allowed">
                <SkipBack size={20} />
              </button>
              {song.preview_url ? (
                <button 
                  onClick={togglePlay}
                  className="bg-text-dark text-primary p-3 rounded-full transition-all hover:opacity-90"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              ) : (
                <button 
                  disabled
                  className="bg-text-dark/30 text-primary/50 p-3 rounded-full cursor-not-allowed"
                >
                  <Play size={20} />
                </button>
              )}
              <button className="text-text-dark hover:opacity-60 transition-opacity opacity-50 cursor-not-allowed">
                <SkipForward size={20} />
              </button>
            </div>
            
            <button onClick={onClose} className="text-text-dark hover:opacity-60 transition-opacity ml-4">
              <X size={24} />
            </button>
          </div>
          
          {/* Progress Bar */}
          {song.preview_url ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary">{formatTime(currentTime)}</span>
              <div 
                className="flex-1 h-2 bg-text-dark/10 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-2 bg-text-dark rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-text-secondary">{formatTime(duration)}</span>
            </div>
          ) : (
            <div className="text-xs text-text-secondary">
              No preview available for this track
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
