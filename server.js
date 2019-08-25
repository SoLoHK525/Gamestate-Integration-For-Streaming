//try { let gui = require('nw.gui');}catch(err){console.log(err)}
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

let fs = require('fs');
let express = require('express');
let path = require('path');
const open = require('open');
let Spotify = require('./Spotify.js');
let app = express();

let http = require('http').createServer(app);
global.io = require('socket.io')(http);
io.on('connection', function(socket){
    console.log('a user connected');
  });


let hudRoute = require('./hudRoute');


setInterval(function(){
    if(Spotify.ready){
        Spotify.getCurrentPlayingSongInfo(function(SongInfo){
            io.emit('Spotify', SongInfo);
        });
    }else{
        //Spotify.hide();
    }
}, 1000);

port = 1025;
host = '127.0.0.1';

open('http://localhost:' + port + '/spotify/login');
open('http://localhost:' + port + '/settings');
//open('http://localhost:' + port);

/*
*   Static Resources
*/
app.use(express.static(__dirname));

app.get('/', function(req, res, next) {
    res.status(200).sendFile('index.html', {root: './'});
});

app.get('/settings', function(req, res, next) {
    res.status(200).sendFile('index.html', {root: 'static/'});
});

app.post('/', function(req, res, next) {
    let body = '';
    req.on('data', function(data) {
        body += data;
    })

    req.on('end', function(){
        if(!!debug){
            console.log("POST payload: " + body);
        }
        console.log("POST payload: " + body);
        io.emit('csgo', body);
        res.setHeader('Content-Type', 'text/html')
        res.writeHead(200, '');
        res.end();
    })
});

app.use('/spotify', Spotify.web);
app.use('/hud', hudRoute);

http.listen(port, function(){
    console.log('listening on *:' + port);
  });