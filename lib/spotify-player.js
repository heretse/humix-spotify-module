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
        clientId: self.config.spotify.clientId,
        clientSecret: self.config.spotify.clientSecret,
        redirectUri : self.config.spotify.redirectUri
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

    self.spotifyApi.search(query, ['track'], { limit: 15, offset: 0 })
        .then(function(data) {
            logger.info('====== Track for "' + query + '" ======');

            addTracksIntoPlayer(data.body.tracks.items);
        }, function(err) {
            logger.error(err);
        });
};

SpotifyPlayer.prototype.pausePlaying = function() {
    if (player && player.playing && !player.paused) {
        player.pause();
    }
};

SpotifyPlayer.prototype.resumePlaying = function() {
    if (player && player.playing && player.paused) {
        player.pause();
    }
};

SpotifyPlayer.prototype.stopPlaying = function() {
    player.stop();
};

SpotifyPlayer.prototype.nextSong = function() {
    player.next();
};

SpotifyPlayer.prototype.playByPlaylist = function(ownerId, playlistId) {
    var self = this;

    logger.info('query tracks in playlist on Spotify by ownerId: ' + ownerId, ' and playlistId: ' + playlistId);

    var trackItems = new Array();
    self.spotifyApi.getPlaylistTracks(ownerId, playlistId, { offset: 0 }, (error, data) => {
        if (error) {
            logger.debug(JSON.stringify(error));
            return;
        }

        for (var i = 0; i < data.body.items.length; i++) {
            var trackItem = data.body.items[i];
            trackItems.push(trackItem.track);
        }

        addTracksIntoPlayer(trackItems);
    });
}

SpotifyPlayer.prototype.playPlaylistBySearch = function(query) {

    var self = this;

    logger.info('query for playlist on Spotify: ' + query);

    var trackItems = new Array();
    // Search playlists
    self.spotifyApi.searchPlaylists(query, { offset: 0 })
        .then(function(data1) {

                for (var i = 0; i < 5; i++) {
                    let random1 = getRandomInt(data1.body.playlists.items.length);

                    var playlistObj = data1.body.playlists.items[random1];

                    self.spotifyApi.getPlaylistTracks(playlistObj.owner.id, playlistObj.id, { offset: 0 }, (error, data2) => {
                        if (error) {
                            logger.debug(JSON.stringify(error));
                            return;
                        }

                        for (var j = 0; j < 3; j++) {
                            let random2 = getRandomInt(data2.body.items.length);

                            var trackItem = data2.body.items[random2];
                            trackItems.push(trackItem.track);
                        }

                        if (trackItems.length === 15) {
                            addTracksIntoPlayer(trackItems);
                        }
                    });
                }
            },
            function(err) {
                logger.error(err);
            });
};

SpotifyPlayer.prototype.playSpecificPlaylist = function(userId, playlistId) {
    var self = this;

    logger.info('query for playlist on Spotify by userId: ' + userId + 'and playlistId:' + playlistId);

    var trackItems = new Array();
    // Search playlists
    self.spotifyApi.getPlaylist(userId, playlistId, { limit: 50, offset: 0 }, (error, data1) => {
        for (var i in data1.body.items) {
            var playlistObj = data1.body.items[i];

            self.spotifyApi.getPlaylistTracks(playlistObj.owner.id, playlistObj.id, { limit: 50, offset: 0 }, (error, data2) => {
                if (error) {
                    logger.debug(JSON.stringify(error));
                    return;
                }

                for (var j in data2.body.items) {
                    var trackItem = data2.body.items[j];

                    trackItems.push(trackItem.track);
                }

                if (i == (data1.body.items.length - 1)) {
                    addTracksIntoPlayer(trackItems);
                }
            });
        }
    });
};

SpotifyPlayer.prototype.playTopTracksForArtist = function(artistId) {
    var self = this;

    logger.info('query for top tracks on Spotify by artistId: ' + artistId);

    var trackItems = new Array();
    // Get artist top tracks
    self.spotifyApi.getArtistTopTracks(artistId, "TW", (error, data) => {
        for (var i in data.body.tracks) {
            trackItems.push(data.body.tracks[i]);

            if (i == (data.body.tracks.length - 1)) {
                addTracksIntoPlayer(trackItems);
            }
        }
    });
};

function addTracksIntoPlayer(trackItems) {
    if (!trackItems) {
        return;
    }

    var playIndex = 0;
    if (player.list) {
        playIndex = player.list.length;
    }

    for (var i in trackItems) {
        if (i != 0) {
            logger.info('--------------------');
        }
        var track = trackItems[i];

        logger.info(' Album: ' + track.album.name);
        logger.info(' Artist: ' + track.artists[0].name);
        logger.info(' Track: ' + track.name);
        logger.info(' Preview URL: ' + track.preview_url);

        if (track.preview_url) {
            player.add(track.preview_url);
        }
    }

    if (trackItems.length > 0) {
        if (player && !player.paused) {
            player.stop();

            // Wait for 1 second to play
            var workaround = setInterval(() => {
                player.play(playIndex);
                clearInterval(workaround);
            }, 1000);
        } else {
            player.play(playIndex);
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = SpotifyPlayer;