let accessToken = '';
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (accessToken !== '' && accessToken.length > 0) {
      return accessToken;
    } else if (window.location.href.search('access_token') !== -1) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      const expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${ clientId }&response_type=token&scope=playlist-modify-public&redirect_uri=${ redirectUri }`;
    }
  },

  async search(term) {
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${ term }`, {
      headers: {
        Authorization: `Bearer ${ this.getAccessToken() }`
      }
    })

    const jsonResponse = await response.json();

    if (!jsonResponse.tracks) {
      return [];
    }

    const tracks = jsonResponse.tracks.items.map(track => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      };
    });

    return tracks;
  },

  async savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
      return;
    }

    const headers = { Authorization: `Bearer ${ this.getAccessToken() }` };
    let userId = '';

    try {
      let response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: headers
      });
      let jsonResponse = await response.json();

      userId = jsonResponse.id;

      headers['Content-Type'] = 'application/json';

      response = await fetch(`https://api.spotify.com/v1/users/${ userId }/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name: playlistName })
      });
      jsonResponse = await response.json();

      const playlistId = jsonResponse.id;

      response = await fetch(`https://api.spotify.com/v1/playlists/${ playlistId }/tracks`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ uris: trackURIs })
      });
      await response.json();
    } catch (e) {
      console.log(e);
    }
  }
};

export default Spotify;