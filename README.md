## Overview

This humix module is essentially a wrapper for the spotify-web-api-node module and it can make your Humix-Think easier to play review music on Spotify.

##

# Get Started

## Download and install dependencies
```
git clone https://github.com/heretse/humix-spotify-module.git
cd humix-spotify-module
npm install
```
## Config module

**Option1 : modify config.js**

Basically, you need to configure two information:
1. Spotify Client Id
2. Spotify Client Secret

Example config looks like:
```
module.exports = {
    spotify: {
        clientId : 'Your client id',
        clientSecret : 'Your client secret',
    }
};
```
You can create your own Spotify Application on the following URL and obtain your client id and secret:
https://developer.spotify.com/my-applications/#!/applications

**Option2 : use global humix config file (*recommended*)**

You can also provide the config of this module using the global humix config file, which is located at `~/.humix/config.js`
The content is the same as option1, but now you move these config under the "humix-spotify-module" properties. Example config looks like
```
module.exports = {
  ...
  'humix-spotify-module':{
        spotify: {
        clientId : 'Your client id',
        clientSecret : 'Your client secret',
    }
  }
}
```

## Module Commands

Basically, this module has provided three commands for your Humix-Think to control:

1. play-spotify: Play a preview music with the specific song name and artist name 
2. pause-spotify: Pause the player
3. stop-spotify: Stop the play and reset its queue

**The play-spotify needs a input payload with the following JSON format: **
```
{
  songName: 'Shape of you', // This field is required
  artistName: 'Ed Sheeran'
}
```
**If you just want to search only by artist name with the following JSON format: **
```
{
  songName: '*', // This field is required
  artistName: 'Ed Sheeran'
}
```
**If you just want to search only by song name with the following JSON format: **
```
{
  songName: 'Shape of you', // This field is required
}
```

## Start module
```
npm start
```
