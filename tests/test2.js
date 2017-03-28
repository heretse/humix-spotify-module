var input = "{\"songName\":\"shape of you\",\"artistName\":\"Ed Sheeran\"}";

var re = /\{.*\}/;

if (input.match(re)) {
    var obj = JSON.parse(input);
    console.log("obj.songName = " + obj.songName);
}