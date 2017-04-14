var SpotifyTrackStream = require('spotify-track-stream');
var SpotifyWebApi = require('spotify-web-api-node');
var through = require('through');

var spotify = new SpotifyWebApi({
    clientId: 'b6ca0e1423e74fae862f59b320e646f2',
    clientSecret: 'a5b0c12d8ea34bedb63d3bde12cb51c9',
    accessToken: 'BQBUIXA8CszU1PYaHEA_FfM2CAhaqnrpZ_ilcp_xbYnJXyYiP4grROcwOlNMLVufefObQF2G_DqUDG-LK8PJFXvPeKCWLtQv_PBRWIbNzZowzFM_Yw12gLViKgqA4DJXeLMn37NxNDYsrv6Ojtdk2Eu9z-PS_kMUbT8QAyBVdzGn7SiiQfmSieOsVFPVOPsszLT3gSoZALEC2zB09YDOspXph_TDKJl1XwYHuFH6sTgxTe2I2PxZS550W1EjxUfbxOPkWl_JtjrSl1o6rTooKEm_zXKJPb4TX7qm6W8QBHRuRQ5HhxacFSGTTdJCXIM',
    refreshToken: 'AQAEwUHYblGpNHU5FVJYGXlWEENBzf9JUJ5vicDlG7nZUZiT54rp3WKzHgEEoHhogWq5UOYy0k7YEdI0Vk5jY9S9ahX0b9dRZG2pvLWU8Qs-H9RjekEhPjyEIvAJkrH7Brs>'
});

let tracks = new SpotifyTrackStream(spotify);

tracks.pipe(through(track => console.log(track)));