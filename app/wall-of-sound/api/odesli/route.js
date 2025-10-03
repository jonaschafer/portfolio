export async function POST(request) {
  const { spotifyUrl } = await request.json();
  
  try {
    const response = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(spotifyUrl)}`);
    const data = await response.json();
    
    return Response.json({
      odesliUrl: data.pageUrl || spotifyUrl,
      platforms: data.linksByPlatform || {},
    });
  } catch (error) {
    // If Odesli fails, return the original Spotify URL
    return Response.json({
      odesliUrl: spotifyUrl,
      platforms: {},
    });
  }
}
