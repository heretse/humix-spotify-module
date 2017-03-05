'use strict';

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
  var self = this;

  // credentials are optional
  self.spotifyApi = new SpotifyWebApi({
    clientId : self.config.spotify.clientId,
    clientSecret : self.config.spotify.clientSecret,
    //  redirectUri : 'http://www.example.com/callback'
  });

  // Retrieve an access token
  self.spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      logger.info('The access token expires in ' + data.body['expires_in']);
      logger.info('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      self.spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
      logger.info('Something went wrong when retrieving an access token', err.message);
  });

  initPlayer();
}

function initPlayer() {
  
  // event: on playing 
  player.on('playing', function(item) {
    logger.info('im playing... src: ' + JSON.stringify(item));
  });
  
  // event: on playend 
  player.on('playend', function(item) {
    // return a playend item 
    logger.info('src: ' + item + ' play done, switching to next one ...');

  });
  
  // event: on error 
  player.on('error', function(err) {
    // when error occurs 
    logger.info(err);
  });
}

SpotifyPlayer.prototype.playSong = function(songName, artistName) {
  
  var self = this;

  var query = songName;
  if (artistName) {
      query += ' artist:' + artistName;
  }

  logger.info('query for track on Spotify: ' + query);

  self.spotifyApi.search(query, ['track'], {limit: 5, offset: 0})
    .then(function(data) {
      logger.info('====== Track for "' + query + '" ======');

      var playIndex = 0;
      if (player.list) {
        playIndex = player.list.length;
      }

      for (var i in data.body.tracks.items) {
        if (i != 0) {
          logger.info('--------------------');
        }
        var trackObj = data.body.tracks.items[i];
        
        logger.info(' Album: ' + trackObj.album.name);
        logger.info(' Artist: ' + trackObj.artists[0].name);
        logger.info(' Track: ' + trackObj.name);
        logger.info(' Preview URL: ' + trackObj.preview_url);

        player.add(trackObj.preview_url);
      }

      if (data.body.tracks.items.length > 0) {
        if (player && player.playing) {
          player.stop();
        }

        player.play(playIndex);
      }
    }, function(err) {
      logger.error(err);
    });
};

SpotifyPlayer.prototype.pausePlaying = function() {
  player.pause();
};

SpotifyPlayer.prototype.resumePlaying = function() {
  player.pause();
};

SpotifyPlayer.prototype.stopPlaying = function() {
  player.stop();
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