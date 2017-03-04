var HumixSense = require('humix-sense');
var SpotifyPlayer = require('./index');
var fs = require('fs');
//var moduleConfig = require('./config.js');

var config = {
    "moduleName" : "humix-spotify-module",
    "commands" : ["play-spotify", "pause-spotify", "stop-spotify"],
    "events" : [],
    "log" : {
        file : 'humix-spotify-module.log',
        fileLevel : 'info',
        consoleLevel : 'debug'
      }
};

var humix = new HumixSense(config);
var spotify;
var hsm;
var logger;

console.log('========= starting ===========');

humix.on('connection', function(humixSensorModule){
    hsm = humixSensorModule;

    logger = hsm.getLogger();

    logger.info('access config');
    var conf = hsm.getDefaultConfig();

    if(!conf){

        if(fs.existsSync('./config.js')){

            logger.info('using local config file')
            conf = require('./config.js');

        }else{

            logger.error('fail to load conversation config. Exit');
            process.exit(1);
        }

    }

    logger.info('loading config: ' + JSON.stringify(conf));
    spotify = new SpotifyPlayer(conf, logger)
    spotify.init();

    logger.info('Communication with humix-sense is now ready.');

    hsm.on("play-spotify", function (data) {
        logger.info('received play-spotify data: ' + data);

        var jsonData;
        if (data instanceof String) {
            jsonData = JSON.parse(data)
        }

        // TODO : Check the type of data.
        spotify.playSong(jsonData.songName, jsonData.artistName);
    })
    
});