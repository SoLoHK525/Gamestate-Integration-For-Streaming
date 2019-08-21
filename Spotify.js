const fs = require('fs');
const axios = require('axios');
let Spotify = {};

var client_id = 'd20e921a6eba489a93eb018715a05f53'; // Your client id
var client_secret = '3e7ddc307f2e429a8a58adba64271916'; // Your secret

Spotify.token = "BQAJvhohW35GkAvOer1ySFtBegT8NHXE34AtdvABk_20PMwnN2FfaIwUWynAJGkGlehbRCDuMxqm7OWnM0afiPaqqNMF4n8YDdOp-iozH3vT3sr0awLFhA2YCL9f2-vzATwS6wKtghdmSPIK0dgow2zdkcdRXT1Jv_AEJ1En75mepJhVfuxjeoB4JWsR7sc-ysikaykKpwfti2hiA1_QJ5QNVIdE-uAERgEpIHqrEw6YKMsichNDx0XpnI18M1y7rjMKCrYpcn9-";

Spotify.init = function(cb){
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    data: "grant_type=client_credentials"
  })
  .catch(function(err){
    console.log(err.response);
    fs.writeFile("./response.json", JSON.stringify(err.response), (erre) => {
      console.log(erre);
    });
  })
  .then(function(response){
    cb(response.data.access_token);
  })
}

Spotify.get = function (url){
    return axios({
        method: 'get',
        url: 'https://api.spotify.com' + url,
        headers: {
          Authorization: 'Bearer ' + Spotify.token
        }
      });
};

Spotify.post = function (url){
    return axios({
        method: 'post',
        url: 'https://api.spotify.com' + url,
        headers: {
          Authorization: 'Bearer ' + Spotify.token
        }
      });
};

Spotify.put = function (url){
    return axios({
        method: 'put',
        url: 'https://api.spotify.com' + url,
        headers: {
          Authorization: 'Bearer ' + Spotify.token
        }
      });
};

Spotify.delete = function (url){
    return axios({
        method: 'delete',
        url: 'https://api.spotify.com' + url,
        headers: {
          Authorization: 'Bearer ' + Spotify.token
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
            resolve(SongInfo);
        });
  });
  promise.then(function(SongInfo){
    cb(SongInfo);
  });
}

module.exports = Spotify;