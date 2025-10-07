'use client';

import { useState } from 'react';
import { Play, ExternalLink, X } from 'lucide-react';

export default function AlbumCard({ song }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showServices, setShowServices] = useState(false);

  return (
    <>
      <div className="group w-full max-w-[280px]">
        {/* Album Cover with Shelf */}
        <div className="relative mb-4">
          {/* Album Artwork */}
          <div 
            className="relative shadow-lg cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => window.open(song.odesli_url, '_blank')}
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
              
              {/* Hover Play Overlay - Desktop only */}
              <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} hidden md:flex md:opacity-0 md:group-hover:opacity-100`}>
                <div className="bg-white hover:bg-gray-100 p-4 rounded-full transition-all transform hover:scale-110">
                  <Play size={28} fill="#2D1F0F" className="text-text-dark" />
                </div>
              </div>
              
              {/* Mobile/Tablet Play Button - Always visible */}
              <div className="absolute bottom-2 right-2 md:hidden">
                <div className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg">
                  <Play size={16} fill="#2D1F0F" />
                </div>
              </div>
            </div>
          </div>

          {/* Wooden Shelf */}
          <div className="absolute -bottom-3 -left-2 -right-2 h-3 bg-gradient-to-b from-[#8B4513] to-[#654321] shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A0522D]/60 to-transparent opacity-60" />
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
        <div className="mt-6">
          <p className="text-[#1e1e1e] text-sm font-normal truncate leading-5">
            {song.artist}
          </p>
          <p className="text-[#1e1e1e]/70 text-xs font-normal truncate leading-4">
            {song.title}
          </p>
        </div>

        {/* Description - Full Width */}
        {song.description && (
          <p className="text-[#1e1e1e]/70 text-xs font-normal mt-2 line-clamp-2 leading-4">
            {song.description}
          </p>
        )}
      </div>

      {/* Service Links Modal */}
      {showServices && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowServices(false)}>
          <div 
            className="bg-[#FFDAD9] rounded-lg p-8 max-w-md w-full border-2 border-[#1e1e1e] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1e1e1e]">Listen on your favorite service</h2>
              <button onClick={() => setShowServices(false)} className="text-[#1e1e1e] hover:opacity-60 transition-opacity">
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
          ? 'bg-[#1e1e1e] text-[#FFDAD9] hover:opacity-90' 
          : 'bg-white/50 text-[#1e1e1e] hover:bg-white/80'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium flex-1">{name}</span>
      <ExternalLink size={18} />
    </a>
  );
}
