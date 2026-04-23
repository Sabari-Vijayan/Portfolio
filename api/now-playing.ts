
export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
  const LASTFM_USER = process.env.LASTFM_USER;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5',
  };

  if (!LASTFM_API_KEY || !LASTFM_USER) {
    return new Response(JSON.stringify({ 
      isPlaying: false, 
      error: "Missing Last.fm environment variables" 
    }), { status: 200, headers });
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.recenttracks || !data.recenttracks.track || data.recenttracks.track.length === 0) {
      return new Response(JSON.stringify({ isPlaying: false }), { status: 200, headers });
    }

    const track = data.recenttracks.track[0];
    const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
    
    const title = track.name;
    const artist = track.artist['#text'] || track.artist.name || "Unknown Artist";
    const album = track.album['#text'] || "Unknown Album";
    const albumImageUrl = (track.image && track.image.length > 0) 
      ? track.image[track.image.length - 1]['#text'] 
      : null;
    const songUrl = track.url;

    return new Response(
      JSON.stringify({
        album,
        albumImageUrl,
        artist,
        isPlaying,
        songUrl,
        title,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Last.fm API Error:", error);
    return new Response(JSON.stringify({ isPlaying: false, error: "Internal Server Error" }), { status: 200, headers });
  }
}
