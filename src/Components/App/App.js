import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  updatePlaylistName(newName) {
    this.setState({
      playlistName: newName
    });
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      const newPlaylist = this.state.playlistTracks;
      newPlaylist.push(track);
      this.setState({
        playlistTracks: newPlaylist
      });
    }
  }

  removeTrack(track) {
    const newPlaylist = this.state.playlistTracks.filter(playlistTrack => {
      return playlistTrack.id !== track.id;
    });
    this.setState({
      playlistTracks: newPlaylist
    });
  }

  async savePlaylist() {
    const trackURIs = [];
    this.state.playlistTracks.forEach(track => trackURIs.push(track.uri));

    await Spotify.savePlaylist(this.state.playlistName, trackURIs);

    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  async search(term) {
    const results = await Spotify.search(term);
    
    this.setState({
      searchResults: results
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={ this.search } />
          <div className="App-playlist">
            <SearchResults searchResults={ this.state.searchResults } onAdd={ this.addTrack } />
            <Playlist playlistName={ this.state.playlistName } playlistTracks={ this.state.playlistTracks } onNameChange={ this.updatePlaylistName } onRemove={ this.removeTrack } onSave={ this.savePlaylist } />
          </div>
        </div>
      </div>
    );
  }
}

export default App;