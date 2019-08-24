try { let gui = require('nw.gui');}catch(err){console.log(err)}
let debug = true;
if(debug) {
    $ = () => {
        let obj = {
            removeClass: () => {return obj},
            addClass: () => {return obj},
            show: () => {return obj},
            hide: () => {return obj},
            attr: () => {return obj},
            css: () => {return obj},
            html: (content) => {
                console.log(content);
                return obj},
        }
        return obj;
    };
}

let http = require('http');
let fs = require('fs');
let express = require('express');
let path = require('path');
const open = require('open');
let Spotify = require('./Spotify.js');

let app = express();

let hud = require('./hud');
let hudRoute = require('./hudRoute');
setTimeout(function(){
    hud.$($);
}, 100);

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


Spotify.hide = function(){
    $("#spotify").removeClass("fadeInRight");
    $("#spotify").addClass("fadeOutLeft");
    spotifyTimeout = setTimeout(function(){
        $("#spotify").hide();
    }, 1000);
}

Spotify.show = function(){
    $("#spotify").show();
    $("#spotify").removeClass("fadeOutLeft");
    $("#spotify").addClass("fadeInRight");
}

setInterval(function(){
    if(Spotify.ready){
        Spotify.getCurrentPlayingSongInfo(function(SongInfo){
            if(!SongInfo.playing){
                Spotify.hide();
            }else{
                Spotify.show();
            }
            //$("#spotify").html(JSON.stringify(SongInfo));
            $("#spotify-track-img").attr("src", SongInfo.images[2].url);
            $("#spotify-track-name").html(SongInfo.name);
            let artistName = "";
            
            for(let i = 0; i < SongInfo.artists.length; i++){
                if(i == 0){
                    artistName += SongInfo.artists[i];
                }else{
                    artistName += ", " + SongInfo.artists[i];
                }
            }
            $("#spotify-track-artist").html(artistName);
            $("#spotify-time-display").html(millisToMinutesAndSeconds(SongInfo.progress));
            let progress = ((SongInfo.progress / SongInfo.length) * 100).toPrecision(3);
            $(".spotify-time-content").css("width", progress + "%")
        });
    }else{
        Spotify.hide();
    }
}, 1000);

port = 1025;
host = '127.0.0.1';

open('http://localhost:' + port + '/spotify/login');
open('http://localhost:' + port);

/*
*   Static Resources
*/
app.get('/', function(req, res, next) {
    res.status(200).sendFile('index.html', {root: 'static/'});
});

app.post('/', function(req, res, next) {
    let body = '';
    req.on('data', function(data) {
        body += data;
    })

    req.on('end', function(){
        if(!!debug){
            console.debug("POST payload: " + body);
        }
        hud.updateData(JSON.parse(body));
        res.end();
    })
    res.status(200).setHeader('Content-Type', 'text/html');
    res.send('');
});

app.use('/spotify', Spotify.web);
app.use('/hud', hudRoute);

app.listen(port);
//server.listen(port);
console.log('Listening at http://' + host + ':' + port);