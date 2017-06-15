var SpotifyPlayer = require('../index');

var spotify = new SpotifyPlayer({
    spotify: {
        clientId: '',
        clientSecret: ''
        redirectUri: ''
    }
});
spotify.init();

// wait for setting access token
var myVar = setTimeout(() => {

    //spotify.playSong("*", "Ed Sheeran");
    //spotify.playPlaylistBySearch("生氣");
    //spotify.playByPlaylist('playlistmesg', '5C8KgLqJyJrxQ6BrfHEDSw');
    spotify.playTopTracksForArtist('16s0YTFcyjP4kgFwt7ktrY');

}, 3000);

// Add another song after 10 seconds

var myVar2 = setTimeout(() => {

    //spotify.playSong("seasons in the sun", "westlife");
    spotify.nextSong();
    //clearInterval(myVar2);

}, 10000);
