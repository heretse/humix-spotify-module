var HumixSense = require('humix-sense');
var SpotifyPlayer = require('./index');
var fs = require('fs');
//var moduleConfig = require('./config.js');

var config = {
    "moduleName": "humix-spotify-module",
    "commands": ["play-spotify", "pause-spotify", "resume-spotify", "stop-spotify", "next-spotify"],
    "events": [],
    "log": {
        file: 'humix-spotify-module.log',
        fileLevel: 'info',
        consoleLevel: 'debug'
    }
};

var humix = new HumixSense(config);
var spotify;
var hsm;
var logger;

console.log('========= starting ===========');

humix.on('connection', function(humixSensorModule) {
    hsm = humixSensorModule;

    logger = hsm.getLogger();

    logger.info('access config');
    var conf = hsm.getDefaultConfig();

    if (!conf) {

        if (fs.existsSync('./config.js')) {

            logger.info('using local config file')
            conf = require('./config.js');

        } else {

            logger.error('fail to load conversation config. Exit');
            process.exit(1);
        }

    }

    logger.info('loading config: ' + JSON.stringify(conf));
    spotify = new SpotifyPlayer(conf, logger)
    spotify.init();

    logger.info('Communication with humix-sense is now ready.');

    hsm.on("play-spotify", function(data) {
        logger.info('received play-spotify data: ' + data);

        // TODO : Check the type of data.
        var re = /\{.*\}/;
        if (data.match(re)) {
            var obj = JSON.parse(data);

            if (obj.songName || obj.artistName) {
                logger.info("obj.songName = " + obj.songName);
                logger.info("obj.artistName = " + obj.artistName);
                spotify.playSong(obj.songName, obj.artistName);
                return;
            } else if (obj.ownerId && obj.playlistId) {
                spotify.playByPlaylist(obj.ownerId, obj.playlistId);
                return;
            } else if (obj.searchPlaylist) {
                spotify.playPlaylistBySearch(obj.searchPlaylist);
                return;
            } else if (obj.artistId) {
                spotify.playTopTracksForArtist(obj.artistId);
                return;
            }

        } else {
            spotify.playSong(data);
        }
    });

    hsm.on("pause-spotify", () => {
        spotify.pausePlaying();
    });

    hsm.on("resume-spotify", () => {
        spotify.resumePlaying();
    });

    hsm.on("stop-spotify", () => {
        spotify.stopPlaying();
    });

    hsm.on("next-spotify", () => {
        spotify.nextSong();
    });

});