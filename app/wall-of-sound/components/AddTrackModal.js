'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddTrackModal({ onClose, onAdd }) {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!spotifyUrl || !genre || !description) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // Fetch Spotify metadata
      const spotifyRes = await fetch('/api/spotify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotifyUrl })
      });
      const spotifyData = await spotifyRes.json();

      // Fetch Odesli links
      const odesliRes = await fetch('/api/odesli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotifyUrl })
      });
      const odesliData = await odesliRes.json();

      // Save to database
      const saveRes = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spotify_url: spotifyUrl,
          spotify_track_id: spotifyData.trackId,
          album_art: spotifyData.albumArt,
          artist: spotifyData.artist,
          title: spotifyData.title,
          genre: genre,
          description: description,
          odesli_url: odesliData.odesliUrl,
          preview_url: spotifyData.previewUrl
        })
      });

      const newSong = await saveRes.json();
      onAdd(newSong);
      
      setSpotifyUrl('');
      setGenre('');
      setDescription('');
    } catch (error) {
      alert('Error adding track: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-primary rounded-lg p-8 max-w-lg w-full border-2 border-text-dark shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-dark">Add New Track</h2>
          <button onClick={onClose} className="text-text-dark hover:opacity-60 transition-opacity">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-dark">Spotify URL</label>
            <input
              type="url"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="w-full px-4 py-3 bg-white border-2 border-text-dark/20 rounded-lg focus:outline-none focus:border-text-dark text-text-dark placeholder:text-text-dark/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-dark">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Alternative, Hip-Hop, Jazz"
              className="w-full px-4 py-3 bg-white border-2 border-text-dark/20 rounded-lg focus:outline-none focus:border-text-dark text-text-dark placeholder:text-text-dark/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-text-dark">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A sentence or two about this track..."
              rows={3}
              className="w-full px-4 py-3 bg-white border-2 border-text-dark/20 rounded-lg focus:outline-none focus:border-text-dark resize-none text-text-dark placeholder:text-text-dark/40"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-text-dark text-primary py-3 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 font-medium"
          >
            {loading ? 'Adding...' : 'Add to Wall'}
          </button>
        </div>
      </div>
    </div>
  );
}
