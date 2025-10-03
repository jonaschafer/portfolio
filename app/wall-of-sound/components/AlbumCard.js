'use client';

import { useState } from 'react';
import { Play, ExternalLink, X } from 'lucide-react';

export default function AlbumCard({ song, onPlay }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showServices, setShowServices] = useState(false);

  return (
    <>
      <div className="group">
        {/* Album Cover with Shelf */}
        <div className="relative mb-4">
          {/* Album Artwork */}
          <div 
            className="relative shadow-lg cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onPlay(song)}
          >
            <div className="relative aspect-square overflow-hidden shadow-md">
              <img 
                src={song.album_art || '/placeholder-album.png'} 
                alt={`${song.title} by ${song.artist}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23FFDAD9" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%232D1F0F" font-family="Arial" font-size="20"%3EAlbum Art%3C/text%3E%3C/svg%3E';
                }}
              />
              
              {/* Hover Play Overlay */}
              <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} md:opacity-0 md:group-hover:opacity-100`}>
                <div className="bg-white hover:bg-gray-100 p-4 rounded-full transition-all transform hover:scale-110">
                  <Play size={28} fill="#2D1F0F" className="text-text-dark" />
                </div>
              </div>
            </div>
          </div>

          {/* Wooden Shelf */}
          <div className="absolute -bottom-3 left-0 right-0 h-3 bg-gradient-to-b from-shelf-top to-shelf-bottom shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-shelf-mid/60 to-transparent opacity-60" />
            <div className="absolute inset-0 shadow-[0px_1px_0px_0px_inset_rgba(255,255,255,0.1)]" />
          </div>

          {/* Shadow under shelf */}
          <div 
            className="absolute -bottom-5 left-2 right-2 h-6 blur-md"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 70%)'
            }}
          />
        </div>

        {/* Track Info */}
        <div className="flex items-start justify-between gap-2 mt-6">
          <div className="flex-1 min-w-0">
            <p className="text-text-dark text-sm font-normal truncate leading-5">
              {song.artist}
            </p>
            <p className="text-text-secondary text-xs font-normal truncate leading-4">
              {song.title}
            </p>
          </div>

                {/* Find It Button */}
                <button
                  onClick={() => window.open(song.odesli_url, '_blank')}
                  className="flex-shrink-0 border border-text-dark rounded px-1.5 py-0.5 flex items-center gap-1 hover:bg-text-dark hover:text-primary transition-colors group/button"
                >
                  <span className="text-text-dark text-[11px] font-medium group-hover/button:text-primary">Find it</span>
                  <ExternalLink size={13} className="text-text-dark group-hover/button:text-primary" />
                </button>
        </div>

        {/* Description - Full Width */}
        {song.description && (
          <p className="text-text-secondary text-xs font-normal mt-2 line-clamp-2 leading-4">
            {song.description}
          </p>
        )}
      </div>

      {/* Service Links Modal */}
      {showServices && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowServices(false)}>
          <div 
            className="bg-primary rounded-lg p-8 max-w-md w-full border-2 border-text-dark shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-dark">Listen on your favorite service</h2>
              <button onClick={() => setShowServices(false)} className="text-text-dark hover:opacity-60 transition-opacity">
                <X size={28} />
              </button>
            </div>
            <div className="space-y-3">
              <ServiceLink icon="🎵" name="Tidal" url={song.odesli_url} primary />
              <ServiceLink icon="▶️" name="YouTube" url={song.odesli_url} />
              <ServiceLink icon="🎧" name="Apple Music" url={song.odesli_url} />
              <ServiceLink icon="🎼" name="Deezer" url={song.odesli_url} />
              <ServiceLink icon="🎤" name="Amazon Music" url={song.odesli_url} />
              <ServiceLink icon="📻" name="Pandora" url={song.odesli_url} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ServiceLink({ icon, name, url, primary }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
        primary 
          ? 'bg-text-dark text-primary hover:opacity-90' 
          : 'bg-white/50 text-text-dark hover:bg-white/80'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium flex-1">{name}</span>
      <ExternalLink size={18} />
    </a>
  );
}
