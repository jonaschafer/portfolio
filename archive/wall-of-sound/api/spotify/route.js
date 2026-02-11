export async function POST(request) {
  const { spotifyUrl } = await request.json();
  
  // Extract track ID from Spotify URL
  const trackId = spotifyUrl.split('/track/')[1]?.split('?')[0];
  
  if (!trackId) {
    return Response.json({ error: 'Invalid Spotify URL' }, { status: 400 });
  }

  try {
    // Get Spotify access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get track data from Spotify
    const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const trackData = await trackResponse.json();

    return Response.json({
      trackId,
      title: trackData.name,
      artist: trackData.artists.map(artist => artist.name).join(', '),
      albumArt: trackData.album.images[0]?.url || null,
      previewUrl: trackData.preview_url,
    });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch Spotify data' }, { status: 500 });
  }
}
