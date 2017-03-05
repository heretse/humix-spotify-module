
var SpotifyPlayer = require('../index');

var spotify = new SpotifyPlayer({spotify:{clientId: 'b6ca0e1423e74fae862f59b320e646f2',
    clientSecret: 'a5b0c12d8ea34bedb63d3bde12cb51c9'}});
spotify.init();

// wait for setting access token
var myVar = setInterval(() => {
    
    spotify.playSong("seasons in the sun");
    clearInterval(myVar);

}, 3000);

// Add another song after 3 seconds
var myVar2 = setInterval(() => {

    spotify.playSong("Shape of You", "Ed Sheeran");
    clearInterval(myVar2);

}, 10000);
