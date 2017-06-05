var SpotifyTrackStream = require('spotify-track-stream');
var SpotifyWebApi = require('spotify-web-api-node');
var through = require('through');

var spotify = new SpotifyWebApi({
    clientId: '',
    clientSecret: '',
    accessToken: '',
    refreshToken: ''
});

let tracks = new SpotifyTrackStream(spotify);

tracks.pipe(through(track => console.log(track)));
