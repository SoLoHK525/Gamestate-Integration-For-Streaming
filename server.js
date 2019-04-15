gui = require('nw.gui'),
http = require('http');
debug = true;
fs = require('fs');

port = 1025;
host = '127.0.0.1';

var csgo = {
    map: "de_",
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

server = http.createServer(function (req, res) {
	if (req.method == 'POST') {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});

		var body = '';
		req.on('data', function (data) {
			body += data;
		});
		req.on('end', function () {
			if (!!debug) {
				console.debug("POST payload: " + body);
			}
			execute(JSON.parse(body));
			res.end('');
		});

	} else {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.end("Nothing to see here!");
	}

});

function execute(obj){
    csgo.map = obj.map;
    csgo.round.phase = obj.map.phase;
    csgo.round.round = obj.map.round;
    csgo.score.ct = obj.map.team_ct.score;
    csgo.score.t = obj.map.team_t.score;
    csgo.player = obj.player;
    csgo.weapons = obj.player.weapons;
    print();
}

function print(){
    let weapons = Object.values(csgo.weapons);
    
    //Game State Related
    $("#map").html(mapName(csgo.map.name));
    if(csgo.map.phase == "warmup"){
        $("#phase").html("Warmup");
    }else{
        $("#phase").html("Round " + csgo.map.round);
    }
    
    //Weapon Related
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
    if(csgo.player.state.health <= 20){
        $("#hp").css("color", "red");
        $("#hp_logo").css("color", "red");
    }else{
        $("#hp").css("color", "#fff");
        $("#hp_logo").css("color", "#fff");
    }
    if(csgo.player.state.helmet){
        $("#helmet").attr("src", "./helmet.png");
    }else{
        $("#helmet").attr("src", "./armor.png");
    }
    $("#armor").html(csgo.player.state.armor);
    $("#kills").html(csgo.player.state.round_kills);
    
    //Player State Related
    $("#k").html(csgo.player.match_stats.kills);
    $("#a").html(csgo.player.match_stats.assists);
    $("#d").html(csgo.player.match_stats.deaths);
    
    //Multi-kill Handler
    multiKill(csgo.player.state.round_kills);
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
server.listen(port);
console.log('Listening at http://' + host + ':' + port);