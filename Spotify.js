const fs = require('fs');
const axios = require('axios');
const express = require('express');
const qs = require('qs');
let Spotify = {};

var client_id = 'd20e921a6eba489a93eb018715a05f53'; // Your client id
var client_secret = '3e7ddc307f2e429a8a58adba64271916'; // Your secret
var redirect_uri = 'http://' + hostname + ':' + port + '/spotify/callback';
let scopes = encodeURIComponent('user-read-currently-playing user-read-playback-state');

Spotify.ready = false;

Spotify.access_token = "";
Spotify.refresh_token = "";
Spotify.refreshInterval;

Spotify.web = express.Router();

Spotify.web.get('/login', function(req, res, next) {
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + client_id +
    '&scope=' + scopes +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

Spotify.web.get('/callback', function(req, res, next){
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      data: qs.stringify({
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'redirect_uri': redirect_uri
      })
    })
      .then(function(response){
        res.send("<html><body>Succeed to retrive token from Spotify API: <br>" + JSON.stringify(response.data) + "<br>This page will be closed in 5 seconds</body><script>setTimeout(function(){window.close()}, 5000)</script></html>");
        Spotify.access_token = response.data.access_token;
        Spotify.refresh_token = response.data.refresh_token;
        Spotify.refreshInterval = response.data.expires_in;
        Spotify.ready = true;
        setInterval(function(){
          axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
              'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            data: qs.stringify({
              'grant_type': 'refresh_token',
              'refresh_token': Spotify.refresh_token
            })
          })
          .then(function(response){
            console.log(response.data)
            Spotify.access_token = response.data.access_token;
            next();
          })
          .catch(function(err){
            console.log(err.data)
          });
        }, (Spotify.refreshInterval - 60) * 1000 );

        next();
      })
      .catch(function(err){
        console.log(err.response.data)
        res.json(err.response.data);
      });
});

Spotify.web.get('/auth', function(req, res, next) {
  res.json(req.query);
});

Spotify.get = function (url){
    return axios({
        method: 'get',
        url: 'https://api.spotify.com' + url,
        headers: {
          Authorization: 'Bearer ' + Spotify.access_token
        }
      });
};

Spotify.post = function (url){
    return axios({
        method: 'post',
        url: 'https://api.spotify.com' + url,
        headers: {
          Authorization: 'Bearer ' + Spotify.access_token
        }
      });
};

Spotify.put = function (url){
    return axios({
        method: 'put',
        url: 'https://api.spotify.com' + url,
        headers: {
          Authorization: 'Bearer ' + Spotify.access_token
        }
      });
};

Spotify.delete = function (url){
    return axios({
        method: 'delete',
        url: 'https://api.spotify.com' + url,
        headers: {
          Authorization: 'Bearer ' + Spotify.access_token
        }
      });
};

Spotify.getCurrentPlayingSongInfo = function(cb){
  let promise = new Promise (function(resolve, reject){
    let SongInfo = {};
    let requestURL = "/v1/me/player/currently-playing?timestamp=" + new Date().getTime();
    Spotify.get(requestURL)
        .catch((err) => {
            return console.log(err.response);
        })
        .then(function(response){
            let data = response.data;
            let song = data.item;
            SongInfo.URL = requestURL;
            SongInfo.playing = data.is_playing;
            SongInfo.progress = data.progress_ms;
            SongInfo.name = song.name;
            SongInfo.id = song.id;
            SongInfo.artists = [];
            for(let i = 0; i < song.artists.length; i++){
                SongInfo.artists.push(song.artists[i].name);
            }
            SongInfo.length = song.duration_ms;
            SongInfo.images = song.album.images;
            SongInfo.token = Spotify.access_token;
            resolve(SongInfo);
        });
  });
  promise.then(function(SongInfo){
    cb(SongInfo);
  });
}

module.exports = Spotify;