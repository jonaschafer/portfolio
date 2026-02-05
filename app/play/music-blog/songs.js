// Music blog song data
// To add a new song:
// 1. Find the YouTube video ID (the part after v= in the URL)
// 2. Add streaming links (search for the song on each service)
// 3. Write a short note about why you're sharing it

export const songs = [
  {
    id: 'sample-1',
    title: 'Boredom',
    artist: 'Tyler, The Creator',
    date: '2026.02.05',
    youtubeId: 'jxlBOBOZHqI',
    note: 'That piano loop just hits different. The way the beat drops out and comes back in—pure vibe.',
    links: {
      spotify: 'https://open.spotify.com/track/4BftJuEJ83JTwH0JLdAlRB',
      apple: 'https://music.apple.com/us/album/boredom-feat-rex-orange-county-anna-of-the-north/1254572564?i=1254572854',
      tidal: 'https://tidal.com/browse/track/74679556',
      youtube: 'https://www.youtube.com/watch?v=jxlBOBOZHqI'
    }
  },
  {
    id: 'sample-2',
    title: 'Nights',
    artist: 'Frank Ocean',
    date: '2026.02.03',
    youtubeId: 'r4l9bFqgMaQ',
    note: 'The beat switch at 3:30 is one of the best moments in music. Ever.',
    links: {
      spotify: 'https://open.spotify.com/track/7eqoqGkKwgOaWNNHx90uEZ',
      apple: 'https://music.apple.com/us/album/nights/1146195596?i=1146195857',
      tidal: 'https://tidal.com/browse/track/64643542',
      youtube: 'https://www.youtube.com/watch?v=r4l9bFqgMaQ'
    }
  },
  {
    id: 'sample-3',
    title: 'Redbone',
    artist: 'Childish Gambino',
    date: '2026.01.28',
    youtubeId: 'Kp7eSUzdc0',
    note: 'Falsetto that makes you feel like you\'re floating through a 70s fever dream.',
    links: {
      spotify: 'https://open.spotify.com/track/0wXuerDYiBnERgIpbb3JBR',
      apple: 'https://music.apple.com/us/album/redbone/1450828963?i=1450829457',
      tidal: 'https://tidal.com/browse/track/67927051',
      youtube: 'https://www.youtube.com/watch?v=Kp7eSUzdc0'
    }
  }
]
