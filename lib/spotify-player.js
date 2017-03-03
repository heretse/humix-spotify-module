var SpotifyWebApi = require('spotify-web-api-node');
var Player = require('player');

const searchWords = "shape of you artist:Ed Sheeran";
//"sugar artist:Maroon 5";
//"I don't wanna live forever";

var logger;
var spotifyApi;
var player = new Player();

var SpotifyPlayer = function(option, log) {
  this.logger = log;
  this.config = option;

  if (!logger) {
    logger = require('humix-logger').createLogger('spotify-player', { consoleLevel: 'debug', filename: 'spotify-player.log' });
  }

  logger.info('SpotifyPlayer instance created.');
};

SpotifyPlayer.prototype.init = function() {
  // credentials are optional
  this.spotifyApi = new SpotifyWebApi({
    clientId : this.config.clientId,
    clientSecret : this.config.clientSecret,
    //  redirectUri : 'http://www.example.com/callback'
  });

  // Retrieve an access token
  this.spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      logger.log('The access token expires in ' + data.body['expires_in']);
      logger.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
      logger.log('Something went wrong when retrieving an access token', err.message);
  });
}

SpotifyPlayer.prototype.playSong = function(songName, artistName) {
  
  var self = this;

  var query = songName;
  if (artistName) {
      query += ' artist:' + artistName;
  }

  self.spotifyApi.search(query, ['track'], {limit: 5, offset: 1})
    .then(function(data) {
      logger.info('Track for "' + query + '": ', JSON.stringify(data.body));
      if (data.body.tracks.items.length > 0) {
        var trackObj = data.body.tracks.items[0];
        
        player.add(trackObj.preview_url);
        player.play();
      }
    }, function(err) {
      logger.error(err);
    });
};

SpotifyPlayer.prototype.pausePlaying = function() {
  var self = this;

  self.player.pause();
};

SpotifyPlayer.prototype.stopPlaying = function() {
  var self = this;

  self.player.stop();
};

// Search artist
/*
spotifyApi.search("Ed Sheeran", ['artist'], { limit : 5, offset : 1 })
  .then(function(data) {
    console.log('Artist for "Ed Shreen": ', data.body);
  }, function(err) {
    console.error(err);
  });*/

// Search Track
/*

*/
// Get Ed Sheeran' albums
/*
spotifyApi.getArtistAlbums('607oAIdIe0j0JCsch5U3nD')
  .then(function(data) {
    console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });
*/

module.exports = SpotifyPlayer;