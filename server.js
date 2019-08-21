let gui = require('nw.gui');
let http = require('http');
let debug = true;
let fs = require('fs');
let express = require('express');
const open = require('open');
let Spotify = require('./Spotify.js');

let app = express();

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

var csgo = {
    map: "de_test",
    round: {
        phase: null
    },
    score: {
        ct: 0,
        t: 0
    },
    player: {
        state: {
            health: 0,
            armor: 0,
            helmet: false,
            money: 0,
            round_kills: 0,
            round_killhs: 0,
            equip_value: 0
        },
        weapons: {}
    }
}

app.post('/', function(req, res, next) {
    let body = '';
    req.on('data', function(data) {
        body += data;
    })

    req.on('end', function(){
        if(!!debug){
            console.debug("POST payload: " + body);
        }
        execute(JSON.parse(body));
        res.end();
    })
    res.status(200).setHeader('Content-Type', 'text/html');
    res.send('');
});

app.use('/spotify', Spotify.web);

function execute(obj){
    csgo.map = obj.map;
    csgo.round.phase = obj.map.phase;
    csgo.round.round = obj.map.round;
    csgo.score.ct = obj.map.team_ct.score;
    csgo.score.t = obj.map.team_t.score;
    csgo.player = obj.player;
    csgo.weapons = obj.player.weapons;
    csgo.provider = obj.provider;
    print();
}

function print(){
    //Game State Related
    $("#map").html(mapName(csgo.map.name));
    $("#money").html("$" + csgo.player.state.money);
    if(csgo.map.phase == "warmup"){
        $("#phase").html("Warmup");
    }else{
        $("#phase").html("Round " + (csgo.map.round + 1));
    }
    

    //Weapon Related
    let weapons = Object.values(csgo.weapons);
    weapons.forEach(function(weapon, i){
        if(weapon.state == "active"){
            $("#weapon").attr("class", "csgo-icon-lg-2 csgo-icon-" + weapon.name.substring(7, weapon.name.length));
            if(weapon.ammo_clip_max != null){
                $("#ammo").html(weapon.ammo_clip + " / " + weapon.ammo_reserve);
            }else{
                $("#ammo").html("");
            }
        }
    });
    
    //Round State Related
    if(csgo.player.team == "CT"){
        $("#wins-1").html('CT ' + csgo.score.ct);
        $("#wins-1").attr("class", "ct");
        $("#wins-2").html(csgo.score.t + ' T');
        $("#wins-2").attr("class", "t");
    }else{
        $("#wins-1").html('T ' + csgo.score.t);
        $("#wins-1").attr("class", "t");
        $("#wins-2").html(csgo.score.ct + ' CT');
        $("#wins-2").attr("class", "ct");
    }
    
    
    //Player Round State Related
    $("#hp").html(csgo.player.state.health);
    $("#hp-bar").css("width", csgo.player.state.health + "%");
    if(csgo.player.state.health <= 20){
        //$("#hp").css("color", "red");
        $("#hp-bar").css("background-color", "red");
        //$("#hp_logo").css("color", "red");
    }else if(csgo.player.state.health <= 50){
        $("#hp-bar").css("background-color", "yellow");
        //$("#hp").css("color", "#fff");
        //$("#hp_logo").css("color", "#fff");
    }else{
        $("#hp-bar").css("background-color", "#037ffc");
    }
    
    if(csgo.player.state.helmet){
        $("#helmet").attr("src", "./helmet.png");
    }else{
        $("#helmet").attr("src", "./armor.png");
    }
    
    $("#armor").html(csgo.player.state.armor);
    $("#armor-bar").css("width", csgo.player.state.armor + "%");
    if(csgo.player.state.armor <= 20){
        $("#armor-bar").css("background-color", "red");
    }else if(csgo.player.state.armor <= 50){
        $("#armor-bar").css("background-color", "yellow");
    }else{
        $("#armor-bar").css("background-color", "#037ffc");
    }
    
    $("#kills").html(csgo.player.state.round_kills);
    
    //Player State Related
    $("#k").html(csgo.player.match_stats.kills);
    $("#a").html(csgo.player.match_stats.assists);
    $("#d").html(csgo.player.match_stats.deaths);
    
    //Multi-kill Handler
    multiKill(csgo.player.state.round_kills);

    let spectatingTimeout;
    if(csgo.player.steamid != csgo.provider.steamid){
        clearTimeout(spectatingTimeout);
        $("#spectating").show().removeClass("fadeOutRight").addClass("fadeInLeft");
    }else{
        $("#spectating").removeClass("fadeInLeft").addClass("fadeOutRight");
        spectatingTimeout = setTimeout(function(){
            $("#spectating").hide();
        }, 1000);
    }
}

var lastKill = 0;
var comboStarted = false;
var timeout;
var timeout2;
function multiKill(num){
    if(lastKill == num){
        return false;
    }
    lastKill = num;
    comboStarted = true;
    clearTimeout(timeout);
    clearTimeout(timeout2);
    var killMessage = "";
    if(comboStarted) {
        switch(lastKill){
            case 0:
            case 1:
                timeout = setTimeout(function(){
                    comboStarted = false;
                    $("#multikill").removeClass("fadeInLeft");
                    $("#multikill").addClass("fadeOutRight");
                    timeout2 = setTimeout(function(){
                        $("#multikill").hide();
                    }, 1000);
                }, 5000);
                return;
                break;
            case 2:
                killMessage = "Double Kill!";
                break;
            case 3:
                killMessage = "Triple Kill!";
                break;
            case 4:
                killMessage = "Quadra kill!";
                break;
            case 5:
                killMessage = "Penta kill!";
                break;
            default:
                killMessage = "Multi Kill!";
                break;
        }
        $("#multikill").show();
        $("#multikill").removeClass("fadeOutRight");
        $("#multikill").addClass("fadeInLeft");
        $("#multikill").html(killMessage);
        timeout = setTimeout(function(){
            comboStarted = false;
            $("#multikill").removeClass("fadeInLeft");
            $("#multikill").addClass("fadeOutRight");
            timeout2 = setTimeout(function(){
                $("#multikill").hide();
            }, 1000);
        }, 5000);
    }
}

function mapName(str){
    str = str.trim().toLowerCase();
    switch(str) {
        case "de_dust2":
            return "Dust 2";
            break;
        case "de_inferno":
            return "Inferno";
            break;
        case "de_cache":
            return "Cache";
            break;
        case "de_overpass":
            return "Overpass";
            break;
        case "de_cbble":
            return "Cobblestone";
            break;
        case "de_mirage":
            return "Mirage";
            break;
        case "de_train":
            return "Train";
            break;
        case "de_vertigo":
            return "Vertigo";
            break;
        default:
            return str;
            break;
    }
}

app.listen(port);
//server.listen(port);
console.log('Listening at http://' + host + ':' + port);