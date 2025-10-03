export async function POST(request) {
  const { musicUrl } = await request.json();
  
  if (!musicUrl) {
    return Response.json({ error: 'Music URL is required' }, { status: 400 });
  }

  try {
    // Detect platform from URL
    const platform = detectPlatform(musicUrl);
    
    let trackData;
    
    if (platform === 'spotify') {
      // Use fast Spotify API for Spotify links
      trackData = await getSpotifyData(musicUrl);
    } else {
      // Use Odesli for all other platforms
      trackData = await getOdesliData(musicUrl);
    }
    
    return Response.json(trackData);
  } catch (error) {
    console.error('Error fetching music data:', error);
    return Response.json({ 
      error: 'Failed to fetch music data',
      fallback: {
        title: 'Unknown Track',
        artist: 'Unknown Artist',
        albumArt: null,
        odesliUrl: musicUrl,
        platforms: {}
      }
    }, { status: 500 });
  }
}

function detectPlatform(url) {
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('tidal.com')) return 'tidal';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('music.apple.com')) return 'apple';
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('bandcamp.com')) return 'bandcamp';
  return 'other';
}

async function getSpotifyData(spotifyUrl) {
  // Extract track ID from Spotify URL
  const trackId = spotifyUrl.split('/track/')[1]?.split('?')[0];
  
  if (!trackId) {
    throw new Error('Invalid Spotify URL');
  }

  // Get Spotify access token with timeout
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(5000) // 5 second timeout
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to get Spotify token');
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Get track data from Spotify with timeout
  const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    signal: AbortSignal.timeout(5000) // 5 second timeout
  });

  if (!trackResponse.ok) {
    throw new Error('Failed to fetch Spotify track data');
  }

  const trackData = await trackResponse.json();

  // Get Odesli links for cross-platform support
  let odesliData = { odesliUrl: spotifyUrl, platforms: {} };
  try {
    const odesliResponse = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}`, {
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    if (odesliResponse.ok) {
      const odesliResult = await odesliResponse.json();
      odesliData = {
        odesliUrl: odesliResult.pageUrl || spotifyUrl,
        platforms: odesliResult.linksByPlatform || {}
      };
    }
  } catch (error) {
    console.warn('Odesli request failed, using original URL:', error);
  }

  return {
    trackId,
    title: trackData.name,
    artist: trackData.artists.map(artist => artist.name).join(', '),
    albumArt: trackData.album.images[0]?.url || null,
    previewUrl: trackData.preview_url,
    odesliUrl: odesliData.odesliUrl,
    platforms: odesliData.platforms,
    originalUrl: spotifyUrl,
    platform: 'spotify'
  };
}

async function getOdesliData(musicUrl) {
  // Use Odesli for non-Spotify platforms with timeout
  const response = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(musicUrl)}`, {
    signal: AbortSignal.timeout(8000) // 8 second timeout for Odesli
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch from Odesli');
  }
  
  const data = await response.json();
  
  // Extract metadata from Odesli response structure
  // Odesli returns data in different formats, so we need to check multiple possible locations
  let title = 'Unknown Track';
  let artist = 'Unknown Artist';
  let albumArt = null;
  
  // Check for entity data (most common structure)
  if (data.entity) {
    title = data.entity.title || data.entity.name || title;
    artist = data.entity.artistName || data.entity.artist || artist;
    albumArt = data.entity.thumbnailUrl || data.entity.imageUrl || albumArt;
  }
  
  // Fallback to root level properties
  if (title === 'Unknown Track') {
    title = data.title || data.name || title;
  }
  if (artist === 'Unknown Artist') {
    artist = data.artistName || data.artist || artist;
  }
  if (!albumArt) {
    albumArt = data.thumbnailUrl || data.imageUrl || data.coverArtUrl || albumArt;
  }
  
  // Additional fallback: try to extract from platform-specific data
  if (title === 'Unknown Track' || artist === 'Unknown Artist') {
    const platform = detectPlatform(musicUrl);
    const platformData = data.linksByPlatform?.[platform];
    if (platformData) {
      if (title === 'Unknown Track' && platformData.title) {
        title = platformData.title;
      }
      if (artist === 'Unknown Artist' && platformData.artistName) {
        artist = platformData.artistName;
      }
    }
  }
  
  return {
    trackId: null,
    title,
    artist,
    albumArt,
    previewUrl: null,
    odesliUrl: data.pageUrl || musicUrl,
    platforms: data.linksByPlatform || {},
    originalUrl: musicUrl,
    platform: detectPlatform(musicUrl)
  };
}
